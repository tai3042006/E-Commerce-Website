package com.clofi.models;

import java.util.Date;
import java.util.UUID;

public class Payment {
    private String id;
    private String method; // Ví dụ: CREDIT_CARD, MOMO, COD, BANK_TRANSFER
    private double amount;
    private String status; // PENDING, COMPLETED, FAILED
    private Date processedAt;

    public Payment(String method, double amount) {
        this.id = "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.method = method;
        this.amount = amount;
        this.status = "PENDING";
    }

    public boolean process() {
        System.out.println("[Thành phần Giao dịch]: Khởi động thanh toán qua kênh " + method + " số tiền " + amount + " VND...");
        this.status = "COMPLETED";
        this.processedAt = new Date();
        System.out.println("[Thành phần Giao dịch]: Thanh toán " + id + " hoàn thủ thành công khép lại chuẩn xác lúc " + processedAt);
        return true;
    }

    public String getStatus() { return status; }
    public String getMethod() { return method; }
}