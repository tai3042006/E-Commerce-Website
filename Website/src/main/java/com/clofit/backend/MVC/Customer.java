package com.clofit.backend.MVC;

public class Customer {
private  String phone;
private String address;
public Customer(String phone, String address) {
    this.phone = phone;
    this.address = address;
}
public String getPhone() {
    return phone;
}
public void setPhone(String phone) {
    this.phone = phone;
}
public String getAddress() {
    return address;
}
public void setAddress(String address) {
    this.address = address;
}
public boolean login() {
    return true;
}
public void logout() {
    System.out.println("Customer logged out.");
}

}
