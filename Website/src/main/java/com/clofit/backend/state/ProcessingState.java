package com.clofit.backend.state;

import com.clofit.backend.model.Order;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ProcessingState implements IOrderState {

    private String lastUpdated;

    public ProcessingState() {
        this.lastUpdated = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    @Override
    public void handle(Order order) {
        System.out.println("Handling processing order: updating inventory and generating shipping label.");
    }

    @Override
    public void next(Order order) {
        order.setState(new CompletedState());
    }

    @Override
    public String getStatus() {
        return "Processing";
    }

    @Override
    public String getLastUpdated() {
        return lastUpdated;
    }
}
