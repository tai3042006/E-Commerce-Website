package com.clofit.backend.MVC;

import com.clofit.backend.model.Customer;
import com.clofit.backend.model.User;

public class UserController {

    private User currentUser;
    private UserView userView;

    public UserController(UserView userView) {
        this.userView = userView;
    }

    public Customer register(String email, String password, String name) {
        Customer customer = new Customer(
                java.util.UUID.randomUUID().toString(),
                name, email, password, "", "");
        userView.displayMessage("Customer " + name + " registered successfully.");
        return customer;
    }

    public User login(String email, String password, String customer) {
        userView.displayMessage("Login attempt for: " + email);
        return currentUser;
    }

    public boolean login(User user, String email, String password) {
        boolean success = user.login(email, password);
        if (success) {
            this.currentUser = user;
            userView.displayMessage("Welcome Back, " + currentUser.getName() + "!");
        } else {
            userView.displayMessage("Login failed. Please check your information!");
        }
        return success;
    }

    public void logout() {
        if (currentUser != null) {
            currentUser.logout();
            this.currentUser = null;
        }
    }

    public void viewProfile() {
        if (currentUser != null) {
            userView.displayProfile(currentUser);
        } else {
            userView.displayMessage("Please log in to view your profile!");
        }
    }

    public void updateProfile(String id, String phone, String address) {
        if (currentUser instanceof Customer) {
            Customer c = (Customer) currentUser;
            c.setPhone(phone);
            c.setAddress(address);
            userView.displayMessage("Customer profile has been updated successfully.");
            userView.displayProfile(c);
        }
    }
}
