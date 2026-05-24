package com.clofit.model;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  ABSTRACT CLASS: User                                        ║
 * ║  Lớp cha trừu tượng cho Customer và Admin.                   ║
 * ║  Tính kế thừa: Customer, Admin extends User                  ║
 * ║  Thuộc tính chung: userID, name, phone, email, status        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
public abstract class User {

    // Private fields — Tính đóng gói (Encapsulation)
    private final int    userId;
    private String name;
    private String phone;
    private String email;
    private String password;   // stored as hash in production
    private String status;     // "active" | "locked"

    private static int idCounter = 1;

    protected User(String name, String phone, String email, String password) {
        this.userId   = idCounter++;
        this.name     = name;
        this.phone    = phone;
        this.email    = email;
        this.password = password;
        this.status   = "active";
    }

    /* ── Methods per class diagram ── */

    /**
     * login() — validates credentials (mock: always true for non-empty password)
     */
    public boolean login(String email, String password) {
        return this.email.equals(email) && this.password.equals(password);
    }

    public void logout() {
        // Invalidate session token — handled by auth layer in production
    }

    public void updateProfile(String name, String phone) {
        this.name  = name;
        this.phone = phone;
    }

    /* ── Abstract method: role identifier ── */
    public abstract String getRole();

    /* ── Observer hook — update(message) per class diagram ── */
    public void update(String message) {
        System.out.printf("[NOTIFY → %s] %s%n", name, message);
    }

    /* ── Getters ── */
    public int    getUserId()  { return userId; }
    public String getName()    { return name; }
    public String getPhone()   { return phone; }
    public String getEmail()   { return email; }
    public String getStatus()  { return status; }

    /* ── Setters ── */
    public void setStatus(String status) { this.status = status; }
    public void setEmail(String email)   { this.email  = email;  }

    @Override
    public String toString() {
        return String.format("User{id=%d, name='%s', role='%s', status='%s'}",
                userId, name, getRole(), status);
    }
}
