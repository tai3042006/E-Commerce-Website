package com.clofit.model;

/**
 * Represents an order in the e-commerce system.
 */
public class Order {
    private long id;
    private String status;
    private com.clofit.backend.state.IOrderState currentState;

    // Constructors
    public Order() {
    }

    public Order(long id, String status, com.clofit.backend.state.IOrderState currentState) {
        this.id = id;
        this.status = status;
        this.currentState = currentState;
    }

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public com.clofit.backend.state.IOrderState getCurrentState() {
        return currentState;
    }

    public void setCurrentState(com.clofit.backend.state.IOrderState currentState) {
        this.currentState = currentState;
    }

    @Override
    public String toString() {
        return "Order{id=" + id + ", status='" + status + "', currentState=" + currentState + "}";
    }
}