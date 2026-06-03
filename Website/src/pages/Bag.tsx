import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Layout } from "@/components/clofit/Layout";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { toast } from "sonner";

const Bag = () => {
  const { items, updateQty, removeFromCart, subtotal } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const shipping = subtotal > 0 ? (subtotal >= 80 ? 0 : 5.99) : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (items.length === 0) return;
    const orderId = addOrder(items);
    // Clear cart by removing all items
    items.forEach((i) => removeFromCart(i.product.id, i.size));
    toast.success(`Order ${orderId} placed! 🎉`, {
      description: "Check your admin dashboard for updates.",
    });
    navigate("/");
  };

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">Bag</h1>

        <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="space-y-6">
            {items.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-sm text-muted-foreground">Your bag is empty.</p>
                <Link
                  to="/shop"
                  className="rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                >
                  Shop now
                </Link>
              </div>
            )}
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
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
                      ${(item.product.price * item.qty).toFixed(2)} USD
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <button
                      aria-label="Remove item"
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3 rounded-pill border border-border px-3 py-1.5">
                      <button
                        aria-label="Decrease"
                        onClick={() => updateQty(item.product.id, item.size, item.qty - 1)}
                        className="text-foreground"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[1ch] text-sm font-medium">{item.qty}</span>
                      <button
                        aria-label="Increase"
                        onClick={() => updateQty(item.product.id, item.size, item.qty + 1)}
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
                  <dd className="font-medium">
                    {shipping === 0 && subtotal > 0 ? "Free" : `$${shipping.toFixed(2)} USD`}
                  </dd>
                </div>
                {subtotal > 0 && subtotal < 80 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(80 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-semibold">Estimated Total</dt>
                  <dd className="font-semibold">${total.toFixed(2)} USD</dd>
                </div>
              </dl>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="mt-6 block w-full rounded-pill bg-foreground py-4 text-center text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Bag;
