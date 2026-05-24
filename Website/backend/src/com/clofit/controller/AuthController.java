package com.clofit.controller;

import com.clofit.model.Customer;
import com.clofit.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class AuthController {

    private final List<User> users = new ArrayList<>();

    public ApiResponse<String> register(
            Map<String, String> body
    ) {

        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");

        Customer customer = new Customer(
                name,
                "0000000000",
                email,
                password,
                "Unknown"
        );

        users.add(customer);

        return ApiResponse.created(
                "Registered successfully",
                "User created"
        );
    }

    public ApiResponse<String> login(
            Map<String, String> body
    ) {

        String email = body.get("email");
        String password = body.get("password");

        for(User user : users) {

            if(user.login(email, password)) {

                String token =
                        UUID.randomUUID().toString();

                return ApiResponse.ok(
                        token,
                        "Login successful"
                );
            }
        }

        return ApiResponse.badRequest(
                "Invalid credentials"
        );
    }
}
