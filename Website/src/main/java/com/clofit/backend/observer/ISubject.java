package com.clofit.backend.observer;

public interface ISubject {
    public void subscribe(IObserver observer);
    public void unsubscribe(IObserver observer);
    public void notifyObservers(String event, Object data);
}
