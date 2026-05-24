package com.clofit.server;

import com.clofit.controller.ApiResponse;
import com.clofit.controller.OrderController;
import com.clofit.controller.ProductController;
import com.clofit.dao.DatabaseConnection;
import com.clofit.dao.ProductDAO;
import com.clofit.factory.ProductFactory;
import com.clofit.model.*;
import com.clofit.observer.ObserverFactory;
import com.clofit.observer.OrderService;
import com.clofit.payment.PaymentStrategy;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.logging.*;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  CLOFIT Backend — updated per TKHDT class diagram           ║
 * ║  Design Patterns:                                            ║
 * ║    Singleton  — DatabaseConnection                           ║
 * ║    Factory    — ProductFactory                               ║
 * ║    Observer   — OrderService (Email/Inventory/Notification)  ║
 * ║    Strategy   — PaymentStrategy (Credit/Cash/EWallet)        ║
 * ║    MVC        — Controller layer                             ║
 * ║  Class hierarchy: User → Customer, Admin                     ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
public class Main {

    private static final Logger LOG  = Logger.getLogger(Main.class.getName());
    private static final int    PORT = 8080;

    public static void main(String[] args) throws IOException {

        // ── SINGLETON ────────────────────────────────────────────
        DatabaseConnection db = DatabaseConnection.getInstance();
        LOG.info("DB ready: " + db);

        // ── DAO + Controllers ─────────────────────────────────────
        ProductDAO        productDAO        = new ProductDAO();
        OrderService      orderService      = new OrderService();
        ProductController productController = new ProductController(productDAO);
        OrderController   orderController   = new OrderController(orderService);

        // ── OBSERVER ─────────────────────────────────────────────
        orderService.subscribe(ObserverFactory.emailObserver());
        orderService.subscribe(ObserverFactory.inventoryObserver());
        orderService.subscribe(ObserverFactory.notificationObserver()); // NEW per class diagram
        var analytics = ObserverFactory.analyticsObserver();
        orderService.subscribe(analytics);

        // ── FACTORY ──────────────────────────────────────────────
        Product sample1 = ProductFactory.createLimitedEdition("Velvet Midnight Blazer", "formal", 280.00);
        Product sample2 = ProductFactory.createSaleItem("Summer Linen Tee", "tee", 32.00, 0.20);
        productDAO.save(sample1);
        productDAO.save(sample2);

        // ── CLASS DIAGRAM DEMO (Inheritance + Strategy) ───────────
        Customer testCustomer = new Customer(
                "Anh Tài", "0901234567", "tai@clofit.com", "pass123",
                "147 Fashion District, HCMC");

        Admin testAdmin = new Admin(
                "Admin CLOFIT", "0909999999", "admin@clofit.com", "adminpass", "SUPER");

        LOG.info("[DEMO] Customer: " + testCustomer);
        LOG.info("[DEMO] Admin:    " + testAdmin);

        // Strategy pattern demo — cart → checkout
        productDAO.findById(1).ifPresent(p -> {
            testCustomer.getCart().addItem(p, 2);
            LOG.info("[DEMO] Cart: " + testCustomer.getCart());
        });

        // ── HTTP SERVER ───────────────────────────────────────────
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/products", exchange -> {
            addCors(exchange);
            String method = exchange.getRequestMethod();
            String path   = exchange.getRequestURI().getPath();
            String query  = exchange.getRequestURI().getQuery();
            if ("OPTIONS".equals(method)) { exchange.sendResponseHeaders(204, -1); return; }

            String[] parts = path.split("/");
            String json; int statusCode;
            try {
                if (parts.length == 3) {
                    if ("GET".equals(method)) {
                        Map<String, String> params = parseQuery(query);
                        ApiResponse<?> res = productController.getAllProducts(
                                params.get("category"), params.get("sort"));
                        json = res.toJson(); statusCode = res.getStatus();
                    } else if ("POST".equals(method)) {
                        ApiResponse<?> res = productController.createProduct(readBody(exchange));
                        json = res.toJson(); statusCode = res.getStatus();
                    } else { json = error("Method not allowed"); statusCode = 405; }
                } else if (parts.length == 4) {
                    String seg = parts[3];
                    if ("search".equals(seg) && "GET".equals(method)) {
                        ApiResponse<?> res = productController.searchProducts(parseQuery(query).get("q"));
                        json = res.toJson(); statusCode = res.getStatus();
                    } else {
                        int id = Integer.parseInt(seg);
                        if ("GET".equals(method)) {
                            ApiResponse<?> res = productController.getProductById(id);
                            json = res.toJson(); statusCode = res.getStatus();
                        } else if ("PUT".equals(method)) {
                            ApiResponse<?> res = productController.updateProduct(id, readBody(exchange));
                            json = res.toJson(); statusCode = res.getStatus();
                        } else if ("DELETE".equals(method)) {
                            ApiResponse<?> res = productController.deleteProduct(id);
                            json = res.toJson(); statusCode = res.getStatus();
                        } else { json = error("Method not allowed"); statusCode = 405; }
                    }
                } else { json = error("Not found"); statusCode = 404; }
            } catch (NumberFormatException e) { json = error("Invalid ID"); statusCode = 400;
            } catch (Exception e)             { json = error(e.getMessage()); statusCode = 500; }
            sendJson(exchange, statusCode, json);
        });

        // ── GET /api/categories ───────────────────────────────────
        server.createContext("/api/categories", exchange -> {
            addCors(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) { exchange.sendResponseHeaders(204, -1); return; }
            String cats = productDAO.getCategories().entrySet().stream()
                    .map(e -> String.format("{\"key\":\"%s\",\"name\":\"%s\",\"description\":\"%s\"}",
                            e.getKey(), e.getValue().getName(), e.getValue().getDescription()))
                    .collect(java.util.stream.Collectors.joining(",", "[", "]"));
            sendJson(exchange, 200, cats);
        });

        server.createContext("/api/orders", exchange -> {
            addCors(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) { exchange.sendResponseHeaders(204, -1); return; }
            String method = exchange.getRequestMethod();
            String path   = exchange.getRequestURI().getPath();
            String[] parts = path.split("/");
            String json; int statusCode;
            try {
                if ("GET".equals(method) && parts.length == 3) {
                    ApiResponse<?> res = orderController.getAllOrders();
                    json = res.toJson(); statusCode = res.getStatus();
                } else if ("PUT".equals(method) && parts.length == 5 && "status".equals(parts[4])) {
                    ApiResponse<?> res = orderController.updateStatus(parts[3], readBody(exchange));
                    json = res.toJson(); statusCode = res.getStatus();
                } else { json = error("Not found"); statusCode = 404; }
            } catch (Exception e) { json = error(e.getMessage()); statusCode = 500; }
            sendJson(exchange, statusCode, json);
        });

        server.createContext("/health", exchange -> {
            addCors(exchange);
            sendJson(exchange, 200,
                "{\"status\":\"UP\",\"service\":\"CLOFIT\",\"version\":\"2.0.0\"}");
        });

        server.setExecutor(null);
        server.start();

        LOG.info("╔════════════════════════════════════════════╗");
        LOG.info("║  CLOFIT Backend v2.0 — port " + PORT + "          ║");
        LOG.info("║  http://localhost:" + PORT + "/api/products      ║");
        LOG.info("║  http://localhost:" + PORT + "/api/categories    ║");
        LOG.info("║  http://localhost:" + PORT + "/health            ║");
        LOG.info("╚════════════════════════════════════════════╝");
    }

    /* ── HTTP helpers (unchanged) ── */
    private static void addCors(HttpExchange ex) {
        ex.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ex.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        ex.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
    }
    private static void sendJson(HttpExchange ex, int code, String json) throws IOException {
        byte[] b = json.getBytes(StandardCharsets.UTF_8);
        ex.sendResponseHeaders(code, b.length);
        try (OutputStream os = ex.getResponseBody()) { os.write(b); }
    }
    private static Map<String, String> parseQuery(String q) {
        Map<String, String> m = new HashMap<>();
        if (q == null || q.isBlank()) return m;
        for (String p : q.split("&")) { String[] kv = p.split("=", 2); if (kv.length == 2) m.put(kv[0], kv[1]); }
        return m;
    }
    private static Map<String, String> readBody(HttpExchange ex) throws IOException {
        Map<String, String> m = new HashMap<>();
        try (BufferedReader r = new BufferedReader(new InputStreamReader(ex.getRequestBody(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder(); String line;
            while ((line = r.readLine()) != null) sb.append(line);
            String body = sb.toString().trim().replaceAll("[{}\"]", "");
            for (String p : body.split(",")) { String[] kv = p.split(":", 2); if (kv.length == 2) m.put(kv[0].trim(), kv[1].trim()); }
        }
        return m;
    }
    private static String error(String msg) {
        return "{\"status\":500,\"success\":false,\"message\":\"" + msg + "\",\"data\":null}";
    }
}
