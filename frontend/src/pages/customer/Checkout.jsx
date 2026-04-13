import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Shield, Truck, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [address, setAddress] = useState({ name: "", phone: "", street: "", locality: "", city: "", state: "", pincode: "", country: "India" });

  const { data: walletData } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const res = await api.get("/wallet");
      return res.data;
    },
    enabled: !!user,
  });

  const walletBalance = walletData?.balance || 0;
  const walletDeduction = useWallet ? Math.min(walletBalance, total) : 0;
  const payableAmount = Math.max(0, total - walletDeduction);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cartId = localStorage.getItem("yosai_cart_id");

      // If full wallet payment
      if (payableAmount === 0) {
        const order = await api.post("/orders/place", {
          razorpayOrderId: null,
          razorpayPaymentId: null,
          razorpaySignature: null,
          cartId,
          shippingAddress: address,
          walletAmount: walletDeduction,
        });
        await clearCart();
        toast.success("Order placed successfully!");
        navigate(`/orders/${order.data.orderId}`);
        return;
      }

      // Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        return;
      }

      // Create Razorpay order
      const rzpRes = await api.post("/orders/razorpay", { amount: payableAmount });

      await new Promise((resolve, reject) => {
        const options = {
          key: rzpRes.key,
          amount: rzpRes.amount,
          currency: rzpRes.currency || "INR",
          name: "Yosai",
          description: "Order Payment",
          image: "/logo.png",
          order_id: rzpRes.orderId,
          prefill: {
            name: user?.name || address.name,
            email: user?.email || "",
            contact: user?.phone || address.phone,
          },
          theme: { color: "#DB2777" },
          handler: async (response) => {
            try {
              const order = await api.post("/orders/place", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                cartId,
                shippingAddress: address,
                walletAmount: walletDeduction,
              });
              await clearCart();
              toast.success("Order placed successfully!");
              navigate(`/orders/${order.data.orderId}`);
              resolve();
            } catch (err) {
              toast.error(err.message || "Order placement failed");
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              toast("Payment cancelled");
              reject(new Error("dismissed"));
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp) => {
          toast.error("Payment failed: " + resp.error.description);
          reject(new Error(resp.error.description));
        });
        rzp.open();
      });
    } catch (err) {
      if (err?.message !== "dismissed") {
        toast.error(err?.message || "Failed to place order");
      }
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.items || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      <form onSubmit={handleOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-pink-600" /> Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["name", "Full Name"], ["phone", "Phone Number"], ["street", "Street Address"], ["locality", "Locality / Area"], ["city", "City"], ["state", "State"], ["pincode", "Pincode"]].map(([field, label]) => (
                  <div key={field} className={field === "street" || field === "locality" ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input className="input" value={address[field]} onChange={(e) => setAddress({ ...address, [field]: e.target.value })} required />
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet */}
            {walletBalance > 0 && (
              <div className="card p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={useWallet} onChange={(e) => setUseWallet(e.target.checked)} className="w-4 h-4 accent-pink-600" />
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Use Wallet Balance</p>
                      <p className="text-xs text-gray-500">Available: {formatPrice(walletBalance)}</p>
                    </div>
                  </div>
                  {useWallet && <span className="ml-auto text-sm font-semibold text-green-600">-{formatPrice(walletDeduction)}</span>}
                </label>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((i) => (
                  <div key={i._id} className="flex gap-2 text-sm">
                    <img src={i.image || "/placeholder.jpg"} alt={i.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium truncate">{i.name}</p>
                      <p className="text-gray-500 text-xs">Qty {i.quantity} × {formatPrice(i.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600">FREE</span></div>
                {walletDeduction > 0 && (
                  <div className="flex justify-between text-green-600"><span>Wallet Discount</span><span>-{formatPrice(walletDeduction)}</span></div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2"><span>To Pay</span><span>{formatPrice(payableAmount)}</span></div>
              </div>
              <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Shield className="w-4 h-4" />}
                {loading ? "Processing..." : payableAmount === 0 ? "Place Order" : `Pay ${formatPrice(payableAmount)}`}
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">Secured by Razorpay</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
