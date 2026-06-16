package com.clofit.model;
import java.util.ArrayList;
import java.util.List;


public class Customer extends User {
    private String phone;
    private String address;
    private transient WishList wishList;

    public Customer(String id, String name, String email, String password, String phone, String address) {
        super(id, name, email, password, "Customer");
        this.phone = phone;
        this.address = address;
        this.wishList = new WishList("WISH-" + id);
    }

    @Override
    public boolean login(String email, String password) {
        if (this.email.equals(email) && this.password.equals(password)) {
            System.out.println("-> Khách hàng [" + name + "] đăng nhập thành công!");
            return true;
        }
        return false;
    }

    @Override
    public void logout() {
        System.out.println("-> Khách hàng [" + name + "] đã đăng xuất.");
    }

    // Getters & Setters
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public WishList getWishList() { return wishList; }
}