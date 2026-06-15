package com.clofit.backend.MVC;

public class Admin {

    private int adminLevel;

    public Admin(int adminLevel) {
        this.adminLevel = adminLevel;
    }

    public int getAdminLevel() {
        return adminLevel;
    }

    public void setAdminLevel(int adminLevel) {
        this.adminLevel = adminLevel;
    }

    public boolean login() {
        return true;
    }

    public void logout() {
        System.out.println("Admin logged out.");
    }
}