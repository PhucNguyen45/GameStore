import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../stores/cartStore";
import { useAuth } from "../contexts/AuthContext";
import { orderAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, count } =
    useCartStore();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const orderTotal = total();

    // Kiểm tra số dư trước khi gọi API
    if (user.wallet < orderTotal) {
      toast.error("Insufficient wallet balance! Please top up.");
      return;
    }

    try {
      await orderAPI.create({
        items: items.map((i) => ({ gameId: i.id, quantity: i.quantity })),
      });

      // Cập nhật wallet ngay lập tức
      updateUser({ wallet: user.wallet - orderTotal });

      clearCart();
      toast.success("🎉 Purchase successful! Games added to your library.");
      navigate("/library");
    } catch (e) {
      if (e.response?.status === 400) {
        toast.error(e.response?.data?.message || "Insufficient balance");
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    }
  };

  if (count() === 0)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <ShoppingCart size={64} color="#6b6b8e" />
        <h2 style={{ marginTop: 20 }}>Your cart is empty</h2>
        <p style={{ color: "#6b6b8e", margin: "8px 0 20px" }}>
          Start shopping for games!
        </p>
        <Link to="/store">
          <button className="btn-primary">Browse Store</button>
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
        <ArrowLeft size={16} /> Continue Shopping
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
        <ShoppingBag size={28} color="#e94560" /> Shopping Cart ({count()}{" "}
        items)
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: 16,
              padding: 20,
              background: "#16162a",
              borderRadius: 12,
              border: "1px solid #2a2a4a",
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
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{item.title}</h3>
              <span style={{ color: "#e94560", fontWeight: 700, fontSize: 15 }}>
                ${(item.discountPrice || item.price)?.toFixed(2)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={qtyBtnStyle}
                >
                  <Minus size={14} />
                </button>
                <span
                  style={{ minWidth: 30, textAlign: "center", fontWeight: 600 }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={qtyBtnStyle}
                >
                  <Plus size={14} />
                </button>
              </div>
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

      <div
        style={{
          marginTop: 24,
          padding: 24,
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
          <span style={{ fontSize: 18, color: "#6b6b8e" }}>Total:</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#e94560" }}>
            ${total().toFixed(2)}
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button
            onClick={clearCart}
            className="btn-outline"
            style={{ flex: 1 }}
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="btn-primary"
            style={{ flex: 1, padding: 14, fontSize: 16 }}
          >
            Checkout
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
            ⚠ You need to login to checkout
          </p>
        )}
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  padding: 6,
  background: "#2a2a4a",
  border: "none",
  borderRadius: 6,
  color: "#e0e0e0",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};
