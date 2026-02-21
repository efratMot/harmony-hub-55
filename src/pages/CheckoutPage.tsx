import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Check, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = ["Shipping", "Review", "Confirmation"];

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({ address: "", city: "", zip: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!shipping.address.trim()) errs.address = "Required";
    if (!shipping.city.trim()) errs.city = "Required";
    if (!shipping.zip.trim()) errs.zip = "Required";
    if (!shipping.phone.trim()) errs.phone = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    const id = `ORD-${Date.now()}`;
    setOrderId(id);
    // In a real app, this would POST to /api/orders
    const order = {
      orderId: id,
      userId: user?.id,
      items: items.map((i) => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity, price: i.product.price })),
      total: totalPrice,
      shipping,
      timestamp: new Date().toISOString(),
    };
    // Save to localStorage as mock
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    clearCart();
    setStep(2);
  };

  if (items.length === 0 && step !== 2) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Steps indicator */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              i <= step ? "bg-gradient-warm text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`h-px w-8 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="font-display text-2xl font-bold">Shipping Details</h2>
            <div className="mt-6 space-y-4">
              {(["address", "city", "zip", "phone"] as const).map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-sm font-medium capitalize text-muted-foreground">{field}</label>
                  <input
                    type="text"
                    value={shipping[field]}
                    onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
                    className={`w-full rounded-lg border bg-card px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-accent/30 ${errors[field] ? "border-destructive" : ""}`}
                  />
                  {errors[field] && <p className="mt-1 text-xs text-destructive">{errors[field]}</p>}
                </div>
              ))}
              <button
                onClick={() => validate() && setStep(1)}
                className="mt-4 w-full rounded-lg bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground shadow-button transition-opacity hover:opacity-90"
              >
                Continue to Review
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="font-display text-2xl font-bold">Review Order</h2>
            <div className="mt-6 space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-card">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-md object-cover" />
                    <div>
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="mt-4 rounded-lg bg-secondary/50 p-4 text-sm">
                <p><strong>Ship to:</strong> {shipping.address}, {shipping.city} {shipping.zip}</p>
                <p><strong>Phone:</strong> {shipping.phone}</p>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(0)} className="flex-1 rounded-lg border py-3 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                  Back
                </button>
                <button onClick={handleSubmit} className="flex-1 rounded-lg bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground shadow-button transition-opacity hover:opacity-90">
                  Place Order
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/20"
            >
              <Package className="h-10 w-10 text-accent" />
            </motion.div>
            <h2 className="mt-6 font-display text-3xl font-bold">Order Placed!</h2>
            <p className="mt-2 text-muted-foreground">Order ID: <span className="font-mono font-semibold text-foreground">{orderId}</span></p>
            <p className="mt-1 text-sm text-muted-foreground">Thank you for your purchase.</p>
            <button onClick={() => navigate("/")} className="mt-8 rounded-lg bg-gradient-warm px-8 py-3 text-sm font-semibold text-primary-foreground shadow-button transition-opacity hover:opacity-90">
              Continue Shopping
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
