import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/clofit/Layout";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import { useCart } from "@/controllers/CartController";
import { useAuth } from "@/context/AuthContext";
import { Address } from "@/lib/db";
import { toast } from "sonner";
import { CheckCircle2, Lock } from "lucide-react";

const COUNTRIES = ["Vietnam", "United States", "Singapore", "Japan", "South Korea", "Australia", "United Kingdom"];

const TOKEN_KEY = "clofit:token";
const getToken = () => localStorage.getItem(TOKEN_KEY);

const Checkout = () => {
  const { detailed, subtotal, clear, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"info"|"payment"|"done">("info");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const shipping = subtotal > 80 ? 0 : 5.99;
  const [discount, setDiscount] = useState(0);

  const [addr, setAddr] = useState<Address>({
    fullName: user?.name || "", line1: "", city: "", country: "Vietnam", zip: "",
  });
  const [email, setEmail] = useState(user?.email || "");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [promo, setPromo] = useState("");

  const setA = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setAddr(a => ({ ...a, [k]: e.target.value }));

  if (count === 0 && step !== "done") {
    return (
      <Layout>
        <section className="container-clofit pt-10 pb-20 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/shop" className="mt-4 inline-block rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background">Shop Now</Link>
        </section>
      </Layout>
    );
  }

  if (step === "done") {
    return (
      <Layout>
        <section className="container-clofit flex flex-col items-center py-24 text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          <h1 className="mt-6 text-2xl font-extrabold">Order Placed!</h1>
          <p className="mt-2 text-muted-foreground">Order ID: <span className="font-semibold text-foreground">{orderId}</span></p>
          <p className="mt-1 text-sm text-muted-foreground">You will receive a notification when your order status updates.</p>
          <div className="mt-8 flex gap-3">
            <Link to="/account" className="rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background">View Orders</Link>
            <Link to="/shop" className="rounded-pill border border-border px-6 py-3 text-sm font-medium">Continue Shopping</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const placeOrder = async () => {
    if (!user) { toast.error("Please sign in to place an order"); navigate("/signin", { state: { from: "/checkout" } }); return; }
    setLoading(true);
    try {
      const body = {
        customer: {
          name: addr.fullName || user.name,
          email: email || user.email,
          address: addr.line1,
          city: addr.city,
          zip: addr.zip,
          country: addr.country,
        },
        items: detailed.map(({ item, product }) => ({
          id: product.id,
          name: product.name,
          qty: item.qty,
          price: product.price,
        })),
      };

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = getToken();
      if (token) headers["x-auth-token"] = token;

      const r = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.error ?? "Failed to place order");
      }

      const data = await r.json();
      clear();
      setOrderId(data.orderId);
      setStep("done");
      toast.success("Order placed successfully!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="container-clofit pt-4 lg:pt-10 pb-20">
        <Breadcrumbs crumbs={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} className="mb-6" />
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-8">Checkout</h1>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="flex gap-2">
              {(["info","payment"] as const).map((s, i) => (
                <button key={s} onClick={() => step === "payment" && s === "info" && setStep("info")}
                  className={`flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${step === s ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"}`}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs">{i+1}</span>
                  {s === "info" ? "Shipping Info" : "Payment"}
                </button>
              ))}
            </div>

            {step === "info" && (
              <div className="space-y-4 rounded-2xl border border-border p-6">
                <h2 className="font-semibold">Shipping Information</h2>
                <input placeholder="Email *" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="input-field w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
                <input placeholder="Full Name *" value={addr.fullName} onChange={setA("fullName")} required
                  className="input-field w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
                <input placeholder="Address *" value={addr.line1} onChange={setA("line1")} required
                  className="input-field w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="City *" value={addr.city} onChange={setA("city")} required
                    className="input-field w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
                  <input placeholder="ZIP Code" value={addr.zip} onChange={setA("zip")}
                    className="input-field w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
                </div>
                <select value={addr.country} onChange={setA("country")}
                  className="w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none bg-background">
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <button onClick={() => {
                  if (!email || !addr.fullName || !addr.line1 || !addr.city) { toast.error("Please fill in all required fields"); return; }
                  if (!user) { toast.error("Please sign in to continue"); navigate("/signin", { state: { from: "/checkout" } }); return; }
                  setStep("payment");
                }} className="w-full rounded-pill bg-foreground py-3.5 text-sm font-semibold text-background hover:opacity-90">
                  Next: Payment →
                </button>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-4 rounded-2xl border border-border p-6">
                <h2 className="font-semibold flex items-center gap-2"><Lock className="h-4 w-4" /> Card Details</h2>
                <div className="rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
                  🔒 Demo mode — enter any card info to test
                </div>
                <input placeholder="Card number (e.g. 4242 4242 4242 4242)" value={card.number}
                  onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim() }))}
                  className="w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
                <input placeholder="Name on card" value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                  className="w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM/YY" value={card.expiry}
                    onChange={e => { let v = e.target.value.replace(/\D/g,"").slice(0,4); if(v.length>2) v=v.slice(0,2)+"/"+v.slice(2); setCard(c=>({...c,expiry:v})); }}
                    className="w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
                  <input placeholder="CVV" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,"").slice(0,3) }))}
                    className="w-full rounded-xl border border-input px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
                </div>
                <button onClick={placeOrder} disabled={loading}
                  className="w-full rounded-pill bg-foreground py-4 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-60">
                  {loading ? "Processing…" : `Place Order — $${(subtotal + shipping - discount).toFixed(2)}`}
                </button>
                <button onClick={() => setStep("info")} className="w-full text-sm text-muted-foreground hover:text-foreground">← Back</button>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border p-6 space-y-4">
              <h2 className="font-semibold">Order ({count} items)</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {detailed.map(({ item, product }) => (
                  <div key={product.id + item.size} className="flex gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">{item.qty}</span>
                    </div>
                    <div className="flex flex-1 justify-between gap-2 text-sm">
                      <div>
                        <p className="font-medium leading-snug">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                      </div>
                      <p className="font-semibold whitespace-nowrap">${(product.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Promo code"
                  className="flex-1 rounded-pill border border-input px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
                <button onClick={() => {
                  if (promo.toUpperCase() === "CLOFIT10") { setDiscount(subtotal * 0.1); toast.success("10% off applied!"); }
                  else toast.error("Invalid code");
                }} className="rounded-pill border border-border px-3 py-2 text-sm hover:bg-secondary">Apply</button>
              </div>
              <p className="text-xs text-muted-foreground">Try <span className="font-medium text-foreground">CLOFIT10</span> for 10% off</p>
              <dl className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
                {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>-${discount.toFixed(2)}</dd></div>}
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd></div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <dt>Total</dt><dd>${(subtotal + shipping - discount).toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};
export default Checkout;
