import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const Cart = () => {
  const { detailed, subtotal, setQty, remove, count } = useCart();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal === 0 ? 0 : subtotal > 80 ? 0 : 5.99;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "CLOFIT10") {
      setDiscount(subtotal * 0.1);
      toast.success("Promo applied — 10% off");
    } else if (!promo.trim()) {
      return;
    } else {
      setDiscount(0);
      toast.error("Invalid promo code");
    }
  };

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        <Breadcrumbs
          crumbs={[{ label: "Cart" }]}
          className="mb-4"
        />

        <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
          Cart ({count})
        </h1>

        {detailed.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">Your cart is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover something you'll love.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div className="space-y-1">
              <AnimatePresence>
                {detailed.map(({ item, product }) => (
                  <motion.div
                    key={product.id + item.size}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40, height: 0 }}
                    className="flex gap-4 border-b border-border py-6"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-36 sm:w-32"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold sm:text-base">
                            {product.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                            {product.tagline}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                            Size: {item.size}
                          </p>
                        </div>
                        <p className="text-sm font-semibold sm:text-base">
                          ${(product.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center gap-3 rounded-pill border border-border px-3 py-1.5">
                          <button
                            aria-label="Decrease"
                            onClick={() =>
                              setQty(item.id, item.size, item.qty - 1)
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[1ch] text-sm font-medium">
                            {item.qty}
                          </span>
                          <button
                            aria-label="Increase"
                            onClick={() =>
                              setQty(item.id, item.size, item.qty + 1)
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(item.id, item.size)}
                          aria-label="Remove"
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-border p-6">
                <h2 className="text-base font-semibold">Order Summary</h2>

                <div className="mt-5 flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Promo code"
                    className="flex-1 rounded-pill border border-border px-4 py-2.5 text-sm outline-none focus:border-foreground"
                  />
                  <button
                    onClick={applyPromo}
                    className="rounded-pill border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    Apply
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Try{" "}
                  <span className="font-medium text-foreground">CLOFIT10</span>{" "}
                  for 10% off
                </p>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>${subtotal.toFixed(2)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[hsl(var(--success))]">
                      <dt>Discount</dt>
                      <dd>-${discount.toFixed(2)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-base">
                    <dt className="font-semibold">Estimated Total</dt>
                    <dd className="font-semibold">${total.toFixed(2)}</dd>
                  </div>
                </dl>
                <button className="mt-6 block w-full rounded-pill bg-foreground py-4 text-center text-sm font-semibold text-background transition-opacity hover:opacity-90">
                  Checkout
                </button>
                <Link
                  to="/shop"
                  className="mt-3 block w-full rounded-pill border border-border py-3.5 text-center text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Cart;
