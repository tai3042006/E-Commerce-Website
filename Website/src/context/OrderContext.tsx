import { OrderContext } from "./OrderContext.hooks";

export const OrderProvider = ({ children }: { children: ReactNode }) => (
  <OrderContext.Provider value={{ unreadCount: 0, markAllRead: () => {} }}>{children}</OrderContext.Provider>
);