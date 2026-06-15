package com.clofit.backend.state;

public class ProcessingState implements IOrderState {

    @Override
    public void handle() {
        System.out.println("Handling processing order: updating inventory and generating shipping label.");
    }

    @Override
    public IOrderState next() {
        return new CompletedState();
    }

    @Override
    public String getStatus() {
        return "Processing";
    }
}