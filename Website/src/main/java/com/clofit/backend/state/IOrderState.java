package com.clofit.backend.state;

public interface IOrderState {
    void handle();
    IOrderState next();
    String getStatus();
}