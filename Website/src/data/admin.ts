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
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  joined: string;
  orders: number;
  spent: number;
  location: string;
};

export const orders: Order[] = [
  { id: "#CF-10428", customer: "Alex Morgan", email: "alex@example.com", date: "2026-05-30", items: 2, total: 138, status: "delivered", product: "FlexMode Hoodie" },
  { id: "#CF-10427", customer: "Jamie Chen", email: "jamie.c@example.com", date: "2026-05-30", items: 1, total: 69, status: "shipped", product: "Just A Chill Guy Hoodie" },
  { id: "#CF-10426", customer: "Priya Patel", email: "priya@example.com", date: "2026-05-29", items: 3, total: 142, status: "processing", product: "SkeyeBoxy Tee" },
  { id: "#CF-10425", customer: "Marco Rossi", email: "marco.r@example.com", date: "2026-05-29", items: 1, total: 34, status: "pending", product: "Underdogs zipped Hoodie" },
  { id: "#CF-10424", customer: "Sara Kim", email: "sara.k@example.com", date: "2026-05-28", items: 2, total: 117, status: "delivered", product: "Hoodie Waffle" },
  { id: "#CF-10423", customer: "Tom Becker", email: "tom.b@example.com", date: "2026-05-28", items: 1, total: 39, status: "cancelled", product: "SkeyeBoxy Tee" },
  { id: "#CF-10422", customer: "Lina Ortiz", email: "lina.o@example.com", date: "2026-05-27", items: 4, total: 220, status: "delivered", product: "FlexMode Hoodie" },
  { id: "#CF-10421", customer: "Noah Wright", email: "noah.w@example.com", date: "2026-05-27", items: 1, total: 69, status: "shipped", product: "Just A Chill Guy Hoodie" },
];

export const customers: Customer[] = [
  { id: "u_001", name: "Alex Morgan", email: "alex@example.com", joined: "2025-11-02", orders: 8, spent: 612, location: "New York, US" },
  { id: "u_002", name: "Jamie Chen", email: "jamie.c@example.com", joined: "2026-01-14", orders: 3, spent: 207, location: "Toronto, CA" },
  { id: "u_003", name: "Priya Patel", email: "priya@example.com", joined: "2025-08-21", orders: 12, spent: 1340, location: "London, UK" },
  { id: "u_004", name: "Marco Rossi", email: "marco.r@example.com", joined: "2026-04-09", orders: 1, spent: 34, location: "Milan, IT" },
  { id: "u_005", name: "Sara Kim", email: "sara.k@example.com", joined: "2025-12-30", orders: 5, spent: 388, location: "Seoul, KR" },
  { id: "u_006", name: "Tom Becker", email: "tom.b@example.com", joined: "2026-02-18", orders: 2, spent: 78, location: "Berlin, DE" },
  { id: "u_007", name: "Lina Ortiz", email: "lina.o@example.com", joined: "2025-10-05", orders: 9, spent: 942, location: "Madrid, ES" },
  { id: "u_008", name: "Noah Wright", email: "noah.w@example.com", joined: "2026-03-22", orders: 4, spent: 256, location: "Sydney, AU" },
];

export const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-secondary text-foreground",
  processing: "bg-blue-100 text-blue-900",
  shipped: "bg-amber-100 text-amber-900",
  delivered: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-red-100 text-red-900",
};
