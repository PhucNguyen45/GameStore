// GameStore.WebClient/src/pages/PaymentPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { orderAPI } from "../../services/api";
import useCartStore from "../../stores/cartStore";
import toast from "react-hot-toast";
import { Wallet, ShieldCheck, Loader2, Gift, AlertCircle, CheckCircle2 } from "lucide-react";
import { BackButton } from "../../components/common";
import { useTranslation } from "react-i18next";
import { formatVND } from "../../utils/format";
import { Link } from "react-router-dom";

export default function PaymentPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isGift, setIsGift] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientEmailError, setRecipientEmailError] = useState("");

  const orderData = location.state;

  useEffect(() => {
    if (!orderData) {
      navigate("/cart");
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  const handlePayment = async () => {
    if (isGift) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!recipientEmail.trim()) {
        setRecipientEmailError("Vui lòng nhập email người nhận");
        return;
      }
      if (!emailRegex.test(recipientEmail.trim())) {
        setRecipientEmailError("Email người nhận không hợp lệ");
        return;
      }
    }
    setRecipientEmailError("");

    setIsProcessing(true);

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
        recipientEmail: isGift ? recipientEmail.trim() : null,
      });

      const orderId = response.data?.id;
      if (!orderId) throw new Error("Server không trả về order ID hợp lệ.");

      if (paymentMethod === "wallet") {
        updateUser({ wallet: user.wallet - orderData.total });
      }

      clearCart();
      toast.success(isGift ? "Đã mua tặng thành công! 🎁" : t("payment.success"));

      navigate(`/invoice/${orderId}`, {
        state: { order: { ...orderData, id: orderId, status: "Pending", isGift, recipientEmail: isGift ? recipientEmail.trim() : null } },
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
      <BackButton fallback="/cart" label="Quay lại giỏ hàng" />
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

        {/* ── Gift Toggle ── */}
        {/* <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "#e94560" }}>
            <Gift size={18} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Mua tặng bạn bè
          </h3>
          <label
            style={{
              ...methodStyle,
              borderColor: isGift ? "#e94560" : "#2a2a4a",
              marginBottom: isGift ? 12 : 0,
            }}
          >
            <input
              type="checkbox"
              checked={isGift}
              onChange={(e) => {
                setIsGift(e.target.checked);
                if (!e.target.checked) {
                  setRecipientEmail("");
                  setRecipientEmailError("");
                }
              }}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                border: `2px solid ${isGift ? "#e94560" : "#6b6b8e"}`,
                background: isGift ? "#e94560" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              {isGift && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: "#e0e0e0" }}>
                Đây là quà tặng
              </div>
              <div style={{ fontSize: 12, color: "#6b6b8e" }}>
                Game sẽ được gửi đến email người nhận, không vào thư viện của bạn
              </div>
            </div>
          </label>

          {isGift && (
            <div>
              <div className="input-with-icon">
                <Gift size={16} color="#6b6b8e" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    if (recipientEmailError) setRecipientEmailError("");
                  }}
                  onBlur={() => {
                    if (recipientEmail.trim()) {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      setRecipientEmailError(
                        !emailRegex.test(recipientEmail.trim())
                          ? "Email không hợp lệ"
                          : ""
                      );
                    }
                  }}
                  placeholder="Nhập email người nhận..."
                  style={{
                    ...inputStyle,
                    borderColor: recipientEmailError ? "#e94560" : "#2a2a4a",
                    paddingLeft: 40,
                  }}
                />
                {recipientEmail && !recipientEmailError && (
                  <CheckCircle2 size={16} color="#4caf50" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />
                )}
              </div>
              {recipientEmailError && (
                <p style={{ color: "#e94560", fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertCircle size={12} /> {recipientEmailError}
                </p>
              )}
            </div>
          )}
        </div> */}

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

        {isGift && (
          <div
            style={{
              padding: 14,
              background: "linear-gradient(135deg, #e9456011, #ffd70011)",
              borderRadius: 12,
              border: "1px solid #e9456033",
              marginBottom: 20,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 13,
              color: "#ddd",
              lineHeight: 1.5,
            }}
          >
            <Gift size={18} color="#ffd700" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <strong style={{ color: "#ffd700" }}>Quà tặng</strong>
              <br />
              Toàn bộ đơn hàng sẽ được gửi đến <strong>{recipientEmail || "..."}</strong>.
              Game sẽ không được thêm vào thư viện của bạn.
            </div>
          </div>
        )}

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
              {isGift ? <Gift size={20} /> : <ShieldCheck size={20} />}
              {isGift ? "Mua tặng ngay" : t("payment.payNow")}
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

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  background: "#0a0a15",
  border: "1px solid #2a2a4a",
  borderRadius: 10,
  color: "#fff",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};
