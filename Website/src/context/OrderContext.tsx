import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CartItem } from "./CartContext";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  product: string;
  isNew?: boolean; // unread flag for admin
};

// Seed data
const seedOrders: Order[] = [
  { id: "#CF-10428", customer: "Alex Morgan",  email: "alex@example.com",    date: "2026-05-30", items: 2, total: 138, status: "delivered",  product: "FlexMode Hoodie" },
  { id: "#CF-10427", customer: "Jamie Chen",   email: "jamie.c@example.com", date: "2026-05-30", items: 1, total: 69,  status: "shipped",    product: "Just A Chill Guy Hoodie" },
  { id: "#CF-10426", customer: "Priya Patel",  email: "priya@example.com",   date: "2026-05-29", items: 3, total: 142, status: "processing", product: "SkeyeBoxy Tee" },
  { id: "#CF-10425", customer: "Marco Rossi",  email: "marco.r@example.com", date: "2026-05-29", items: 1, total: 34,  status: "pending",    product: "Underdogs zipped Hoodie" },
  { id: "#CF-10424", customer: "Sara Kim",     email: "sara.k@example.com",  date: "2026-05-28", items: 2, total: 117, status: "delivered",  product: "Hoodie Waffle" },
  { id: "#CF-10423", customer: "Tom Becker",   email: "tom.b@example.com",   date: "2026-05-28", items: 1, total: 39,  status: "cancelled",  product: "SkeyeBoxy Tee" },
  { id: "#CF-10422", customer: "Lina Ortiz",   email: "lina.o@example.com",  date: "2026-05-27", items: 4, total: 220, status: "delivered",  product: "FlexMode Hoodie" },
  { id: "#CF-10421", customer: "Noah Wright",  email: "noah.w@example.com",  date: "2026-05-27", items: 1, total: 69,  status: "shipped",    product: "Just A Chill Guy Hoodie" },
];

type OrderContextType = {
  orders: Order[];
  unreadCount: number;
  addOrder: (cartItems: CartItem[]) => string; // returns new order id
  markAllRead: () => void;
};

const OrderContext = createContext<OrderContextType | null>(null);

let orderCounter = 10429;

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [unreadCount, setUnreadCount] = useState(0);

  const addOrder = useCallback((cartItems: CartItem[]): string => {
    const id = `#CF-${orderCounter++}`;
    const total = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
    const newOrder: Order = {
      id,
      customer: "Guest",
      email: "guest@clofit.com",
      date: new Date().toISOString().split("T")[0],
      items: cartItems.reduce((s, i) => s + i.qty, 0),
      total: Math.round(total * 100) / 100,
      status: "pending",
      product: cartItems[0]?.product.name ?? "",
      isNew: true,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setUnreadCount((n) => n + 1);
    return id;
  }, []);

  const markAllRead = useCallback(() => {
    setOrders((prev) => prev.map((o) => ({ ...o, isNew: false })));
    setUnreadCount(0);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, unreadCount, addOrder, markAllRead }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
