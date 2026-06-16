package com.clofit.model;

import java.util.Date;


public abstract class User {
    protected String id;
    protected String name;
    protected String email;
    protected String password;
    protected String role;
    protected Date createdAt;

    public User(String id, String name, String email, String password, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = new Date();
    }

    public abstract boolean login(String email, String password);
    public abstract void logout();

    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
