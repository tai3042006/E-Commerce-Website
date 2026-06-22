package com.clofit.backend.model;

import java.util.Date;
import java.util.UUID;

public class Payment {

    private String id;
    private String orderId;
    private String method;
    private double amount;
    private String status;
    private Date scheduledDate;
    private Date processedAt;

    public Payment(String method, double amount) {
        this.id = UUID.randomUUID().toString();
        this.method = method;
        this.amount = amount;
        this.status = "Pending";
        this.scheduledDate = new Date();
        this.processedAt = null;
    }

    public boolean process() {
        try {
            Thread.sleep(1000);
            this.status = "Completed";
            this.processedAt = new Date();
            System.out.println("Payment processed successfully: " + this.id);
            return true;
        } catch (InterruptedException e) {
            this.status = "Failed";
            System.out.println("Payment processing failed: " + this.id);
            return false;
        }
    }

    public String getId() {
        return id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String o) {
        this.orderId = o;
    }

    public String getStatus() {
        return status;
    }

    public String getMethod() {
        return method;
    }

    public double getAmount() {
        return amount;
    }

    public Date getScheduledDate() {
        return scheduledDate;
    }
}
