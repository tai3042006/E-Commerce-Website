package com.clofit.backend.MVC;

import com.clofit.backend.model.User;

public class UserView implements IView {

    @Override
    public void render() {
    }

    public void displayProfile(User user) {
        System.out.println("============ PROFILE ============");
        System.out.println("ID Customer: " + user.getId());
        System.out.println("UserName: " + user.getName());
        System.out.println("Email address: " + user.getEmail());
        System.out.println("Role: " + user.getRole());
        System.out.println("=========================================");
    }

    public void displayLoginForm() {
        System.out.println(">> Displaying login form...");
    }

    @Override
    public void displayMessage(String msg) {
        System.out.println("[Information]: " + msg);
    }
}