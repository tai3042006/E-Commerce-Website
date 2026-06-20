// In-browser persistent store — replaces MySQL for demo/dev.
// All data lives in localStorage so it survives page refresh.

export type User = { id: string; name: string; email: string; phone: string; password: string; createdAt: string };
export type Order = {
  id: string; userId: string; customerName: string; customerEmail: string;
  date: string; items: OrderLine[]; subtotal: number; shipping: number;
  discount: number; total: number; status: "pending"|"processing"|"shipped"|"delivered"|"cancelled";
  address: Address;
};
export type OrderLine = { productId: string; name: string; image: string; size: string; qty: number; price: number };
export type Address = { fullName: string; line1: string; city: string; country: string; zip: string };

// ── helpers ──────────────────────────────────────────────────────────────────
const get = <T>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const set = (key: string, val: unknown) => localStorage.setItem(key, JSON.stringify(val));

// ── users ─────────────────────────────────────────────────────────────────────
export const Users = {
  all: (): User[] => get<User[]>("clofit:users", []),
  find: (email: string) => Users.all().find(u => u.email.toLowerCase() === email.toLowerCase()),
  findById: (id: string) => Users.all().find(u => u.id === id),
  create: (u: Omit<User, "id"|"createdAt">): User => {
    const user: User = { ...u, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    set("clofit:users", [...Users.all(), user]);
    return user;
  },
};

// ── orders ────────────────────────────────────────────────────────────────────
export const Orders = {
  all: (): Order[] => get<Order[]>("clofit:orders", []),
  forUser: (userId: string) => Orders.all().filter(o => o.userId === userId),
  create: (o: Omit<Order, "id"|"date">): Order => {
    const order: Order = { ...o, id: "#CF-" + Date.now().toString().slice(-5), date: new Date().toISOString() };
    set("clofit:orders", [order, ...Orders.all()]);
    return order;
  },
};

// ── session ───────────────────────────────────────────────────────────────────
export const Session = {
  get: (): User | null => get<User|null>("clofit:session", null),
  set: (u: User) => set("clofit:session", u),
  clear: () => localStorage.removeItem("clofit:session"),
};
