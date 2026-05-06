// GameStore.WebClient/src/components/layout/Navbar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import WalletModal from "../wallet/WalletModal";
import useCartStore from "../../stores/cartStore";
import { gameAPI } from "../../services/api";
import {
  ShoppingCart,
  Gamepad2,
  Library,
  LogOut,
  User,
  Search,
  X,
  Wallet,
  Shield,
} from "lucide-react";

export default function Navbar() {
  const auth = useAuth();
  const { user, logout, isAdmin } = auth || {};
  const { count } = useCartStore();
  const [showWallet, setShowWallet] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // SEARCH STATE
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const isActive = (path) =>
    location.pathname === path
      ? { color: "#fff", borderBottom: "2px solid var(--accent)" }
      : { color: "#999" };

  // SEARCH LOGIC
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await gameAPI.getAll({
          keyword: searchQuery,
          pageSize: 5,
        });
        setSuggestions(data.data || []);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // CLOSE SEARCH ON CLICK OUTSIDE
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

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
            {/* SEARCH BUTTON + DROPDOWN */}
            <div ref={searchRef} style={{ position: "relative" }}>
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#999",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Search size={16} />
                </button>
              ) : (
                <form
                  onSubmit={handleSearchSubmit}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search games..."
                    style={{
                      width: 200,
                      padding: "6px 32px 6px 12px",
                      background: "#1a1a1a",
                      border: "1px solid #444",
                      borderRadius: 4,
                      color: "#fff",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    style={{
                      position: "absolute",
                      right: 4,
                      background: "none",
                      border: "none",
                      color: "#888",
                      cursor: "pointer",
                    }}
                  >
                    <X size={14} />
                  </button>
                </form>
              )}

              {/* SUGGESTIONS DROPDOWN */}
              {searchOpen && suggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: 8,
                    width: 260,
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: 8,
                    overflow: "hidden",
                    zIndex: 1001,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  }}
                >
                  {suggestions.map((game) => (
                    <Link
                      key={game.id}
                      to={`/game/${game.id}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#2a2a2a")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: 40,
                          height: 30,
                          borderRadius: 4,
                          background: "#333",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        {game.coverImageUrl ? (
                          <img
                            src={game.coverImageUrl}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                            }}
                          >
                            🎮
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#ddd",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {game.title}
                        </p>
                        <p style={{ fontSize: 10, color: "#888" }}>
                          ${(game.discountPrice || game.price)?.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
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

            {/* ========== USER SECTION (ĐÃ KHÔI PHỤC) ========== */}
            {user ? (
              <>
                {/* Wallet Button */}
                <button
                  onClick={() => setShowWallet(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "none",
                    border: "none",
                    color: "#4fc3f7",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: 4,
                  }}
                >
                  <Wallet size={14} />${user.wallet?.toFixed(2) || "0.00"}
                </button>

                {/* Admin Button */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      color: "#ffd700",
                      fontSize: 12,
                      fontWeight: 600,
                      background: "rgba(255,215,0,0.1)",
                      padding: "4px 10px",
                      borderRadius: 4,
                    }}
                  >
                    <Shield size={14} /> ADMIN
                  </Link>
                )}

                {/* User Info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#ccc",
                    fontSize: 12,
                    borderLeft: "1px solid #333",
                    paddingLeft: 16,
                  }}
                >
                  <User size={16} />
                  <span style={{ fontWeight: 500 }}>
                    {user.displayName || user.username}
                  </span>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: "none",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "var(--accent)",
                  padding: "6px 14px",
                  borderRadius: 4,
                }}
              >
                <User size={14} /> SIGN IN
              </Link>
            )}
          </div>
        </div>
      </nav>

      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </>
  );
}
