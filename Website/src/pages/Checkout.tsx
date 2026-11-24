import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/clofit/Layout";
import { Breadcrumbs } from "@/components/clofit/Breadcrumbs";
import { useCart } from "@/controllers/CartController.hooks";
import { authHeaders, useAuth } from "@/context/AuthContext.hooks";
import { Address } from "@/lib/db";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { CheckCircle2, QrCode } from "lucide-react";

const COUNTRIES = ["Vietnam", "United States", "Singapore", "Japan", "South Korea", "Australia", "United Kingdom"];

type Payment = { displayId?: string; state: string; total?: number; imageUrl?: string; reference?: number; amountVnd?: number; qrCode?: string; checkoutUrl?: string };
const terminal = ["PAID", "CANCELLED", "EXPIRED", "FAILED"];
const vnd = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

const Checkout = () => {
  const { detailed, subtotal, clear, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const orderId = params.get("order");
  const [method, setMethod] = useState("qr");
  const requestId = useRef<string>();

  const [step, setStep] = useState<"info" | "payment">("info");
  const [paymentResult, setPayment] = useState<{ order: string | null; data: Payment } | null>(null);
  const payment = paymentResult?.order === orderId ? paymentResult?.data : null;
  const [loading, setLoading] = useState(false);

  const shipping = subtotal > 80 ? 0 : 5.99;
  const [promoApplied, setPromoApplied] = useState(false);
  const discount = promoApplied ? Math.round(subtotal * 10) / 100 : 0;

  const [addr, setAddr] = useState<Address>({
    fullName: user?.name || "", line1: "", city: "", country: "Vietnam", zip: "",
  });
  const [promo, setPromo] = useState("");

  const shippingEdited = useRef(false);
  const userId = user?.id;
  useEffect(() => {
    if (!userId || orderId) return;
    const controller = new AbortController();
    async function loadShipping() {
      try {
        const response = await fetch("/api/addresses", { headers: authHeaders(), signal: controller.signal });
        if (!response.ok) throw new Error();
        const addresses: { full_name: string; address_line: string; city: string; is_default: boolean }[] = await response.json();
        const saved = addresses.find(address => address.is_default) ?? addresses[0];
        if (!saved || controller.signal.aborted || shippingEdited.current) return;
        setAddr({ fullName: saved.full_name, line1: saved.address_line, city: saved.city, country: "Vietnam", zip: "" });
        setStep("payment");
      } catch {
        if (!controller.signal.aborted) toast.error("Could not load saved addresses. Enter your shipping address below.");
      }
    }
    void loadShipping();
    return () => controller.abort();
  }, [userId, orderId]);

  const setA = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    {
      shippingEdited.current = true;
      setAddr(a => ({ ...a, [k]: e.target.value }));
    };

  useEffect(() => {
    if (!orderId || !user) return;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    async function check() {
      try {
        const response = await fetch("/api/orders/" + encodeURIComponent(orderId) + "/payment", {
          headers: authHeaders(), signal: controller.signal,
        });
        if (controller.signal.aborted || !response.ok) return;
        const result: Payment = await response.json();
        if (controller.signal.aborted) return;
        setPayment({ order: orderId, data: result });
        if (["COD","MANUAL_QR","PAID"].includes(result.state) && sessionStorage.getItem("clofit:checkout-order") === orderId) {
          clear();
          sessionStorage.removeItem("clofit:checkout-order");
        }
        if (result.state !== "COD" && !terminal.includes(result.state) && result.state !== "NOT_CREATED") timer = setTimeout(check, 10000);
      } catch {
        if (!controller.signal.aborted) timer = setTimeout(check, 10000);
      }
    }
    void check();
    return () => { clearTimeout(timer); controller.abort(); };
  }, [orderId, user, clear]);

  if (count === 0 && !orderId) {
    return (
      <Layout>
        <section className="container-clofit pt-10 pb-20 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/shop" className="mt-4 inline-block rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background">Shop Now</Link>
        </section>
      </Layout>
    );
  }

  if (payment?.state === "PAID") {
    return (
      <Layout>
        <section className="container-clofit flex flex-col items-center py-24 text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          <h1 className="mt-6 text-2xl font-extrabold">Payment Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">Order ID: <span className="font-semibold text-foreground">{payment?.displayId ?? orderId}</span></p>
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
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/signin", { state: { from: location.pathname + location.search } });
      return;
    }
    setLoading(true);
    let currentOrder = orderId;
    try {
      if (!currentOrder) {
        requestId.current ??= crypto.randomUUID();
        const response = await fetch("/api/orders", {
          method: "POST", headers: authHeaders(),
          body: JSON.stringify({
            requestId: requestId.current, paymentMethod: method,
            customer: {
              name: addr.fullName || user.name, address: addr.line1, city: addr.city,
              zip: addr.zip, country: addr.country,
            },
            promoCode: promoApplied ? "CLOFIT10" : undefined,
            items: detailed.map(({ item, product }) => ({ id: product.id, qty: item.qty, size: item.size })),
          }),
        });
        const order = await response.json();
        if (!response.ok) throw new Error(order.error ?? "Failed to place order");
        currentOrder = order.orderId as string;
        sessionStorage.setItem("clofit:checkout-order", currentOrder);
      }

      const response = await fetch("/api/orders/" + encodeURIComponent(currentOrder) + "/payment", {
        method: "POST", headers: authHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Failed to create QR code");
      setPayment({ order: currentOrder, data: result });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start payment");
    } finally {
      if (currentOrder && currentOrder !== orderId) setParams({ order: currentOrder }, { replace: true });
      setLoading(false);
    }
  };

  if (orderId) {
    if (payment?.state === "COD" || payment?.state === "MANUAL_QR") return (
      <Layout><section className="container-clofit mx-auto max-w-lg space-y-4 py-12 text-center">
        <h1 className="text-2xl font-bold">{payment.state === "COD" ? "Thank you for your order" : "Bank transfer"}</h1>
        <p className="text-sm text-muted-foreground">Order {payment?.displayId ?? orderId}</p>
        <p className="text-lg font-semibold">{payment.state === "COD" ? "Pay on delivery" : "Amount to transfer"} · ${Number(payment.total).toFixed(2)} USD</p>
        {payment.state === "MANUAL_QR" && <><img src={payment.imageUrl} alt="Store bank transfer QR" className="mx-auto max-h-72" />
          <p>Transfer reference: <strong>{payment.reference}</strong></p><p>Include this reference in your transfer so we can match it to your order.</p></>}
        <Link to="/account" className="inline-block rounded-pill bg-foreground px-6 py-3 text-sm font-semibold text-background">View my orders</Link>
      </section></Layout>
    );
    const closed = payment && terminal.includes(payment.state);
    return (
      <Layout>
        <section className="container-clofit mx-auto max-w-lg space-y-5 py-12 text-center">
          <h1 className="text-2xl font-extrabold">VietQR payment</h1>
          <p className="break-all text-sm text-muted-foreground">{payment?.displayId ?? orderId}</p>
          {payment?.amountVnd != null && <p className="text-xl font-semibold">{vnd.format(payment.amountVnd)}</p>}
          {payment?.qrCode && !closed && (
            <QRCodeCanvas value={payment.qrCode} size={224} marginSize={4}
              title="VietQR payment code" className="mx-auto rounded-lg" />
          )}
          {payment?.checkoutUrl && !closed && (
            <a href={payment.checkoutUrl} className="block rounded-pill bg-foreground px-6 py-3 text-background">
              Open payOS payment page
            </a>
          )}
          {closed ? (
            <>
              <p>This payment link is {payment.state.toLowerCase()}.</p>
              <button onClick={() => {
                sessionStorage.removeItem("clofit:checkout-order");
                requestId.current = undefined;
                setPayment(null);
                setParams({}, { replace: true });
                setStep("info");
              }} className="rounded-pill border px-6 py-3">Start a new checkout</button>
            </>
          ) : (
            <>
              <p role="status" className="text-sm text-muted-foreground">
                {payment?.state === "UNDERPAID" ? "Partial payment detected. Check the remaining amount on payOS."
                  : "Your order updates after the bank confirms the transfer."}
              </p>
              <button onClick={placeOrder} disabled={loading} className="rounded-pill border px-6 py-3 disabled:opacity-50">
                {loading ? "Checking…" : payment?.checkoutUrl ? "Check payment" : "Get payment link"}
              </button>
            </>
          )}
          <Link to="/account" className="block text-sm underline">View orders</Link>
        </section>
      </Layout>
    );
  }

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
                <input placeholder="Email *" type="email" value={user?.email ?? ""} readOnly
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
                  if (!user) { toast.error("Please sign in to continue"); navigate("/signin", { state: { from: "/checkout" } }); return; }
                  if (!addr.fullName.trim() || !addr.line1.trim() || !addr.city.trim()) { toast.error("Please fill in all required fields"); return; }
                  setStep("payment");
                }} className="w-full rounded-pill bg-foreground py-3.5 text-sm font-semibold text-background hover:opacity-90">
                  Next: Payment →
                </button>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-4 rounded-2xl border border-border p-6">
                <h2 className="flex items-center gap-2 font-semibold"><QrCode className="h-4 w-4" /> Payment method</h2>
                <p>{addr.fullName} · {addr.line1}, {addr.city}, {addr.country}</p>
                <button onClick={() => setStep("info")} className="text-sm underline">Edit shipping address</button>
                <label className="block"><input type="radio" checked={method === "qr"} onChange={() => setMethod("qr")} /> Bank transfer via store QR</label>
                <label className="block"><input type="radio" checked={method === "cod"} onChange={() => setMethod("cod")} /> Cash on delivery (COD)</label>
                <button onClick={placeOrder} disabled={loading}
                  className="w-full rounded-pill bg-foreground py-4 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-60">
                  {loading ? "Processing…" : method === "cod" ? "Place COD order" : "Continue to store QR"}
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
                  if (promo.trim().toUpperCase() === "CLOFIT10") { setPromoApplied(true); toast.success("10% off applied!"); }
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
