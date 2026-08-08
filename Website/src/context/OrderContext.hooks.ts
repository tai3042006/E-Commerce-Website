import { createContext, useContext } from "react";

export type OrderContextType = { unreadCount: number; markAllRead: () => void };

export const OrderContext = createContext<OrderContextType>({ unreadCount: 0, markAllRead: () => {} });

export const useOrders = () => useContext(OrderContext);