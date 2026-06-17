package com.clofit.backend.state;

import com.clofit.backend.model.Order;

public interface IOrderState {
    void handle(Order order);

    void next(Order order);

    String getStatus();

    String getLastUpdated();
}
