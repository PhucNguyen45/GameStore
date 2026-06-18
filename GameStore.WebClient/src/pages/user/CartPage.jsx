// GameStore.WebClient/src/pages/CartPage.jsx
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../stores/cartStore";
import { useAuth } from "../../contexts/AuthContext";
import { gameAPI } from "../../services/api";
import toast from "react-hot-toast";
import { formatVND } from "../../utils/format";
import {
  ShoppingCart,
  Trash2,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  Tag,
  Package,
} from "lucide-react";
import { BackButton } from "../../components/common";
import { useTranslation } from "react-i18next";

const MAX_PER_GAME = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0[35789][0-9]{8}$/;

function validateEmail(email, t) {
  if (!email.trim()) return t("cart.emailRequired");
  if (!EMAIL_REGEX.test(email)) return t("cart.emailInvalid");
  return "";
}

function validatePhone(phone, t) {
  if (!phone.trim()) return t("cart.phoneRequired");
  if (!PHONE_REGEX.test(phone)) return t("cart.phoneInvalid");
  return "";
}

export default function CartPage() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, clearCart, total, count } =
    useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((field, value) => {
    if (field === "email") return validateEmail(value, t);
    if (field === "phone") return validatePhone(value, t);
    return "";
  }, [t]);

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

  const handleCheckout = async () => {
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
      toast.error(emailErr || phoneErr || t("cart.infoRequired"));
      return;
    }

    try {
      const gameIds = items.map((i) => i.id);
      const stockRes = await gameAPI.checkStock(gameIds);
      const stockData = stockRes.data;

      const outOfStockItems = items.filter((i) => (stockData[i.id] || 0) < i.quantity);
      if (outOfStockItems.length > 0) {
        const names = outOfStockItems.map((i) => i.title).join(", ");
        toast.error(t("cart.outOfStock", { games: names }));
        return;
      }
    } catch (err) {
      toast.error(t("cart.checkStockFailed"));
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

  const itemCount = count();
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);

  // ─── Empty State ──────────────────────────────────────────
  if (itemCount === 0)
    return (
      <div className="container">
        <div className="empty-state">
          <div className="icon">
            <ShoppingCart size={32} color="#6b6b8e" />
          </div>
          <h2>{t("cart.empty")}</h2>
          <p>{t("cart.emptyDesc")}</p>
          <Link to="/store">
            <button className="btn btn-primary">{t("cart.viewStore")}</button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* ── Top Bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <BackButton fallback="/store" label={t("cart.continueShopping")} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShoppingBag size={26} color="#e94560" />
          <div>
            <h1
              style={{
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {t("cart.title")}
            </h1>
            <span style={{ fontSize: 13, color: "#6b6b8e" }}>
              {totalQuantity} {t("cart.items", { count: itemCount })}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 28,
          alignItems: "start",
        }}
        className="cart-grid"
      >
        {/* ── Left Column: Cart Items ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((item) => {
            const unitPrice = item.discountPrice || item.price || 0;
            const subtotal = unitPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  display: "flex",
                  gap: "clamp(12px, 2vw, 18px)",
                  padding: "clamp(14px, 2vw, 20px)",
                  alignItems: "center",
                  border: "1px solid var(--border-card)",
                  animation: "fadeIn 0.3s ease",
                  position: "relative",
                }}
              >
                {/* Cover Image */}
                <div
                  style={{
                    width: 100,
                    height: 70,
                    borderRadius: 8,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#1a1a3e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 24, opacity: 0.3 }}>🎮</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/game/${item.id}`}
                    style={{
                      fontSize: "clamp(14px, 1.5vw, 16px)",
                      fontWeight: 600,
                      color: "#e0e0e0",
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "#6b6b8e",
                    }}
                  >
                    <Tag size={12} />
                    <span>
                      {formatVND(unitPrice)} / {t("cart.perUnit") || "bản"}
                    </span>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    background: "#0a0a15",
                    borderRadius: 10,
                    border: "1px solid #2a2a4a",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    style={{
                      width: 34,
                      height: 34,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      border: "none",
                      color: item.quantity <= 1 ? "#444" : "#e0e0e0",
                      cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => {
                      if (item.quantity > 1) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span
                    style={{
                      width: 36,
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      userSelect: "none",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= MAX_PER_GAME}
                    style={{
                      width: 34,
                      height: 34,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      border: "none",
                      color: item.quantity >= MAX_PER_GAME ? "#444" : "#e0e0e0",
                      cursor: item.quantity >= MAX_PER_GAME ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => {
                      if (item.quantity < MAX_PER_GAME) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {item.quantity >= MAX_PER_GAME && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "#ffd700",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    ⚠ Tối đa {MAX_PER_GAME}/người
                  </span>
                )}

                {/* Subtotal & Remove */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(14px, 1.5vw, 17px)",
                      fontWeight: 800,
                      color: "#e94560",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatVND(subtotal)}
                  </span>
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.success(t("cart.itemRemoved"));
                    }}
                    style={{
                      padding: "4px 8px",
                      background: "transparent",
                      color: "#6b6b8e",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      borderRadius: 6,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#e94560";
                      e.currentTarget.style.background = "rgba(233,69,96,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6b6b8e";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Right Column: Summary + Checkout ── */}
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-card)",
            padding: "clamp(20px, 3vw, 28px)",
            position: "sticky",
            top: 90,
          }}
        >
          {/* Order Summary */}
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#e0e0e0",
            }}
          >
            <Package size={18} color="#e94560" />
            {t("payment.orderSummary") || "Tóm tắt đơn hàng"}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item) => {
              const unitPrice = item.discountPrice || item.price || 0;
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "#a0a0b0",
                  }}
                >
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 8 }}>
                    {item.title}
                    <span style={{ color: "#6b6b8e" }}> x{item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 600, color: "#e0e0e0", whiteSpace: "nowrap" }}>
                    {formatVND(unitPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "var(--border-card)",
              margin: "16px 0",
            }}
          />

          {/* Totals */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
              color: "#a0a0b0",
              marginBottom: 8,
            }}
          >
            <span>{t("cart.items", { count: itemCount })}</span>
            <span>{totalQuantity} {t("orders.qty") || "bản"}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 24,
            }}
          >
            <span style={{ color: "#a0a0b0", fontSize: 16, fontWeight: 600 }}>
              {t("cart.total")}
            </span>
            <span style={{ color: "#e94560" }}>{formatVND(total())}</span>
          </div>

          {/* Contact Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="form-label">
                {t("cart.email")} <span style={{ color: "#e94560" }}>*</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="example@gmail.com"
                  className={`input ${touched.email ? (errors.email ? "input-error" : "input-success") : ""}`}
                />
                {touched.email && !errors.email && (
                  <CheckCircle2
                    size={16}
                    color="#4caf50"
                    className="icon-right"
                  />
                )}
                {touched.email && errors.email && (
                  <AlertCircle
                    size={16}
                    color="#e94560"
                    className="icon-right"
                  />
                )}
              </div>
              {touched.email && errors.email && (
                <p style={{ color: "#e94560", fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="form-label">
                {t("cart.phoneLabel")} <span style={{ color: "#e94560" }}>*</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="0912345678"
                  className={`input ${touched.phone ? (errors.phone ? "input-error" : "input-success") : ""}`}
                />
                {touched.phone && !errors.phone && (
                  <CheckCircle2
                    size={16}
                    color="#4caf50"
                    className="icon-right"
                  />
                )}
                {touched.phone && errors.phone && (
                  <AlertCircle
                    size={16}
                    color="#e94560"
                    className="icon-right"
                  />
                )}
              </div>
              {touched.phone && errors.phone && (
                <p style={{ color: "#e94560", fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertCircle size={12} /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-block"
              style={{ padding: 14, fontSize: 15 }}
            >
              <ShieldCheck size={18} />
              {t("cart.checkout")}
            </button>
            <button
              onClick={() => {
                clearCart();
                toast.success(t("cart.cartCleared"));
              }}
              className="btn btn-outline btn-block"
              style={{ padding: "10px 14px", fontSize: 13 }}
            >
              {t("cart.clearCart")}
            </button>
          </div>

          {!user && (
            <p
              style={{
                textAlign: "center",
                color: "#ffd700",
                marginTop: 12,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              ⚠ {t("cart.loginRequired")}
            </p>
          )}
        </div>
      </div>

      {/* Responsive Override */}
      <style>{`
        @media (max-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
