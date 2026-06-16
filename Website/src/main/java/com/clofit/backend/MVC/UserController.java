package com.clofit.backend.MVC;

import com.store.models.User;
import com.store.models.Customer;

public class UserController {
    private User currentUser;
    private UserView userView;

    public UserController(UserView userView) {
        this.userView = userView;
    }

    public boolean login(User user, String email, String password) {
        boolean success = user.login(email, password);
        if (success) {
            this.currentUser = user;
            userView.displayMessage("Chào mừng trở lại, " + currentUser.getName() + "!");
        } else {
            userView.displayMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
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
            userView.displayMessage("Vui lòng đăng nhập để xem thông tin cá nhân!");
        }
    }

    public void updateProfile(String newName, String phone, String address) {
        if (currentUser instanceof Customer) {
            Customer customer = (Customer) currentUser;
            customer.setName(newName);
            customer.setPhone(phone);
            customer.setAddress(address);
            userView.displayMessage("Hồ sơ Khách hàng đã được cập nhật thành công.");
            userView.displayProfile(customer);
        }
    }
}