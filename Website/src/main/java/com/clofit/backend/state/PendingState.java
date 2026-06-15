package com.clofit.backend.state;

public class PendingState implements IOrderState {

    @Override
    public void handle() {
        System.out.println("Handling pending order: validating payment and preparing shipment.");
    }

    @Override
    public IOrderState next() {
        return new CompletedState();
    }

    @Override
    public String getStatus() {
        return "Pending";
    }
}