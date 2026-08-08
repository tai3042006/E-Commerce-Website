import { useState, useEffect } from "react";
import { CartContext, type Ctx, useCart } from "./CartContext.hooks";
import { cartService } from "@/services/CartService";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Ctx>(() => {
    const service = cartService;
    const detailed = service.getDetailed();
    return {
      items: service.getItems(),
      detailed,
      count: service.getCount(),
      subtotal: service.getSubtotal(),
      add: (p, size, qty) => service.add(p, size, qty),
      remove: (id, size) => service.remove(id, size),
      setQty: (id, size, qty) => service.setQty(id, size, qty),
      clear: () => service.clear(),
    };
  });

  useEffect(() => {
    const service = cartService;
    const handler = () => {
      setState((prev) => ({
        ...prev,
        items: service.getItems(),
        detailed: service.getDetailed(),
        count: service.getCount(),
        subtotal: service.getSubtotal(),
      }));
    };
    const unsubscribe = service.subscribe(handler);
    return unsubscribe;
  }, []);

  return <CartContext.Provider value={state}>{children}</CartContext.Provider>;
};

