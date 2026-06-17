package com.clofit.backend.observer;

import com.clofit.backend.model.Admin;

public class AdminObserver implements IObserver {

    private Admin admin;

    public AdminObserver(Admin admin) {
        this.admin = admin;
    }

    @Override
    public void update(String event, Object data) {
        System.out.println(
            "AdminObserver received event: "
            + event
            + " with data: "
            + data
        );
    }
}