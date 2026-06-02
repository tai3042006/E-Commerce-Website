import { Link } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/clofit/Layout";
import { products } from "@/data/products";

const Bag = () => {
  const [items, setItems] = useState([
    { product: products[0], size: "L", qty: 1 },
  ]);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">Bag</h1>

        <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="space-y-6">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            )}
            {items.map((item, idx) => (
              <div
                key={item.product.id}
                className="flex gap-4 border-b border-border pb-6"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-32 sm:w-32"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    width={256}
                    height={256}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold sm:text-base">
                        {item.product.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        {item.product.tagline}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                        Size: {item.size}
                      </p>
                    </div>
                    <p className="text-sm font-semibold sm:text-base">
                      ${item.product.price} USD
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-end gap-3 pt-3">
                    <div className="flex items-center gap-3 rounded-pill border border-border px-3 py-1.5">
                      <button
                        aria-label="Decrease"
                        onClick={() =>
                          setItems((prev) =>
                            prev.map((it, i) =>
                              i === idx
                                ? { ...it, qty: Math.max(1, it.qty - 1) }
                                : it
                            )
                          )
                        }
                        className="text-foreground"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[1ch] text-sm font-medium">{item.qty}</span>
                      <button
                        aria-label="Increase"
                        onClick={() =>
                          setItems((prev) =>
                            prev.map((it, i) =>
                              i === idx ? { ...it, qty: it.qty + 1 } : it
                            )
                          )
                        }
                        className="text-foreground"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-base font-semibold">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">${subtotal.toFixed(2)} USD</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium">${shipping.toFixed(2)} USD</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-semibold">Estimated Total</dt>
                  <dd className="font-semibold">${total.toFixed(2)} USD</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-pill bg-foreground py-4 text-center text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Checkout
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Bag;
