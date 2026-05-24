package com.clofit.model;

import java.util.logging.Logger;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  Admin — kế thừa từ User                                     ║
 * ║  Có quyền: manageUser, manageProduct, manageOrder,           ║
 * ║             manageCategory (per class diagram)               ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
public class Admin extends User {

    private static final Logger LOG = Logger.getLogger(Admin.class.getName());

    private final String adminLevel; // "SUPER" | "STAFF"

    public Admin(String name, String phone, String email,
                 String password, String adminLevel) {
        super(name, phone, email, password);
        this.adminLevel = adminLevel;
    }

    /* ── Methods per class diagram ── */

    public void manageUser(User user, String action) {
        // action: "lock" | "unlock" | "delete"
        switch (action.toLowerCase()) {
            case "lock"   -> { user.setStatus("locked");  LOG.info("[ADMIN] Locked user: "   + user.getName()); }
            case "unlock" -> { user.setStatus("active");  LOG.info("[ADMIN] Unlocked user: " + user.getName()); }
            default       -> LOG.warning("[ADMIN] Unknown user action: " + action);
        }
    }

    public void manageProduct(Product product, String action) {
        LOG.info(String.format("[ADMIN] %s product: %s", action, product.getName()));
        // Delegates to ProductDAO in controller layer
    }

    public void manageOrder(Order order, Order.Status newStatus) {
        Order.Status old = order.getStatus();
        order.setStatus(newStatus);
        LOG.info(String.format("[ADMIN] Order %s: %s → %s",
                order.getOrderId(), old, newStatus));
    }

    public void manageCategory(Category category, String action) {
        LOG.info(String.format("[ADMIN] %s category: %s", action, category.getName()));
    }

    @Override
    public String getRole() { return "ADMIN"; }

    public String getAdminLevel() { return adminLevel; }
}
