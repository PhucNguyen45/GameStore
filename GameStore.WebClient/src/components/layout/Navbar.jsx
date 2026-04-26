import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useCartStore from "../../stores/cartStore";
import {
  ShoppingCart,
  Gamepad2,
  Library,
  LogOut,
  User,
  Wallet,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { items, count } = useCartStore();
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path ? { color: "#e94560" } : {};

  return (
    <nav
      style={{
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #2a2a4a",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link to="/" style={{ fontSize: 24, fontWeight: 800 }}>
            <span className="gradient-text">🎮 GameStore</span>
          </Link>
          <div style={{ display: "flex", gap: 20 }}>
            <Link
              to="/store"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 500,
                transition: "color 0.3s",
                ...isActive("/store"),
              }}
            >
              <Gamepad2 size={16} /> Store
            </Link>
            {user && (
              <Link
                to="/library"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  ...isActive("/library"),
                }}
              >
                <Library size={16} /> Library
              </Link>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            to="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 500,
              position: "relative",
              ...isActive("/cart"),
            }}
          >
            <ShoppingCart size={18} /> Cart
            {count() > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -10,
                  background: "#e94560",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {count()}
              </span>
            )}
          </Link>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#8b8b9e",
                }}
              >
                <Wallet size={14} /> ${user.wallet?.toFixed(2)}
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  style={{ fontSize: 13, color: "#ffd700", fontWeight: 600 }}
                >
                  ⚙ Admin
                </Link>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  background: "#1a1a2e",
                  borderRadius: 20,
                }}
              >
                <User size={14} color="#e94560" />
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  {user.displayName || user.username}
                </span>
              </div>
              <button
                onClick={logout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  background: "transparent",
                  color: "#e94560",
                  border: "1px solid #e94560",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/login">
                <button
                  className="btn-outline"
                  style={{ padding: "8px 20px", fontSize: 13 }}
                >
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button
                  className="btn-primary"
                  style={{ padding: "8px 20px", fontSize: 13 }}
                >
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
