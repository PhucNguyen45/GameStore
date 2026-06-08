// GameStore.WebClient/src/components/layout/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useTranslation } from "react-i18next";
import WalletModal from "../wallet/WalletModal";
import LanguageSwitcher from "../common/LanguageSwitcher";
import useCartStore from "../../stores/cartStore";
import { gameAPI, notificationAPI } from "../../services/api";
import { formatVND } from "../../utils/format";
import {
  ShoppingCart,
  Gamepad2,
  LogOut,
  User,
  Search,
  X,
  Wallet,
  Shield,
  Heart,
  Bell,
  Menu,
  Library,
  Clock,
  UserCircle,
} from "lucide-react";

const navLinks = [
  { to: "/store", key: "store", auth: false },
  { to: "/library", key: "library", auth: true },
  { to: "/wishlist", key: "wishlist", auth: true },
  { to: "/orders", key: "orders", auth: true },
];

const mobileUserLinks = [
  { to: "/profile", key: "myProfile", icon: UserCircle },
  { to: "/orders", key: "orderHistory", icon: Clock },
  { to: "/library", key: "libraryShort", icon: Library },
  { to: "/wishlist", key: "wishlistShort", icon: Heart },
];

// Hover effect styles injected once via <style>
const hoverStyles = `
  .nav-hover {
    transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
  }
  .nav-hover:hover {
    transform: scale(1.12) !important;
    filter: brightness(1.3) drop-shadow(0 0 6px rgba(255,255,255,0.15)) !important;
  }
  .nav-hover-glow:hover {
    transform: scale(1.08) !important;
    filter: brightness(1.4) drop-shadow(0 0 8px var(--accent-glow)) !important;
  }
  .nav-hover-danger:hover {
    transform: scale(1.08) !important;
    filter: brightness(1.3) drop-shadow(0 0 6px rgba(233,69,96,0.4)) !important;
  }
  .nav-hover-gold:hover {
    transform: scale(1.08) !important;
    filter: brightness(1.3) drop-shadow(0 0 8px rgba(255,215,0,0.4)) !important;
  }
  .nav-hover-link {
    transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
  }
  .nav-hover-link:hover {
    transform: translateY(-1px) !important;
    filter: brightness(1.3) drop-shadow(0 0 8px rgba(255,255,255,0.1)) !important;
  }
`;

export default function Navbar() {
  const { t } = useTranslation();
  const auth = useAuth();
  const { user, logout, isAdmin } = auth || {};
  const { count } = useCartStore();
  const [showWallet, setShowWallet] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileUserOpen, setMobileUserOpen] = useState(false);
  const menuRef = useRef(null);
  const userRef = useRef(null);

  // SEARCH STATE
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // NOTIFICATION STATE
  const [showNoti, setShowNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notiRef = useRef(null);

  const isActive = (path) =>
    location.pathname === path
      ? { color: "#fff", borderBottom: "2px solid var(--accent)" }
      : { color: "#999" };

  // Inject hover styles once
  useEffect(() => {
    if (!document.getElementById("nav-hover-styles")) {
      const style = document.createElement("style");
      style.id = "nav-hover-styles";
      style.textContent = hoverStyles;
      document.head.appendChild(style);
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileUserOpen(false);
  }, [location.pathname]);

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

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false);
      if (notiRef.current && !notiRef.current.contains(e.target))
        setShowNoti(false);
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMobileMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setMobileUserOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // NOTIFICATION LOGIC
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data } = await notificationAPI.get(true);
      setNotifications(data);
      setUnreadCount(data.length);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkRead = async (noti) => {
    await notificationAPI.markRead(noti.id);
    setUnreadCount((c) => c - 1);
    setShowNoti(false);
    if (noti.link) navigate(noti.link);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const tn = (key) => t(`nav.${key}`);

  const searchInput = (
    <form onSubmit={handleSearchSubmit} style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <input
        autoFocus
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={tn("search")}
        style={{
          width: "100%",
          padding: "8px 36px 8px 12px",
          background: "#1a1a1a",
          border: "1px solid #444",
          borderRadius: 4,
          color: "#fff",
          fontSize: 13,
          outline: "none",
        }}
      />
      <button
        type="button"
        onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
        style={{
          position: "absolute", right: 6, top: 6,
          background: "none", border: "none", color: "#888", cursor: "pointer", padding: 2,
        }}
      >
        <X size={16} />
      </button>
    </form>
  );

  const searchSuggestions = searchOpen && suggestions.length > 0 && (
    <div
      style={{
        position: "absolute", top: "100%", right: 0, marginTop: 8,
        width: isMobile ? "100%" : 260,
        background: "#1a1a1a", border: "1px solid #333", borderRadius: 8,
        overflow: "hidden", zIndex: 1001,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {suggestions.map((game) => (
        <Link
          key={game.id}
          to={`/game/${game.id}`}
          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          className="nav-hover-link"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px",
          }}
        >
          <div style={{ width: 40, height: 30, borderRadius: 4, background: "#333", overflow: "hidden", flexShrink: 0 }}>
            {game.coverImageUrl ? (
              <img src={game.coverImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>🎮</div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, color: "#ddd", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {game.title}
            </p>
            <p style={{ fontSize: 10, color: "#888" }}>{formatVND(game.discountPrice || game.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );

  // ===== MOBILE VERSION =====
  if (isMobile) {
    return (
      <>
        <nav className="glass" style={{ position: "sticky", top: 0, zIndex: 1000 }}>
          <div className="container" style={{ display: "flex", alignItems: "center", height: 56, gap: 8, padding: "0 16px" }}>
            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-hover"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "none", border: "none", color: "#ccc", cursor: "pointer",
                padding: 8, marginRight: 4,
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="nav-hover" style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Gamepad2 size={22} color="var(--accent)" />
              <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1, color: "#fff" }}>
                GAME
              </span>
            </Link>

            <div style={{ flex: 1 }} />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="nav-hover"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "none", border: "none", color: "#999", cursor: "pointer", padding: 8,
              }}
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="nav-hover" style={{ display: "flex", alignItems: "center", color: "#999", position: "relative", padding: 8 }}>
              <ShoppingCart size={18} />
              {count() > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: 2,
                  background: "var(--accent)", color: "#fff", borderRadius: "50%",
                  width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700,
                }}>
                  {count()}
                </span>
              )}
            </Link>

            {/* User Icon */}
            {user ? (
              <button
                onClick={() => setMobileUserOpen(!mobileUserOpen)}
                className="nav-hover"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: 8,
                }}
              >
                <User size={18} />
              </button>
            ) : (
              <Link to="/login" className="nav-hover-glow" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "var(--accent)", padding: "6px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600, minWidth: 82 }}>
                {tn("login")}
              </Link>
            )}
          </div>

          {/* Mobile Search Bar (expanded) */}
          {searchOpen && (
            <div style={{ padding: "8px 16px 12px", borderTop: "1px solid #2a2a2a" }}>
              <div ref={searchRef} style={{ position: "relative" }}>
                {searchInput}
                {searchSuggestions}
              </div>
            </div>
          )}

          {/* Mobile Nav Drawer */}
          {mobileMenuOpen && (
            <div ref={menuRef} style={{
              position: "fixed", top: 56, left: 0, right: 0, bottom: 0,
              background: "rgba(18,18,18,0.98)", zIndex: 999,
              overflowY: "auto", animation: "fadeIn 0.2s ease",
            }}>
              <div style={{ padding: "16px 20px" }}>
                {/* Wallet */}
                {user && (
                  <button
                    onClick={() => { setShowWallet(true); setMobileMenuOpen(false); }}
                    className="nav-hover-glow"
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "14px 16px", background: "#1a1a2e", border: "1px solid #2a2a4a",
                      borderRadius: 10, color: "#4fc3f7", cursor: "pointer", fontSize: 15, fontWeight: 700,
                      marginBottom: 16,
                    }}
                  >
                    <Wallet size={18} />
                    {formatVND(user.wallet)}
                  </button>
                )}

                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-hover-gold"
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 16px", color: "#ffd700", fontSize: 14, fontWeight: 600,
                      background: "rgba(255,215,0,0.08)", borderRadius: 8, marginBottom: 12,
                    }}
                  >
                    <Shield size={18} />
                    {tn("admin")}
                  </Link>
                )}

                {/* Nav Links */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {navLinks
                    .filter((link) => !link.auth || user)
                    .map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="nav-hover-link"
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "12px 16px",
                          borderRadius: 8, fontSize: 14, fontWeight: 600,
                          color: location.pathname === link.to ? "#fff" : "#999",
                          background: location.pathname === link.to ? "#2a2a3a" : "transparent",
                        }}
                      >
                        {tn(link.key)}
                      </Link>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#2a2a2a", margin: "16px 0" }} />

                {/* User Actions */}
                {user ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="nav-hover-link"
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 16px", borderRadius: 8, fontSize: 14, color: "#ccc",
                      }}
                    >
                      <UserCircle size={18} />
                      {tn("profile")}
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="nav-hover-danger"
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 16px", background: "none", border: "none",
                        borderRadius: 8, fontSize: 14, color: "#e94560", cursor: "pointer",
                        textAlign: "left", width: "100%",
                      }}
                    >
                      <LogOut size={18} />
                      {tn("logout")}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-hover-glow"
                    style={{
                      display: "block", textAlign: "center",
                      padding: "12px", background: "var(--accent)", color: "#fff",
                      borderRadius: 8, fontSize: 14, fontWeight: 700,
                    }}
                  >
                    {tn("login")}
                  </Link>
                )}

                {/* Notifications in drawer */}
                {user && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#888", marginBottom: 8, padding: "0 16px" }}>
                      {tn("notifications")} {unreadCount > 0 && `(${unreadCount})`}
                    </p>
                    {notifications.length === 0 ? (
                      <p style={{ padding: "12px 16px", color: "#666", fontSize: 13 }}>{tn("noNotifications")}</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => { handleMarkRead(n); setMobileMenuOpen(false); }}
                          className="nav-hover"
                          style={{
                            padding: "10px 16px", borderBottom: "1px solid #222", cursor: "pointer",
                            background: n.isRead ? "transparent" : "#1e1e30", borderRadius: 4, marginBottom: 2,
                          }}
                        >
                          <p style={{ fontSize: 12, color: "#fff", fontWeight: n.isRead ? 400 : 600 }}>{n.title}</p>
                          <p style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile User Dropdown */}
          {mobileUserOpen && user && (
            <div
              ref={userRef}
              style={{
                position: "absolute", top: "100%", right: 12, marginTop: 4,
                width: 220, background: "#1a1a1a", border: "1px solid #333",
                borderRadius: 10, overflow: "hidden", zIndex: 1001,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
              onClick={() => setMobileUserOpen(false)}
            >
              {/* User Info */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a2a2a" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{user.displayName || user.username}</p>
                <p style={{ fontSize: 11, color: "#888", marginTop: 2 }}>@{user.username}</p>
              </div>
              {mobileUserLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-hover-link"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", fontSize: 13, color: "#ccc",
                  }}
                >
                  <link.icon size={16} color="#888" />
                  {tn(link.key)}
                </Link>
              ))}
              <div style={{ height: 1, background: "#2a2a2a" }} />
              <button
                onClick={() => { logout(); setMobileUserOpen(false); }}
                className="nav-hover-danger"
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px", background: "none", border: "none",
                  fontSize: 13, color: "#e94560", cursor: "pointer", textAlign: "left",
                }}
              >
                <LogOut size={16} />
                {tn("logout")}
              </button>
            </div>
          )}
        </nav>
        {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
      </>
    );
  }

  // ===== DESKTOP VERSION =====
  return (
    <>
      <nav className="glass" style={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <div className="container" style={{ display: "flex", alignItems: "center", height: 56, gap: 32 }}>
          {/* Logo */}
          <Link to="/" className="nav-hover" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Gamepad2 size={24} color="var(--accent)" />
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1, color: "#fff" }}>GAMESTORE</span>
          </Link>

          {/* Nav Links */}
          <div style={{ display: "flex", gap: 24, fontSize: 13, fontWeight: 500 }}>
            <Link to="/store" className="nav-hover-link" style={{ padding: "4px 12px", minWidth: 92, textAlign: "center", ...isActive("/store") }}>{tn("store")}</Link>
            {user && <Link to="/library" className="nav-hover-link" style={{ padding: "4px 12px", minWidth: 92, textAlign: "center", ...isActive("/library") }}>{tn("library")}</Link>}
            {user && <Link to="/wishlist" className="nav-hover-link" style={{ padding: "4px 12px", minWidth: 92, textAlign: "center", ...isActive("/wishlist") }}>{tn("wishlist")}</Link>}
            {user && <Link to="/orders" className="nav-hover-link" style={{ padding: "4px 12px", minWidth: 92, textAlign: "center", ...isActive("/orders") }}>{tn("orders")}</Link>}
          </div>

          <div style={{ flex: 1 }} />

          {/* Right Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
            {/* SEARCH */}
            <div ref={searchRef} style={{ position: "relative" }}>
              {!searchOpen ? (
                <button onClick={() => setSearchOpen(true)} className="nav-hover" style={{ display: "flex", alignItems: "center", gap: 6, color: "#999", background: "none", border: "none", cursor: "pointer" }}>
                  <Search size={16} />
                </button>
              ) : (
                <div style={{ position: "relative", width: 200 }}>{searchInput}</div>
              )}
              {searchSuggestions}
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist" className="nav-hover" style={{ display: "flex", alignItems: "center", gap: 6, color: "#999" }}>
                <Heart size={18} />
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <div ref={notiRef} style={{ position: "relative" }}>
                <button
                  onClick={() => { setShowNoti(!showNoti); fetchNotifications(); }}
                  className="nav-hover"
                  style={{ display: "flex", alignItems: "center", gap: 6, color: "#999", background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute", top: -2, right: -2,
                      background: "#e94560", color: "#fff", borderRadius: "50%",
                      width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700,
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNoti && (
                  <div style={{
                    position: "absolute", top: "100%", right: 0, marginTop: 8,
                    width: 320, background: "#1a1a1a", border: "1px solid #333", borderRadius: 8,
                    overflow: "hidden", zIndex: 1001, boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    maxHeight: 400, overflowY: "auto",
                  }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>{t("nav.notifications")}</span>
                      <span style={{ color: "#888", fontSize: 11 }}>{unreadCount} {t("common.unread")}</span>
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 20, textAlign: "center", color: "#666", fontSize: 12 }}>{t("nav.noNotifications")}</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id} onClick={() => handleMarkRead(n)}
                          className="nav-hover-link"
                          style={{ padding: "10px 16px", borderBottom: "1px solid #222", cursor: "pointer", background: n.isRead ? "transparent" : "#1e1e30" }}
                        >
                          <p style={{ fontSize: 12, color: "#fff", fontWeight: n.isRead ? 400 : 600, marginBottom: 2 }}>{n.title}</p>
                          <p style={{ fontSize: 11, color: "#888" }}>{n.message}</p>
                          <p style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <Link to="/cart" className="nav-hover" style={{ display: "flex", alignItems: "center", gap: 6, color: "#999", position: "relative" }}>
              <ShoppingCart size={18} />
              {count() > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -10,
                  background: "var(--accent)", color: "#fff", borderRadius: "50%",
                  width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                }}>
                  {count()}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <>
                <button onClick={() => setShowWallet(true)} className="nav-hover-glow" style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#4fc3f7", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "4px 8px", borderRadius: 4 }}>
                  <Wallet size={14} />{formatVND(user.wallet)}
                </button>
                {isAdmin && (
                  <Link to="/admin" className="nav-hover-gold" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#ffd700", fontSize: 12, fontWeight: 600, background: "rgba(255,215,0,0.1)", padding: "4px 10px", borderRadius: 4, minWidth: 130 }}>
                    <Shield size={14} /> {tn("admin")}
                  </Link>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 12, borderLeft: "1px solid #333", paddingLeft: 16 }}>
                  <Link to="/profile" className="nav-hover-link" style={{ display: "flex", alignItems: "center", gap: 6, color: "#ccc", textDecoration: "none", padding: "4px 8px", borderRadius: 4 }}>
                    <User size={16} />
                    <span style={{ fontWeight: 500 }}>{user.displayName || user.username}</span>
                  </Link>
                  <button onClick={logout} title={tn("logout")} className="nav-hover-danger" style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: 12, padding: "4px 6px", borderRadius: 4 }}>
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="nav-hover-glow" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#fff", fontSize: 13, fontWeight: 600, background: "var(--accent)", padding: "6px 14px", borderRadius: 4, minWidth: 100 }}>
                <User size={14} /> {tn("login")}
              </Link>
            )}
          </div>
        </div>
      </nav>
      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </>
  );
}
