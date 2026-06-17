package com.clofit.backend.state;

import com.clofit.backend.model.Order;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CompletedState implements IOrderState {

    private String lastUpdated;

    public CompletedState() {
        this.lastUpdated = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    @Override
    public void handle(Order order) {
        System.out.println("Order completed: sending confirmation email and closing transaction.");
    }

    @Override
    public void next(Order order) {
        System.out.println("Completed orders cannot be updated.");
    }

    @Override
    public String getStatus() {
        return "Completed";
    }

    @Override
    public String getLastUpdated() {
        return lastUpdated;
    }
}
