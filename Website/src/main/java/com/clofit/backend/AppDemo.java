package com.clofit.backend;

import com.clofit.backend.MVC.AdminService;
import com.clofit.backend.MVC.ProductCatalog;
import com.clofit.backend.MVC.ProductController;
import com.clofit.backend.MVC.ProductFilterContext;
import com.clofit.backend.MVC.ProductView;
import com.clofit.backend.MVC.UserController;
import com.clofit.backend.MVC.UserView;
import com.clofit.backend.factory.ProductFactory;
import com.clofit.backend.model.Admin;
import com.clofit.backend.model.Customer;
import com.clofit.backend.observer.AdminObserver;
import com.clofit.backend.observer.CustomerObserver;

public class AppDemo {

    public static void main(String[] args) {

        Admin adminUser = new Admin("A1", "Site Admin", "admin@clofit.com", "admin123", 1);
        AdminObserver adminObserver = new AdminObserver(adminUser);

        Customer aliceModel = new Customer("C1", "Alice", "alice@mail.com", "pass123", "0900000000", "Hanoi");
        CustomerObserver aliceObserver = new CustomerObserver(aliceModel);

        Customer bobModel = new Customer("C2", "Bob", "bob@mail.com", "pass456", "0911111111", "Saigon");
        CustomerObserver bobObserver = new CustomerObserver(bobModel);

        AdminService adminService = AdminService.getInstance();
        adminService.addObserver(adminObserver);

        ProductCatalog catalog = ProductCatalog.getInstance();
        catalog.subscribe(aliceObserver);
        catalog.subscribe(bobObserver);

        System.out.println("\n=== FLOW 1: New user registration ===");
        UserController userController = new UserController(new UserView(), adminService);
        userController.register("charlie@mail.com", "pass789", "Charlie");

        System.out.println("\nAdmin inbox after registration:");
        adminObserver.getNotifications().forEach(n -> System.out.println("  " + n));
        System.out.println("Admin unread count: " + adminObserver.getUnreadCount());

        System.out.println("\n=== FLOW 2: Admin adds a new product ===");
        ProductController productController = new ProductController(
                catalog,
                new ProductView(),
                new ProductFilterContext(),
                new ProductFactory());

        productController.addProduct("Air Runner Sneaker", 89.99, 50, "Shoes");

        System.out.println("\nAlice's inbox after product added:");
        aliceObserver.getNotifications().forEach(n -> System.out.println("  " + n));

        System.out.println("\nBob's inbox after product added:");
        bobObserver.getNotifications().forEach(n -> System.out.println("  " + n));

        System.out.println("\nAll flows completed successfully.");
    }
}
