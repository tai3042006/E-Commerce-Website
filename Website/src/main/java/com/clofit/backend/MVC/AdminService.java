package com.clofit.backend.MVC;

import com.clofit.backend.observer.IObserver;
import com.clofit.backend.model.Order;

import java.util.ArrayList;
import java.util.List;

public class AdminService {

    private static AdminService instance;

    private OrderService orderService;
    private List<IObserver> observers;

    private AdminService() {
        orderService = OrderService.getInstance();
        observers = new ArrayList<>();
    }

    public static AdminService getInstance() {
        if (instance == null) {
            instance = new AdminService();
        }
        return instance;
    }

    public OrderService getOrderService() {
        return orderService;
    }

    public void addObserver(IObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(IObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(String event, Object data) {
        for (IObserver observer : observers) {
            observer.update(event, data);
        }
    }

    public int getObserverCount() {
        return observers.size();
    }
}
