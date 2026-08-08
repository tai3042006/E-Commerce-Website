import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useUI } from "@/context/UIContext.hooks";
import { useCart } from "@/controllers/CartController.hooks";

export const CartDrawer = () => {
  const { cartOpen, closeCart } = useUI();
  const { detailed, subtotal, setQty, remove, count } = useCart();
  const shipping = subtotal > 80 || subtotal === 0 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-glow"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <h2 className="text-base font-semibold">Your bag ({count})</h2>
              <button aria-label="Close cart" onClick={closeCart} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailed.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">Your bag is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">Discover something you'll love.</p>
                <Link to="/shop" onClick={closeCart}
                  className="mt-6 rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background">
                  Shop the collection
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {detailed.map(({ item, product }) => (
                      <motion.li
                        key={product.id + item.size}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 py-5"
                      >
                        <Link to={`/product/${product.id}`} onClick={closeCart}
                          className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-semibold">{product.name}</h3>
                              <p className="mt-0.5 text-xs text-muted-foreground">Size {item.size}</p>
                            </div>
                            <p className="text-sm font-semibold">${(product.price * item.qty).toFixed(2)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center gap-3 rounded-pill border border-border px-3 py-1">
                              <button aria-label="Decrease" onClick={() => setQty(item.id, item.size, item.qty - 1)}>
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[1ch] text-sm font-medium">{item.qty}</span>
                              <button aria-label="Increase" onClick={() => setQty(item.id, item.size, item.qty + 1)}>
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button aria-label="Remove" onClick={() => remove(item.id, item.size)}
                              className="text-muted-foreground transition-colors hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-border p-5">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd></div>
                    <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><dt>Total</dt><dd>${total.toFixed(2)}</dd></div>
                  </dl>
                  <Link to="/cart" onClick={closeCart}
                    className="mt-5 block w-full rounded-pill bg-foreground py-3.5 text-center text-sm font-semibold text-background transition-opacity hover:opacity-90">
                    Checkout
                  </Link>
                  <button onClick={closeCart}
                    className="mt-2 block w-full rounded-pill border border-border py-3 text-center text-sm font-medium transition-colors hover:bg-secondary">
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
