package com.clofit.backend.api;

import static com.clofit.backend.api.AuthApi.*;
import com.clofit.backend.model.Order;
import com.clofit.backend.model.OrderItem;
import com.clofit.backend.model.Product;
import com.clofit.backend.state.PendingState;
import jakarta.servlet.http.HttpServletRequest;
import java.math.*;
import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
class OrderApi {
    private static final String ORDERS = """
        SELECT o.id,COALESCE(CONCAT('CF-',10428+r.number),o.id) AS displayId,o.order_date AS date,o.total,o.status,o.product_summary AS product,
          o.items_count AS items,c.name AS customer,c.email AS customerEmail,
          p.code AS reference,p.paid_at AS paidAt,(SELECT method FROM offline_payments WHERE order_id=o.id) AS paymentMethod
        FROM orders o JOIN customers c ON c.id=o.customer_id LEFT JOIN order_payments p ON p.order_id=o.id
        LEFT JOIN checkout_requests r ON r.user_id=p.user_id AND o.id=CONCAT('CF-',r.request_id)
        """;
    private final JdbcTemplate db;
    private final AuthApi auth;
    private final PayOsClient payos;

    OrderApi(JdbcTemplate db,AuthApi auth,PayOsClient payos) {
        this.db=db; this.auth=auth; this.payos=payos;
    }

    @GetMapping("/orders/my")
    List<Map<String,Object>> myOrders(HttpServletRequest request) {
        Map<String,Object> user=auth.requireUser(request);
        return db.queryForList(ORDERS + " WHERE p.user_id=? OR (p.code IS NULL AND c.email=?) ORDER BY o.order_date DESC",
            user.get("id"),user.get("email"));
    }

    @GetMapping("/orders")
    List<Map<String,Object>> adminOrders(HttpServletRequest request) {
        auth.requireAdmin(request);
        return db.queryForList(ORDERS + " ORDER BY o.order_date DESC");
    }

    @GetMapping("/orders/{id}/details")
    Map<String,Object> details(HttpServletRequest request,@PathVariable String id) {
        auth.requireAdmin(request);
        Map<String,Object> order=db.queryForList("SELECT address,city,zip,country FROM orders WHERE id=?",id)
            .stream().findFirst().orElseThrow(() -> error(HttpStatus.NOT_FOUND,"not_found"));
        order.put("lines",db.queryForList("""
            SELECT id,product_name AS name,size,quantity AS qty,unit_price AS price
            FROM order_lines WHERE order_id=? ORDER BY id
            """,id));
        return order;
    }

    @GetMapping("/customers")
    List<Map<String,Object>> customers(HttpServletRequest request) {
        auth.requireAdmin(request);
        return db.queryForList("""
            SELECT u.id,u.name,u.email,u.created_at AS joined,COALESCE(c.orders_count,0) AS orders,
                   COALESCE(c.spent,0) AS spent,c.location,1 AS registered
            FROM users u LEFT JOIN customers c ON c.email=u.email WHERE u.role='customer'
            UNION ALL
            SELECT c.id,c.name,c.email,c.joined_at,c.orders_count,c.spent,c.location,0
            FROM customers c WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.email=c.email)
              AND c.email NOT LIKE '%@deleted.invalid'
            ORDER BY joined DESC
            """);
    }

    @DeleteMapping("/customers/{id}")
    @Transactional
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteCustomer(HttpServletRequest request,@PathVariable String id) {
        auth.requireAdmin(request);
        String email=db.queryForList("SELECT email FROM users WHERE id=? AND role='customer' FOR UPDATE",String.class,id)
            .stream().findFirst().orElseThrow(() -> error(HttpStatus.NOT_FOUND,"Customer account not found"));
        db.update("UPDATE customers SET name='Deleted customer',email=?,location=NULL WHERE email=?",id+"@deleted.invalid",email);
        db.update("DELETE FROM sessions WHERE user_id=?",id);
        db.update("DELETE FROM password_resets WHERE user_id=?",id);
        db.update("DELETE FROM notifications WHERE user_id=?",id);
        db.update("DELETE FROM users WHERE id=? AND role='customer'",id);
    }

    @GetMapping(value="/orders/export",produces="text/csv")
    String export(HttpServletRequest request,@RequestParam(required=false) LocalDate from,
                  @RequestParam(required=false) LocalDate to,@RequestParam(required=false) String status) {
        auth.requireAdmin(request);
        StringBuilder csv=new StringBuilder("Order,Customer,Email,Date,Total,Status\r\n");
        for (Map<String,Object> row:db.queryForList(ORDERS + """
            WHERE (p.code IS NULL OR p.paid_at IS NOT NULL) AND
              (? IS NULL OR o.order_date>=?) AND (? IS NULL OR o.order_date<?)
              AND (? IS NULL OR ?='all' OR o.status=?) ORDER BY o.order_date DESC
            """,from,from,to,to==null?null:to.plusDays(1),status,status,status)) {
            csv.append(String.join(",",List.of("id","customer","customerEmail","date","total","status").stream()
                .map(key -> csvCell(row.get(key))).toList())).append("\r\n");
        }
        return csv.toString();
    }

    private static String csvCell(Object value) {
        String text=Objects.toString(value,"");
        if (!text.isEmpty() && "=+-@\t\r\n".indexOf(text.charAt(0))>=0) text="'" + text;
        return "\"" + text.replace("\"","\"\"") + "\"";
    }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    Map<String,Object> placeOrder(HttpServletRequest request,@RequestBody Checkout body) {
        Map<String,Object> user=auth.requireUser(request);
        String userId=(String)user.get("id");
        String email=(String)user.get("email");
        if (body.requestId()==null || body.customer()==null || body.items()==null || body.items().isEmpty() || body.items().size()>100) {
            throw error(HttpStatus.BAD_REQUEST,"shipping_details_and_items_required");
        }
        String method=body.paymentMethod()==null ? "qr" : body.paymentMethod();
        if (!Set.of("qr","cod").contains(method)) throw error(HttpStatus.BAD_REQUEST,"Invalid payment method");
        String orderId="CF-" + body.requestId();
        db.queryForObject("SELECT id FROM users WHERE id=? FOR UPDATE",String.class,userId);
        if (db.queryForList("SELECT id FROM orders WHERE id=?",String.class,orderId).isEmpty()) {
            db.update("INSERT INTO checkout_requests(user_id,request_id) VALUES (?,?) ON DUPLICATE KEY UPDATE request_id=VALUES(request_id)",userId,body.requestId().toString());
            long number=db.queryForObject("SELECT number FROM checkout_requests WHERE user_id=? AND request_id=?",Long.class,userId,body.requestId().toString());
            orderId="CF-" + (10428 + number);
        }
        List<Map<String,Object>> existing=db.queryForList("""
            SELECT o.id AS orderId,o.total,o.status,p.amount_vnd AS amountVnd
            FROM orders o JOIN order_payments p ON p.order_id=o.id WHERE o.id=? AND p.user_id=?
            """,orderId,userId);
        if (!existing.isEmpty()) return existing.getFirst();

        Shipping shipping=body.customer();
        String name=required(shipping.name(),150);
        String address=required(shipping.address(),300);
        String city=required(shipping.city(),100);
        String zip=optional(shipping.zip(),20);
        String country=required(shipping.country(),100);

        List<OrderItem> items=new ArrayList<>();
        List<Object[]> savedLines=new ArrayList<>();
        BigDecimal subtotal=BigDecimal.ZERO;
        for (Line item:body.items()) {
            if (item==null || item.qty()<1 || item.qty()>99) throw error(HttpStatus.BAD_REQUEST,"invalid_quantity");
            String productId=required(item.id(),50);
            Map<String,Object> row=db.queryForList("SELECT id,name,price,in_stock FROM products WHERE id=?",productId)
                .stream().findFirst().orElseThrow(() -> error(HttpStatus.BAD_REQUEST,"unknown_product"));
            if (!ProductApi.truth(row.get("in_stock"))) throw error(HttpStatus.CONFLICT,"product_out_of_stock");
            String size=optional(item.size(),20);
            List<String> sizes=db.queryForList("SELECT size FROM product_sizes WHERE product_id=?",String.class,productId);
            if (!sizes.isEmpty() && !sizes.contains(size)) throw error(HttpStatus.BAD_REQUEST,"invalid_size");
            BigDecimal price=(BigDecimal)row.get("price");
            Product product=new Product(productId,(String)row.get("name"),null,price.doubleValue(),null,1,0,null);
            items.add(new OrderItem(product,item.qty(),product.getPrice()));
            subtotal=subtotal.add(price.multiply(BigDecimal.valueOf(item.qty())));
            savedLines.add(new Object[]{orderId,productId,product.getName(),size,item.qty(),price});
        }
        BigDecimal shippingCost=subtotal.compareTo(BigDecimal.valueOf(80))>0 ? BigDecimal.ZERO : new BigDecimal("5.99");
        BigDecimal discount="CLOFIT10".equals(body.promoCode())
            ? subtotal.movePointLeft(1).setScale(2,RoundingMode.HALF_UP) : BigDecimal.ZERO;
        BigDecimal total=ProductApi.money(subtotal.add(shippingCost).subtract(discount));
        String imageId=null;
        if ("qr".equals(method)) {
            imageId=db.queryForList("SELECT LEFT(SHA2(data,256),48) FROM product_uploads WHERE id='store-qr' FOR UPDATE",String.class)
                .stream().findFirst().orElseThrow(() -> error(HttpStatus.CONFLICT,"Store QR unavailable. Choose cash on delivery."));
            db.update("INSERT IGNORE INTO product_uploads(id,media_type,data) SELECT ?,media_type,data FROM product_uploads WHERE id='store-qr'",imageId);
        }
        String initialStatus="cod".equals(method) ? "pending" : "awaiting_payment";
        Order order=new Order(orderId,total.doubleValue(),Date.valueOf(LocalDate.now()),new PendingState(),items,null);

        db.update("""
            INSERT INTO customers(id,name,email,joined_at) VALUES (?,?,?,NOW())
            ON DUPLICATE KEY UPDATE email=email
            """,id(),name,email);
        String customer=db.queryForObject("SELECT id FROM customers WHERE email=?",String.class,email);
        db.update("""
            INSERT INTO orders(id,customer_id,order_date,total,status,product_summary,items_count,address,city,zip,country)
            VALUES (?,?,NOW(),?,?,?,?,?,?,?,?)
            """,order.getId(),customer,total,initialStatus,order.getItems().getFirst().getProduct().getName(),
            order.getItems().stream().mapToInt(OrderItem::getQuantity).sum(),address,city,zip,country);
        db.batchUpdate("INSERT INTO order_lines(order_id,product_id,product_name,size,quantity,unit_price) VALUES (?,?,?,?,?,?)", savedLines);
        long code=java.util.concurrent.ThreadLocalRandom.current().nextLong(1_000_000_000_000L, 10_000_000_000_000L);
        db.update("INSERT INTO order_payments(code,order_id,user_id,amount_vnd) VALUES (?,?,?,?)",code,order.getId(),userId,0);
        db.update("INSERT INTO offline_payments(order_id,method,image_id) VALUES (?,?,?)",orderId,method,imageId);
        return Map.of("orderId",order.getId(),"total",total,"status",initialStatus);
    }

    @PatchMapping("/orders/{id}/status")
    @Transactional
    Map<String,Object> status(HttpServletRequest request,@PathVariable String id,@RequestBody Map<String,Object> body) {
        auth.requireAdmin(request);
        String status=required(body.get("status"),20);
        if (!Set.of("pending","processing","shipped","delivered","cancelled").contains(status)) {
            throw error(HttpStatus.BAD_REQUEST,"invalid_status");
        }
        Map<String,Object> order=db.queryForList("""
            SELECT o.status,p.user_id,p.paid_at,(SELECT method FROM offline_payments WHERE order_id=o.id) AS method,c.email FROM orders o JOIN customers c ON c.id=o.customer_id
            LEFT JOIN order_payments p ON p.order_id=o.id WHERE o.id=? FOR UPDATE
            """,id).stream().findFirst().orElseThrow(() -> error(HttpStatus.NOT_FOUND,"not_found"));
        if (order.get("user_id")!=null && order.get("paid_at")==null && !("cod".equals(order.get("method")) && !"delivered".equals(status))) throw error(HttpStatus.CONFLICT,"payment_not_confirmed");
        if (!status.equals(order.get("status"))) {
            db.update("UPDATE orders SET status=? WHERE id=?",status,id);
            String user=(String)order.get("user_id");
            if (user==null) user=db.queryForList("SELECT id FROM users WHERE email=?",String.class,order.get("email"))
                .stream().findFirst().orElse(null);
            if (user!=null) auth.notify("user",user,"orderUpdated","Order " + id + " is " + status,"/account");
        }
        return Map.of("ok",true,"status",status);
    }

    record Checkout(UUID requestId, Shipping customer, List<Line> items,String promoCode,String paymentMethod) {}
    record Shipping(String name,String address,String city,String zip,String country) {}
    record Line(String id,int qty,String size) {}
}
