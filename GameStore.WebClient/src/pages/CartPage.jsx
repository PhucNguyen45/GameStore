// GameStore.WebClient/src/pages/CartPage.jsx
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../stores/cartStore";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { formatVND } from "../utils/format";
import {
  ShoppingCart,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0[35789][0-9]{8}$/;

function validateEmail(email) {
  if (!email.trim()) return "Vui lòng nhập email";
  if (!EMAIL_REGEX.test(email)) return "Email không hợp lệ";
  return "";
}

function validatePhone(phone) {
  if (!phone.trim()) return "Vui lòng nhập số điện thoại";
  if (!PHONE_REGEX.test(phone)) return "Số điện thoại không hợp lệ (VD: 0912345678)";
  return "";
}

export default function CartPage() {
  const { t } = useTranslation();
  const { items, removeItem, clearCart, total, count } =
    useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((field, value) => {
    if (field === "email") return validateEmail(value);
    if (field === "phone") return validatePhone(value);
    return "";
  }, []);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === "email" ? email : phone;
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleChange = (field, value) => {
    if (field === "email") setEmail(value);
    else setPhone(value);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error(t("cart.checkoutLoginMsg"));
      navigate("/login");
      return;
    }

    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const newErrors = { email: emailErr, phone: phoneErr };
    setErrors(newErrors);
    setTouched({ email: true, phone: true });

    if (emailErr || phoneErr) {
      toast.error(emailErr || phoneErr || "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    navigate("/payment", {
      state: {
        email,
        phone,
        items: items.map((i) => ({
          gameId: i.id,
          quantity: i.quantity,
          title: i.title,
          price: i.discountPrice || i.price,
        })),
        total: total(),
      },
    });
  };

  if (count() === 0)
    return (
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          paddingTop: "clamp(40px, 5vw, 80px)",
        }}
      >
        <ShoppingCart size={64} color="#6b6b8e" />
        <h2 style={{ marginTop: 20 }}>{t("cart.empty")}</h2>
        <p style={{ color: "#6b6b8e", margin: "8px 0 20px" }}>
          {t("cart.emptyDesc")}
        </p>
        <Link to="/store">
          <button className="btn-primary" style={{ whiteSpace: "nowrap" }}>{t("cart.viewStore")}</button>
        </Link>
      </div>
    );

  return (
    <div className="container" style={{ paddingTop: 30, maxWidth: 900 }}>
      <Link
        to="/store"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#6b6b8e",
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={16} /> {t("cart.continueShopping")}
      </Link>
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 26,
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        <ShoppingBag size={28} color="#e94560" /> {t("cart.title")} ({t("cart.items", { count: count() })})
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: "clamp(12px, 2.5vw, 16px)",
              padding: "clamp(14px, 2.5vw, 20px)",
              background: "#16162a",
              borderRadius: 12,
              border: "1px solid #2a2a4a",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 100,
                height: 80,
                background: "#1a1a3e",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {item.coverImageUrl ? (
                <img
                  src={item.coverImageUrl}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                "🎮"
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 600 }}>{item.title}</h3>
              <span style={{ color: "#e94560", fontWeight: 700, fontSize: 15 }}>
                {formatVND(item.discountPrice || item.price || 0)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  padding: 8,
                  background: "transparent",
                  color: "#e94560",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div          style={{
            marginTop: 24,
            padding: "clamp(16px, 3vw, 24px)",
            background: "#16162a",
            borderRadius: 12,
            border: "1px solid #2a2a4a",
          }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 18, color: "#6b6b8e" }}>{t("cart.total")}</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#e94560" }}>
            {formatVND(total())}
          </span>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ color: "#6b6b8e", fontSize: 14 }}>
              {t("cart.email")} <span style={{ color: "#e94560" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="example@gmail.com"
                style={{
                  ...inputStyle,
                  borderColor: touched.email && errors.email ? "#e94560" : touched.email && !errors.email ? "#4caf50" : "#2a2a4a",
                  paddingRight: 40,
                }}
              />
              {touched.email && !errors.email && (
                <CheckCircle2
                  size={18}
                  color="#4caf50"
                  style={{ position: "absolute", right: 12, top: 14 }}
                />
              )}
              {touched.email && errors.email && (
                <AlertCircle
                  size={18}
                  color="#e94560"
                  style={{ position: "absolute", right: 12, top: 14 }}
                />
              )}
            </div>
            {touched.email && errors.email && (
              <p style={{ color: "#e94560", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <AlertCircle size={12} /> {errors.email}
              </p>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ color: "#6b6b8e", fontSize: 14 }}>
              {t("cart.phoneLabel")} <span style={{ color: "#e94560" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="0912345678"
                style={{
                  ...inputStyle,
                  borderColor: touched.phone && errors.phone ? "#e94560" : touched.phone && !errors.phone ? "#4caf50" : "#2a2a4a",
                  paddingRight: 40,
                }}
              />
              {touched.phone && !errors.phone && (
                <CheckCircle2
                  size={18}
                  color="#4caf50"
                  style={{ position: "absolute", right: 12, top: 14 }}
                />
              )}
              {touched.phone && errors.phone && (
                <AlertCircle
                  size={18}
                  color="#e94560"
                  style={{ position: "absolute", right: 12, top: 14 }}
                />
              )}
            </div>
            {touched.phone && errors.phone && (
              <p style={{ color: "#e94560", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <AlertCircle size={12} /> {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            onClick={clearCart}
            className="btn-outline"
            style={{ flex: 1, whiteSpace: "nowrap" }}
          >
            {t("cart.clearCart")}
          </button>
          <button
            onClick={handleCheckout}
            className="btn-primary"
            style={{ flex: 1, padding: 14, fontSize: 16, whiteSpace: "nowrap" }}
          >
            {t("cart.checkout")}
          </button>
        </div>
        {!user && (
          <p
            style={{
              textAlign: "center",
              color: "#ffd700",
              marginTop: 12,
              fontSize: 13,
            }}
          >
            {t("cart.loginRequired")}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  background: "#1a1a3e",
  border: "1px solid #2a2a4a",
  borderRadius: 8,
  padding: "12px 16px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
};
