package com.clofit.backend.api;

import static com.clofit.backend.api.AuthApi.*;
import com.clofit.backend.factory.ProductFactory;
import com.clofit.backend.model.Product;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
class ProductApi {
    private final JdbcTemplate db;
    private final AuthApi auth;
    private final ProductFactory factory = new ProductFactory();

    ProductApi(JdbcTemplate db, AuthApi auth) {
        this.db = db;
        this.auth = auth;
    }

    @GetMapping("/products")
    List<Map<String,Object>> list(@RequestParam(required=false) String gender,
                                  @RequestParam(required=false) String category,
                                  @RequestParam(required=false) String badge) {
        return hydrate(db.queryForList("""
            SELECT * FROM products WHERE (? IS NULL OR gender=?)
              AND (? IS NULL OR category_id=?) AND (? IS NULL OR badge=?)
            ORDER BY created_at,id
            """, gender, gender, category, category, badge, badge));
    }

    @GetMapping("/products/{id}")
    Map<String,Object> get(@PathVariable String id) {
        return hydrate(db.queryForList("SELECT * FROM products WHERE id=?", id))
            .stream().findFirst().orElseThrow(() -> error(HttpStatus.NOT_FOUND, "not_found"));
    }

    @GetMapping("/categories")
    List<Map<String,Object>> categories() {
        return db.queryForList("SELECT id,label FROM categories WHERE id<>'all' ORDER BY label");
    }

    private List<Map<String,Object>> hydrate(List<Map<String,Object>> rows) {
        if (rows.isEmpty()) return List.of();
        List<String> ids = rows.stream().map(row -> (String) row.get("id")).toList();
        Map<String,List<String>> images = variants("product_images", "url", "sort_order,id", ids);
        Map<String,List<String>> colors = variants("product_colors", "hex", "id", ids);
        Map<String,List<String>> sizes = variants("product_sizes", "size", "id", ids);
        List<Map<String,Object>> result = new ArrayList<>();
        for (Map<String,Object> row : rows) {
            String id = (String) row.get("id");
            Map<String,Object> product = new LinkedHashMap<>(row);
            product.put("oldPrice", product.remove("old_price"));
            product.put("hoverImage", imagePath((String) product.remove("hover_image")));
            product.put("image", imagePath((String) product.get("image")));
            product.put("category", product.remove("category_id"));
            product.put("inStock", truth(product.remove("in_stock")));
            product.remove("created_at");
            product.put("gallery", images.getOrDefault(id,List.of()).stream().map(ProductApi::imagePath).toList());
            product.put("colors", colors.getOrDefault(id,List.of()));
            product.put("sizes", sizes.getOrDefault(id,List.of()));
            result.add(product);
        }
        return result;
    }

    private Map<String,List<String>> variants(String table, String field, String order, List<String> ids) {
        String placeholders = String.join(",", Collections.nCopies(ids.size(), "?"));
        Map<String,List<String>> grouped = new HashMap<>();
        db.query("SELECT product_id," + field + " FROM " + table + " WHERE product_id IN (" + placeholders
            + ") ORDER BY " + order, row -> {
                grouped.computeIfAbsent(row.getString(1), ignored -> new ArrayList<>()).add(row.getString(2));
            }, ids.toArray());
        return grouped;
    }

    @PostMapping("/admin/products")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    Map<String,Object> create(HttpServletRequest request,@RequestBody Map<String,Object> body) {
        auth.requireAdmin(request);
        String id = id();
        save(id, body, true);
        auth.notify("customer", null, "productAdded", "New product: " + body.get("name"), "/product/" + id);
        return get(id);
    }

    @PutMapping("/admin/products/{id}")
    @Transactional
    Map<String,Object> update(HttpServletRequest request,@PathVariable String id,@RequestBody Map<String,Object> body) {
        auth.requireAdmin(request);
        get(id);
        save(id, body, false);
        return get(id);
    }

    private void save(String id, Map<String,Object> body, boolean create) {
        String name = required(body.get("name"), 200);
        String category = required(body.get("category_id"), 50);
        if (db.queryForObject("SELECT COUNT(*) FROM categories WHERE id=?", Integer.class, category) == 0) {
            throw error(HttpStatus.BAD_REQUEST, "invalid_category");
        }
        BigDecimal price = money(body.get("price"));
        String gender = required(body.getOrDefault("gender","unisex"), 20);
        if (!Set.of("men","women","unisex").contains(gender)) throw error(HttpStatus.BAD_REQUEST, "invalid_gender");
        Product product = factory.createProduct(id,name,price.doubleValue(),truth(body.getOrDefault("in_stock",true)) ? 1 : 0,null);
        String tagline = optional(body.get("tagline"),300);
        String description = optional(body.get("description"),5000);
        String image = optional(body.get("image"),500);
        String badge = optional(body.get("badge"),50);
        Object[] fields = {product.getName(),price,category,gender,tagline,description,image,badge,product.getStock(),product.getId()};
        if (create) db.update("INSERT INTO products(name,price,category_id,gender,tagline,description,image,badge,in_stock,id) VALUES (?,?,?,?,?,?,?,?,?,?)", fields);
        else db.update("UPDATE products SET name=?,price=?,category_id=?,gender=?,tagline=?,description=?,image=?,badge=?,in_stock=? WHERE id=?", fields);
        saveVariants(id,body,"sizes","product_sizes","size",20);
        saveVariants(id,body,"colors","product_colors","hex",10);
    }

    private void saveVariants(String id, Map<String,Object> body, String key, String table, String column, int maxLength) {
        if (!body.containsKey(key)) return;
        if (!(body.get(key) instanceof List<?> values) || values.size()>40) throw error(HttpStatus.BAD_REQUEST,"invalid_" + key);
        db.update("DELETE FROM " + table + " WHERE product_id=?",id);
        for (Object value : values) db.update("INSERT INTO " + table + " (product_id," + column + ") VALUES (?,?)",id,required(value,maxLength));
    }

    @PatchMapping("/admin/products/{id}/stock")
    Map<String,Boolean> stock(HttpServletRequest request,@PathVariable String id,@RequestBody Map<String,Object> body) {
        auth.requireAdmin(request);
        get(id);
        db.update("UPDATE products SET in_stock=? WHERE id=?",truth(body.get("in_stock")),id);
        return Map.of("ok",true);
    }

    @DeleteMapping("/admin/products/{id}")
    Map<String,Boolean> delete(HttpServletRequest request,@PathVariable String id) {
        auth.requireAdmin(request);
        if (db.update("DELETE FROM products WHERE id=?", id)==0) throw error(HttpStatus.NOT_FOUND,"not_found");
        return Map.of("ok",true);
    }

    @PostMapping("/upload")
    Map<String,String> upload(HttpServletRequest request,@RequestParam("image") MultipartFile file) throws java.io.IOException {
        auth.requireAdmin(request);
        String type = file.getContentType();
        byte[] data = file.getBytes();
        if (type == null || !Set.of("image/jpeg","image/png","image/webp").contains(type) || !imageMatches(type, data)) {
            throw error(HttpStatus.BAD_REQUEST,"invalid_image");
        }
        String id = id();
        db.update("INSERT INTO product_uploads(id,media_type,data) VALUES (?,?,?)",id,type,data);
        return Map.of("url","/api/uploads/" + id);
    }

    @GetMapping("/admin/payment-qr")
    Map<String,String> paymentQr(HttpServletRequest request) {
        auth.requireAdmin(request);
        return db.queryForList("SELECT SHA2(data,256) FROM product_uploads WHERE id='store-qr'",String.class)
            .stream().findFirst().map(hash -> Map.of("url","/api/uploads/store-qr?v=" + hash)).orElse(Map.of());
    }

    @PutMapping("/admin/payment-qr")
    Map<String,String> savePaymentQr(HttpServletRequest request,@RequestParam("image") MultipartFile file) throws java.io.IOException {
        auth.requireAdmin(request);
        String type=file.getContentType();
        byte[] data=file.getBytes();
        if (type==null || !imageMatches(type,data)) throw error(HttpStatus.BAD_REQUEST,"invalid_image");
        db.update("""
            INSERT INTO product_uploads(id,media_type,data) VALUES ('store-qr',?,?)
            ON DUPLICATE KEY UPDATE media_type=?,data=?
            """,type,data,type,data);
        return paymentQr(request);
    }

    @GetMapping("/uploads/{id}")
    ResponseEntity<byte[]> image(@PathVariable String id) {
        return db.query("SELECT media_type,data FROM product_uploads WHERE id=?", row -> {
            if (!row.next()) throw error(HttpStatus.NOT_FOUND,"not_found");
            return ResponseEntity.ok().contentType(MediaType.parseMediaType(row.getString(1)))
                .header("Cache-Control","public, max-age=31536000, immutable")
                .header("X-Content-Type-Options","nosniff").body(row.getBytes(2));
        }, id);
    }

    private static boolean imageMatches(String type, byte[] data) {
        if (data.length < 12) return false;
        return switch (type) {
            case "image/jpeg" -> (data[0]&255)==255 && (data[1]&255)==216 && (data[2]&255)==255;
            case "image/png" -> (data[0]&255)==137 && data[1]=='P' && data[2]=='N' && data[3]=='G';
            case "image/webp" -> data[0]=='R' && data[1]=='I' && data[2]=='F' && data[3]=='F'
                && data[8]=='W' && data[9]=='E' && data[10]=='B' && data[11]=='P';
            default -> false;
        };
    }

    private static String imagePath(String path) {
        return path != null && path.startsWith("/src/assets/product-") ? path.replace("/src/assets/","/images/") : path;
    }

    static boolean truth(Object value) {
        return Boolean.TRUE.equals(value) || value instanceof Number number && number.intValue()==1;
    }

    static BigDecimal money(Object value) {
        try {
            BigDecimal amount = new BigDecimal(String.valueOf(value)).setScale(2,java.math.RoundingMode.UNNECESSARY);
            if (amount.signum()>=0 && amount.compareTo(new BigDecimal("99999999.99"))<=0) return amount;
        } catch (NumberFormatException | ArithmeticException ignored) {}
        throw error(HttpStatus.BAD_REQUEST,"invalid_amount");
    }
}
