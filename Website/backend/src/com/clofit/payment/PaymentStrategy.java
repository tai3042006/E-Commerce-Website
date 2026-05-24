package com.clofit.payment;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  DESIGN PATTERN: STRATEGY                                    ║
 * ║  PaymentStrategy — interface cho thanh toán đa hình.         ║
 * ║  Tính đa hình: CreditCardPayment, CashPayment,               ║
 * ║                EWalletPayment đều implements pay()           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Class diagram: PaymentInfo 1-1 PaymentStrategy
 */
public interface PaymentStrategy {

    /**
     * pay() — Tính trừu tượng: lớp Order chỉ cần gọi pay(),
     * không cần biết chi tiết từng phương thức thanh toán.
     */
    boolean pay(double amount);

    String getMethodName();
}


// ── Concrete Strategy 1: Credit Card ──────────────────────────
class CreditCardPayment implements PaymentStrategy {

    private final String cardNumber;
    private final String cardHolder;
    private final String cvv;

    public CreditCardPayment(String cardNumber, String cardHolder, String cvv) {
        this.cardNumber = cardNumber;
        this.cardHolder = cardHolder;
        this.cvv        = cvv;
    }

    @Override
    public boolean pay(double amount) {
        // Real impl: call bank API, validate card, charge amount
        System.out.printf("[PAYMENT] 💳 Credit Card (%s) charged $%.2f%n",
                maskCard(cardNumber), amount);
        return true;
    }

    @Override public String getMethodName() { return "CREDIT_CARD"; }

    private String maskCard(String num) {
        return "**** **** **** " + (num.length() >= 4
                ? num.substring(num.length() - 4) : "****");
    }
}


// ── Concrete Strategy 2: Cash on Delivery ─────────────────────
class CashPayment implements PaymentStrategy {

    @Override
    public boolean pay(double amount) {
        System.out.printf("[PAYMENT] 💵 Cash on Delivery: $%.2f (collected on delivery)%n", amount);
        return true;
    }

    @Override public String getMethodName() { return "CASH"; }
}


// ── Concrete Strategy 3: E-Wallet ─────────────────────────────
class EWalletPayment implements PaymentStrategy {

    private final String walletId;
    private final String provider; // "MOMO" | "ZALOPAY" | "VNPAY"

    public EWalletPayment(String walletId, String provider) {
        this.walletId = walletId;
        this.provider = provider;
    }

    @Override
    public boolean pay(double amount) {
        System.out.printf("[PAYMENT] 📱 %s eWallet (%s) paid $%.2f%n",
                provider, walletId, amount);
        return true;
    }

    @Override public String getMethodName() { return "EWALLET_" + provider; }
}


// ── Factory helper for Strategy instances ─────────────────────
class PaymentStrategyFactory {
    public static PaymentStrategy creditCard(String num, String holder, String cvv) {
        return new CreditCardPayment(num, holder, cvv);
    }
    public static PaymentStrategy cash() {
        return new CashPayment();
    }
    public static PaymentStrategy eWallet(String walletId, String provider) {
        return new EWalletPayment(walletId, provider);
    }
}
