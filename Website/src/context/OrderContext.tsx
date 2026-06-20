import { createContext, useContext, ReactNode } from "react";

type OrderContextType = { unreadCount: number; markAllRead: () => void };
const OrderContext = createContext<OrderContextType>({ unreadCount: 0, markAllRead: () => {} });
export const OrderProvider = ({ children }: { children: ReactNode }) => (
  <OrderContext.Provider value={{ unreadCount: 0, markAllRead: () => {} }}>{children}</OrderContext.Provider>
);
export const useOrders = () => useContext(OrderContext);
