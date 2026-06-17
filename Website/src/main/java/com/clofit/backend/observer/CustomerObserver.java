package com.clofit.backend.observer;

import com.clofit.backend.model.Customer;
public class CustomerObserver implements IObserver {

    private Customer customer;

    public CustomerObserver(Customer customer) {
        this.customer = customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    @Override
    public void update(String event, Object data) {
        System.out.println(
            "CustomerObserver received event: "
            + event
            + " with data: "
            + data
        );
    }
}