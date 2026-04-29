import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import WalletModal from "../wallet/WalletModal";
import useCartStore from "../../stores/cartStore";
import {
  ShoppingCart,
  Gamepad2,
  Library,
  LogOut,
  User,
  Search,
} from "lucide-react";

export default function Navbar() {
  const auth = useAuth();
  const { user, logout, isAdmin } = auth || {};
  const { count } = useCartStore();
  const [showWallet, setShowWallet] = useState(false);
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path
      ? { color: "#fff", borderBottom: "2px solid var(--accent)" }
      : { color: "#999" };

  return (
    <>
      <nav
        className="glass"
        style={{ position: "sticky", top: 0, zIndex: 1000 }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", height: 56, gap: 32 }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Gamepad2 size={24} color="var(--accent)" />
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: 1,
                color: "#fff",
              }}
            >
              GAMESTORE
            </span>
          </Link>

          {/* Nav Links */}
          <div
            style={{ display: "flex", gap: 24, fontSize: 13, fontWeight: 500 }}
          >
            <Link
              to="/store"
              style={{ padding: "4px 0", ...isActive("/store") }}
            >
              STORE
            </Link>
            {user && (
              <Link
                to="/library"
                style={{ padding: "4px 0", ...isActive("/library") }}
              >
                LIBRARY
              </Link>
            )}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Right Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 13,
            }}
          >
            <Link
              to="/store"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#999",
              }}
            >
              <Search size={16} />
            </Link>

            <Link
              to="/cart"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#999",
                position: "relative",
              }}
            >
              <ShoppingCart size={18} />
              {count() > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -10,
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {count()}
                </span>
              )}
            </Link>

            {user ? (
              <>
                {/* Wallet */}
                <span
                  onClick={() => setShowWallet(true)}
                  style={{
                    color: "#999",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  💰 ${user.wallet?.toFixed(2)}
                </span>

                {isAdmin && (
                  <Link
                    to="/admin"
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    ADMIN
                  </Link>
                )}

                {/* User */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 12px",
                    background: "#2a2a2a",
                    borderRadius: 4,
                  }}
                >
                  <User size={14} color="var(--accent)" />
                  <span style={{ fontSize: 12, color: "#ccc" }}>
                    {user.displayName || user.username}
                  </span>
                </div>

                <button
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#999",
                    cursor: "pointer",
                  }}
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <Link to="/login">
                  <button
                    className="btn-outline"
                    style={{ padding: "6px 16px", fontSize: 12 }}
                  >
                    SIGN IN
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    className="btn-primary"
                    style={{ padding: "6px 16px", fontSize: 12 }}
                  >
                    GET GAMESTORE
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </>
  );
}
