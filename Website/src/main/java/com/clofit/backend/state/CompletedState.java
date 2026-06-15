package com.clofit.backend.state;

public class CompletedState implements IOrderState {

    @Override
    public void handle() {
        System.out.println("Order completed: sending confirmation email and closing transaction.");
    }

    @Override
    public IOrderState next() {
        return this; // completed order stays in completed state
    }

    @Override
    public String getStatus() {
        return "Completed";
    }
}