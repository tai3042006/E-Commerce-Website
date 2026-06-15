package com.clofit.backend.state;

public class CancelledState implements IOrderState {

    @Override
    public void handle() {
        System.out.println("Order cancelled: notifying customer and releasing inventory.");
    }

    @Override
    public IOrderState next() {
        return this; // cancelled order stays cancelled
    }

    @Override
    public String getStatus() {
        return "Cancelled";
    }
}