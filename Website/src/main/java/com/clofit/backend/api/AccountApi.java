package com.clofit.backend.api;

import static com.clofit.backend.api.AuthApi.*;
import static com.clofit.backend.api.ProductApi.truth;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
class AccountApi {
    private final JdbcTemplate db;
    private final AuthApi auth;

    AccountApi(JdbcTemplate db, AuthApi auth) { this.db = db; this.auth = auth; }

    private enum Resource {
        ADDRESSES("addresses", List.of("full_name","phone","address_line","city")),
        PAYMENT_METHODS("payment_methods",List.of("card_brand","last4","expiry_month","expiry_year"));

        final String table;
        final List<String> fields;
        Resource(String table,List<String> fields) { this.table = table; this.fields = fields; }
        static Resource of(String path) { return "addresses".equals(path) ? ADDRESSES : PAYMENT_METHODS; }
    }

    @GetMapping("/{kind:addresses|payment-methods}")
    List<Map<String,Object>> resources(HttpServletRequest request,@PathVariable String kind) {
        return db.queryForList("SELECT * FROM " + Resource.of(kind).table
            + " WHERE customer_id=? ORDER BY is_default DESC,created_at DESC", auth.userId(request));
    }

    @GetMapping("/{kind:addresses|payment-methods}/{id}")
    Map<String,Object> resource(HttpServletRequest request,@PathVariable String kind,@PathVariable String id) {
        return resource(Resource.of(kind),auth.userId(request),id);
    }

    @PostMapping("/{kind:addresses|payment-methods}")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    Map<String,Object> create(HttpServletRequest request,@PathVariable String kind,@RequestBody Map<String,Object> body) {
        return save(Resource.of(kind),auth.userId(request),id(),body,true);
    }

    @PutMapping("/{kind:addresses|payment-methods}/{id}")
    @Transactional
    Map<String,Object> update(HttpServletRequest request,@PathVariable String kind,@PathVariable String id,@RequestBody Map<String,Object> body) {
        return save(Resource.of(kind),auth.userId(request),id,body,false);
    }

    @DeleteMapping("/{kind:addresses|payment-methods}/{id}")
    @Transactional
    Map<String,Boolean> remove(HttpServletRequest request,@PathVariable String kind,@PathVariable String id) {
        Resource resource = Resource.of(kind);
        String user = auth.userId(request);
        lockUser(user);
        Map<String,Object> row = resource(resource,user,id);
        db.update("DELETE FROM " + resource.table + " WHERE id=? AND customer_id=?",id,user);
        if (truth(row.get("is_default"))) {
            db.update("UPDATE " + resource.table + " SET is_default=1 WHERE customer_id=? ORDER BY created_at,id LIMIT 1",user);
        }
        return Map.of("ok",true);
    }

    @PatchMapping("/{kind:addresses|payment-methods}/{id}/default")
    @Transactional
    Map<String,Object> setDefault(HttpServletRequest request,@PathVariable String kind,@PathVariable String id) {
        Resource resource = Resource.of(kind);
        String user = auth.userId(request);
        lockUser(user);
        resource(resource,user,id);
        db.update("UPDATE " + resource.table + " SET is_default=(id=?) WHERE customer_id=?",id,user);
        return resource(resource,user,id);
    }

    private Map<String,Object> save(Resource resource,String user,String id,Map<String,Object> body,boolean create) {
        lockUser(user);
        Map<String,Object> fields = new HashMap<>();
        if (!create) fields.putAll(resource(resource,user,id));
        fields.putAll(body);
        List<Object> values = new ArrayList<>();
        if (resource == Resource.ADDRESSES) {
            values.add(required(fields.get("full_name"),150));
            values.add(required(fields.get("phone"),50));
            values.add(required(fields.get("address_line"),200));
            values.add(required(fields.get("city"),100));
        } else {
            values.add(required(fields.get("card_brand"),20));
            String last4 = required(fields.get("last4"),4);
            if (!last4.matches("[0-9]{4}")) throw error(HttpStatus.BAD_REQUEST,"invalid_last4");
            values.add(last4);
            values.add(integer(fields.get("expiry_month"),1,12));
            values.add(integer(fields.get("expiry_year"),2000,2200));
        }
        boolean makeDefault = truth(fields.get("is_default")) || (create &&
            db.queryForObject("SELECT COUNT(*) FROM " + resource.table + " WHERE customer_id=?",Integer.class,user)==0);
        if (makeDefault) db.update("UPDATE " + resource.table + " SET is_default=0 WHERE customer_id=?",user);
        values.add(makeDefault);
        values.add(id);
        values.add(user);
        if (create) {
            db.update("INSERT INTO " + resource.table + "(" + String.join(",",resource.fields)
                + ",is_default,id,customer_id) VALUES (?,?,?,?,?,?,?)",values.toArray());
        } else {
            String setters = String.join("=?,",resource.fields) + "=?";
            db.update("UPDATE " + resource.table + " SET " + setters + ",is_default=? WHERE id=? AND customer_id=?", values.toArray());
        }
        return resource(resource,user,id);
    }

    private Map<String,Object> resource(Resource resource,String user,String id) {
        return db.queryForList("SELECT * FROM " + resource.table + " WHERE customer_id=? AND id=?",user,id)
            .stream().findFirst().orElseThrow(() -> error(HttpStatus.NOT_FOUND,"not_found"));
    }

    private void lockUser(String user) {
        db.queryForObject("SELECT id FROM users WHERE id=? FOR UPDATE",String.class,user);
    }

    @GetMapping("/notifications")
    Map<String,Object> notifications(HttpServletRequest request,@RequestParam(defaultValue="20") int limit,
                                     @RequestParam(defaultValue="0") int offset) {
        String user = auth.userId(request);
        List<Map<String,Object>> items = db.queryForList("""
            SELECT n.id,n.event,n.message,n.link,n.created_at AS createdAt,
              (r.notification_id IS NOT NULL OR n.is_read=1) AS isRead
            FROM notifications n
            LEFT JOIN notification_reads r ON r.notification_id=n.id AND r.user_id=?
            WHERE
            """ + audience() + " ORDER BY n.created_at DESC,n.id LIMIT ? OFFSET ?",
            user,user,user,user,Math.clamp(limit,1,100),Math.max(offset,0));
        items.forEach(row -> row.put("isRead", truth(row.get("isRead"))));
        int total = db.queryForObject("SELECT COUNT(*) FROM notifications n WHERE " + audience(),Integer.class,user,user,user);
        return Map.of("items",items,"total",total);
    }

    @GetMapping("/notifications/count")
    Map<String,Integer> unread(HttpServletRequest request) {
        String user = auth.userId(request);
        return Map.of("unread",db.queryForObject("""
            SELECT COUNT(*) FROM notifications n
            LEFT JOIN notification_reads r ON r.notification_id=n.id AND r.user_id=?
            WHERE r.notification_id IS NULL AND n.is_read=0 AND
            """ + audience(),Integer.class,user,user,user,user));
    }

    @PatchMapping({"/notifications/read","/notifications/{id}/read"})
    Map<String,Boolean> read(HttpServletRequest request,@PathVariable(required=false) String id) {
        String user = auth.userId(request);
        db.update("INSERT IGNORE INTO notification_reads(user_id,notification_id) SELECT ?,n.id FROM notifications n WHERE "
            + audience() + " AND (? IS NULL OR n.id=?)",user,user,user,user,id,id);
        return Map.of("ok",true);
    }

    private String audience() {
        return """
            ((n.audience='admin' AND EXISTS(SELECT 1 FROM users WHERE id=? AND role='admin'))
             OR (n.audience='customer' AND EXISTS(SELECT 1 FROM users WHERE id=? AND role<>'admin'))
             OR (n.audience='user' AND n.user_id=?))
            """;
    }

    @GetMapping("/products/{id}/reviews")
    List<Map<String,Object>> reviews(HttpServletRequest request,@PathVariable String id) {
        String viewer = "";
        if (request.getHeader("x-auth-token") != null) {
            try { viewer = auth.userId(request); }
            catch (ResponseStatusException ignored) {}
        }
        return reviews(id,viewer);
    }

    private List<Map<String,Object>> reviews(String productId,String viewer) {
        List<Map<String,Object>> rows = db.queryForList("""
            SELECT p.id,p.product_id AS productId,p.rating,p.comment,p.is_anonymous AS anonymous,p.created_at AS createdAt,p.updated_at AS updatedAt,
              CASE WHEN p.is_anonymous THEN 'Anonymous' ELSE u.name END AS authorName,(p.user_id=?) AS isOwn
            FROM product_reviews p JOIN users u ON u.id=p.user_id WHERE p.product_id=? ORDER BY p.created_at DESC
            """,viewer,productId);
        rows.forEach(row -> {
            row.put("isOwn",truth(row.get("isOwn")));
            row.put("anonymous",truth(row.get("anonymous")));
        });
        return rows;
    }

    @PostMapping("/products/{id}/reviews")
    @Transactional
    Map<String,Object> saveReview(HttpServletRequest request,@PathVariable String id,@RequestBody Map<String,Object> body) {
        String user = auth.userId(request);
        lockProduct(id);
        int rating = integer(body.get("rating"),1,5);
        String comment = optional(body.get("comment"),2000);
        boolean anonymous = truth(body.get("anonymous"));
        db.update("""
            INSERT INTO product_reviews(id,product_id,user_id,rating,comment,is_anonymous) VALUES (?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE rating=?,comment=?,is_anonymous=?
            """,id(),id,user,rating,comment,anonymous,rating,comment,anonymous);
        return Map.of("product",aggregate(id),"review",reviews(id,user).stream().filter(row -> Boolean.TRUE.equals(row.get("isOwn"))).findFirst().orElseThrow());
    }

    @DeleteMapping("/products/{id}/reviews/{reviewId}")
    @Transactional
    Map<String,Object> deleteReview(HttpServletRequest request,@PathVariable String id,@PathVariable String reviewId) {
        Map<String,Object> user=auth.requireUser(request);
        lockProduct(id);
        int deleted=db.update("DELETE FROM product_reviews WHERE id=? AND product_id=? AND (user_id=? OR ?='admin')",reviewId,id,user.get("id"),user.get("role"));
        if (deleted==0) throw error(HttpStatus.NOT_FOUND,"not_found");
        return Map.of("ok",true,"product",aggregate(id));
    }

    private void lockProduct(String id) {
        if (db.queryForList("SELECT id FROM products WHERE id=? FOR UPDATE",id).isEmpty()) {
            throw error(HttpStatus.NOT_FOUND,"not_found");
        }
    }

    private Map<String,Object> aggregate(String id) {
        Map<String,Object> result=db.queryForMap("SELECT ROUND(COALESCE(AVG(rating),0),1) AS rating,COUNT(*) AS reviews FROM product_reviews WHERE product_id=?",id);
        db.update("UPDATE products SET rating=?,reviews=? WHERE id=?",result.get("rating"),result.get("reviews"),id);
        return result;
    }

    static int integer(Object value,int min,int max) {
        if (value instanceof Number number) {
            int whole=number.intValue();
            if (number.doubleValue()==whole && whole>=min && whole<=max) return whole;
        }
        throw error(HttpStatus.BAD_REQUEST,"invalid_number");
    }
}
