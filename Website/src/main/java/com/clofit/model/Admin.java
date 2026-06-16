package com.clofit.model;


public class Admin extends User {
    private int adminLevel;

    public Admin(String id, String name, String email, String password, int adminLevel) {
        super(id, name, email, password, "Admin");
        this.adminLevel = adminLevel;
    }

    @Override
    public boolean login(String email, String password) {
        if (this.email.equals(email) && this.password.equals(password)) {
            System.out.println(">> Admin [" + name + "] ĐÃ ĐĂNG NHẬP hỏa tốc mật độ " + adminLevel + "!");
            return true;
        }
        return false;
    }

    @Override
    public void logout() {
        System.out.println(">> Admin [" + name + "] đã đăng xuất an toàn.");
    }

    public int getAdminLevel() { return adminLevel; }
    public void setAdminLevel(int adminLevel) { this.adminLevel = adminLevel; }
}