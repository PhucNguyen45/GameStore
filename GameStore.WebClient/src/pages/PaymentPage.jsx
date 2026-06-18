// GameStore.WebClient/src/pages/PaymentPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { orderAPI } from "../services/api";
import useCartStore from "../stores/cartStore";
import toast from "react-hot-toast";
import { Wallet, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatVND } from "../utils/format";
import { Link } from "react-router-dom";

export default function PaymentPage() {
  const { t } = useTranslation();
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

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      if (paymentMethod === "wallet") {
        if (user.wallet < orderData.total) {
          toast.error(t("payment.insufficientBalance"));
          setIsProcessing(false);
          return;
        }
      }

      const response = await orderAPI.create({
        items: orderData.items.map((i) => ({
          gameId: i.gameId,
          quantity: i.quantity,
        })),
        email: orderData.email,
        phone: orderData.phone,
        paymentMethod: "Wallet",
      });

      const orderId = response.data?.id || Math.floor(Math.random() * 100000);

      if (paymentMethod === "wallet") {
        updateUser({ wallet: user.wallet - orderData.total });
      }

      clearCart();
      toast.success(t("payment.success"));

      navigate(`/invoice/${orderId}`, {
        state: { order: { ...orderData, id: orderId, status: "Pending" } },
      });
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || t("payment.failed");
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 40, maxWidth: 600 }}>
      <Link
        to="/cart"
        className="back-btn"
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} />
        Quay lại giỏ hàng
      </Link>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        {t("payment.title")}
      </h1>        <div
          style={{
            background: "#16162a",
            padding: "clamp(20px, 4vw, 30px)",
            borderRadius: 16,
            border: "1px solid #2a2a4a",
          }}
      >
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "#e94560" }}>
            {t("payment.orderSummary")}
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
                <span>{formatVND(item.price * item.quantity)}</span>
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
              <span>{t("payment.total")}</span>
              <span style={{ color: "#e94560" }}>
                {formatVND(orderData.total)}
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "#e94560" }}>
            {t("payment.contactInfo")}
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
            <span>{t("payment.phoneLabel")}: {orderData.phone}</span>
          </div>
        </div>

        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "#e94560" }}>
            {t("payment.selectMethod")}
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
                <div style={{ fontWeight: 600 }}>{t("payment.wallet")}</div>
                <div style={{ fontSize: 12, color: "#6b6b8e" }}>
                  {t("payment.balance", { balance: formatVND(user?.wallet || 0) })}
                </div>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="btn btn-primary btn-block"
          style={{ padding: 16, fontSize: 18 }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} /> {t("payment.processing")}
            </>
          ) : (
            <>
              <ShieldCheck size={20} /> {t("payment.payNow")}
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
