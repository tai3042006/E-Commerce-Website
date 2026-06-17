package com.clofit.backend.state;

import com.clofit.backend.model.Order;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class PendingState implements IOrderState {

    private String lastUpdated;

    public PendingState() {
        this.lastUpdated = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    @Override
    public void handle(Order order) {
        System.out.println("Handling pending order: validating payment and preparing shipment.");
    }

    @Override
    public void next(Order order) {
        order.setState(new ProcessingState());
    }

    @Override
    public String getStatus() {
        return "Pending";
    }

    @Override
    public String getLastUpdated() {
        return lastUpdated;
    }
}
