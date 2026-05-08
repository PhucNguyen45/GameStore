// GameStore.WebClient/src/pages/PaymentPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { orderAPI } from "../services/api";
import useCartStore from "../stores/cartStore";
import toast from "react-hot-toast";
import { CreditCard, Wallet, ShieldCheck, Loader2 } from "lucide-react";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const orderData = location.state;

  useEffect(() => {
    if (!orderData) {
      navigate("/cart");
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      if (paymentMethod === "wallet") {
        if (user.wallet < orderData.total) {
          toast.error("Insufficient wallet balance!");
          setIsProcessing(false);
          return;
        }
      }

      // Create order
      const response = await orderAPI.create({
        items: orderData.items.map((i) => ({
          gameId: i.gameId,
          quantity: i.quantity,
        })),
        email: orderData.email,
        phone: orderData.phone,
        paymentMethod: paymentMethod,
      });

      const orderId = response.data?.id || Math.floor(Math.random() * 100000);

      // Update wallet if used
      if (paymentMethod === "wallet") {
        updateUser({ wallet: user.wallet - orderData.total });
      }

      clearCart();
      toast.success("Payment Successful!");

      // Redirect to invoice page
      navigate(`/invoice/${orderId}`, {
        state: { order: { ...orderData, id: orderId, status: "Pending" } },
      });
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Payment failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 40, maxWidth: 600 }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        Checkout & Payment
      </h1>

      <div
        style={{
          background: "#16162a",
          padding: 30,
          borderRadius: 16,
          border: "1px solid #2a2a4a",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "#e94560" }}>
            Order Summary
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {orderData.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#e0e0e0",
                }}
              >
                <span>
                  {item.title} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div
              style={{
                borderTop: "1px solid #2a2a4a",
                marginTop: 10,
                paddingTop: 10,
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              <span>Total</span>
              <span style={{ color: "#e94560" }}>
                ${orderData.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "#e94560" }}>
            Contact Information
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              color: "#6b6b8e",
              fontSize: 14,
            }}
          >
            <span>Email: {orderData.email}</span>
            <span>Phone: {orderData.phone}</span>
          </div>
        </div>

        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "#e94560" }}>
            Select Payment Method
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label
              style={{
                ...methodStyle,
                borderColor: paymentMethod === "wallet" ? "#e94560" : "#2a2a4a",
              }}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "wallet"}
                onChange={() => setPaymentMethod("wallet")}
                style={{ display: "none" }}
              />
              <Wallet
                size={20}
                color={paymentMethod === "wallet" ? "#e94560" : "#6b6b8e"}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>GameStore Wallet</div>
                <div style={{ fontSize: 12, color: "#6b6b8e" }}>
                  Balance: ${user?.wallet?.toFixed(2)}
                </div>
              </div>
            </label>

            <label
              style={{
                ...methodStyle,
                borderColor: paymentMethod === "card" ? "#e94560" : "#2a2a4a",
              }}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                style={{ display: "none" }}
              />
              <CreditCard
                size={20}
                color={paymentMethod === "card" ? "#e94560" : "#6b6b8e"}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>Credit / Debit Card</div>
                <div style={{ fontSize: 12, color: "#6b6b8e" }}>
                  Visa, Mastercard, Amex
                </div>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="btn-primary"
          style={{
            width: "100%",
            padding: 16,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Processing...
            </>
          ) : (
            <>
              <ShieldCheck size={20} /> Pay Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const methodStyle = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  padding: 16,
  background: "#1a1a3e",
  borderRadius: 12,
  border: "2px solid #2a2a4a",
  cursor: "pointer",
  transition: "all 0.2s ease",
};
