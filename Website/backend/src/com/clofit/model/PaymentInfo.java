package com.clofit.model;

import com.clofit.payment.PaymentStrategy;
import java.time.LocalDateTime;

/**
 * PaymentInfo — thông tin thanh toán của một đơn hàng.
 * Quan hệ: Order 1-1 PaymentInfo, PaymentInfo 1-1 PaymentStrategy
 *
 * Tính trừu tượng: PaymentInfo không trực tiếp xử lý thanh toán
 * mà delegate cho PaymentStrategy.
 */
public class PaymentInfo {

    private final int               paymentId;
    private final PaymentStrategy   strategy;      // Strategy pattern — 1-1
    private       double            amount;
    private       LocalDateTime     paymentDate;
    private       boolean           paid;
    private       String            transactionRef;

    private static int idCounter = 1;

    public PaymentInfo(PaymentStrategy strategy) {
        this.paymentId = idCounter++;
        this.strategy  = strategy;
        this.paid      = false;
    }

    /**
     * processPayment() — per class diagram.
     * Delegates to PaymentStrategy.pay() — Strategy pattern in action.
     */
    public boolean processPayment(double amount) {
        this.amount       = amount;
        this.paymentDate  = LocalDateTime.now();
        this.paid         = strategy.pay(amount);
        this.transactionRef = "TXN-" + System.currentTimeMillis();
        return this.paid;
    }

    /* ── Getters ── */
    public int              getPaymentId()      { return paymentId; }
    public String           getMethodName()     { return strategy.getMethodName(); }
    public double           getAmount()         { return amount; }
    public LocalDateTime    getPaymentDate()    { return paymentDate; }
    public boolean          isPaid()            { return paid; }
    public String           getTransactionRef() { return transactionRef; }

    @Override
    public String toString() {
        return String.format("PaymentInfo{id=%d, method='%s', amount=%.2f, paid=%b}",
                paymentId, getMethodName(), amount, paid);
    }
}
