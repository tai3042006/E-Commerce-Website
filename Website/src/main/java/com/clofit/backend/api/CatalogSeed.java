package com.clofit.backend.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
class CatalogSeed implements ApplicationRunner {
    private final JdbcTemplate db;
    private final ObjectMapper json;
    private final boolean enabled;

    CatalogSeed(JdbcTemplate db,ObjectMapper json,@Value("${SEED_CATALOG:true}") boolean enabled) {
        this.db=db; this.json=json; this.enabled=enabled;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        try (InputStream stream=new ClassPathResource("catalog.json").getInputStream()) {
            JsonNode fixture=json.readTree(stream);
            for (JsonNode category:fixture.path("categories")) {
                db.update("INSERT IGNORE INTO categories(id,label) VALUES (?,?)",
                    category.path("id").asText(),category.path("label").asText());
            }
            if (!enabled || db.queryForObject("SELECT COUNT(*) FROM products",Integer.class)>0) return;
            for (JsonNode product:fixture.path("products")) {
                String id=product.path("id").asText();
                int created=db.update("""
                    INSERT IGNORE INTO products(id,name,tagline,description,price,old_price,image,hover_image,category_id,gender,rating,reviews,badge,in_stock)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                    """,id,product.path("name").asText(),text(product,"tagline"),text(product,"description"),
                    product.path("price").decimalValue(),product.hasNonNull("oldPrice")?product.path("oldPrice").decimalValue():null,
                    text(product,"image"),text(product,"hoverImage"),product.path("category").asText(),
                    product.path("gender").asText("unisex"),product.path("rating").decimalValue(),product.path("reviews").asInt(),
                    text(product,"badge"),product.path("inStock").asBoolean(true));
                if (created==0) continue;
                int sort=0;
                for (JsonNode image:product.path("gallery")) db.update("INSERT INTO product_images(product_id,url,sort_order) VALUES (?,?,?)",id,image.asText(),sort++);
                for (JsonNode color:product.path("colors")) db.update("INSERT INTO product_colors(product_id,hex) VALUES (?,?)",id,color.asText());
                for (JsonNode size:product.path("sizes")) db.update("INSERT INTO product_sizes(product_id,size) VALUES (?,?)",id,size.asText());
            }
        }
    }

    private static String text(JsonNode node,String key) { return node.path(key).asText(null); }
}
