// GameStore.WebClient/src/pages/CartPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../stores/cartStore";
import { useAuth } from "../contexts/AuthContext";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");

  const handleCheckout = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tiếp tục thanh toán");
      navigate("/login");
      return;
    }

    if (!email || !phone) {
      toast.error("Vui lòng nhập email và số điện thoại");
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
        <h2 style={{ marginTop: 20 }}>Giỏ hàng đang trống</h2>
        <p style={{ color: "#6b6b8e", margin: "8px 0 20px" }}>
          Bắt đầu mua game thôi!
        </p>
        <Link to="/store">
          <button className="btn-primary">Xem cửa hàng</button>
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
        <ArrowLeft size={16} /> Tiếp tục mua sắm
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
        <ShoppingBag size={28} color="#e94560" /> Giỏ hàng ({count()} items)
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
              alignItems: "center",
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
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{item.title}</h3>
              <span style={{ color: "#e94560", fontWeight: 700, fontSize: 15 }}>
                ${(item.discountPrice || item.price)?.toFixed(2)}
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

        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ color: "#6b6b8e", fontSize: 14 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ color: "#6b6b8e", fontSize: 14 }}>
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0123456789"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            onClick={clearCart}
            className="btn-outline"
            style={{ flex: 1 }}
          >
            Xóa giỏ hàng
          </button>
          <button
            onClick={handleCheckout}
            className="btn-primary"
            style={{ flex: 1, padding: 14, fontSize: 16 }}
          >
            Tiến hành thanh toán
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
            ⚠ Bạn cần đăng nhập để thanh toán
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
