package com.clofit.backend.MVC;



import com.store.models.User;

public class UserView implements IView {
    
    @Override
    public void render() {}

    public void displayProfile(User user) {
        System.out.println("
============ HỒ SƠ TÀI KHOẢN ============");
        System.out.println("ID: " + user.getId());
        System.out.println("Tên hiển thị: " + user.getName());
        System.out.println("Địa chỉ email: " + user.getEmail());
        System.out.println("Vai trò hệ thống: " + user.getRole());
        System.out.println("=========================================
");
    }

    public void displayLoginForm() {
        System.out.println(">> Đang hiển thị form nhập Email và Mật khẩu...");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Thông báo Người Dùng]: " + msg);
    }
}