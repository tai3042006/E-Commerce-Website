package com.clofit.backend.state;

import com.clofit.backend.model.Order;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CancelledState implements IOrderState {

    private String lastUpdated;

    public CancelledState() {
        this.lastUpdated = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    @Override
    public void handle(Order order) {
        System.out.println("Order has been cancelled.");
    }

    @Override
    public void next(Order order) {
        System.out.println("Cancelled orders cannot be updated.");
    }

    @Override
    public String getStatus() {
        return "Cancelled";
    }

    @Override
    public String getLastUpdated() {
        return lastUpdated;
    }
}
