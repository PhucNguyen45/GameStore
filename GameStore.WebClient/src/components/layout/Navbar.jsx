// GameStore.WebClient/src/components/layout/Navbar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom"; // thêm useNavigate
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react"; // thêm useEffect, useRef
import WalletModal from "../wallet/WalletModal";
import useCartStore from "../../stores/cartStore";
import { gameAPI } from "../../services/api"; // THÊM
import {
  ShoppingCart,
  Gamepad2,
  Library,
  LogOut,
  User,
  Search,
  X, // THÊM
} from "lucide-react";

export default function Navbar() {
  const auth = useAuth();
  const { user, logout, isAdmin } = auth || {};
  const { count } = useCartStore();
  const [showWallet, setShowWallet] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // THÊM

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

              {/* 🆕 SUGGESTIONS DROPDOWN */}
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

            {/* Cart - GIỮ NGUYÊN */}
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

            {/* PHẦN CÒN LẠI GIỮ NGUYÊN */}
            {/* ... user section, wallet, admin button, logout ... */}
          </div>
        </div>
      </nav>

      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </>
  );
}
