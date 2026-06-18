// GameStore.WebClient/src/components/layout/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { useTranslation } from "react-i18next";
import WalletModal from "../wallet/WalletModal";
import useCartStore from "../../stores/cartStore";
import { notificationAPI } from "../../services/api";
import { formatVND } from "../../utils/format";
import {
  ShoppingCart,
  Gamepad2,
  LogOut,
  User,
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
  const { isMobile, breakpoint, value } = useResponsive();

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileUserOpen, setMobileUserOpen] = useState(false);
  const menuRef = useRef(null);
  const userRef = useRef(null);

  // Tablet user dropdown
  const [tabletUserOpen, setTabletUserOpen] = useState(false);
  const tabletUserRef = useRef(null);

  // NOTIFICATION STATE
  const [showNoti, setShowNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notiRef = useRef(null);

  // SCROLL TRACKING — acrylic effect khi scroll
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(window.scrollY > 50);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    const handleClick = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target))
        setShowNoti(false);
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMobileMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setMobileUserOpen(false);
      if (tabletUserRef.current && !tabletUserRef.current.contains(e.target))
        setTabletUserOpen(false);
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

  const tn = (key) => t(`nav.${key}`);

  const compact = breakpoint === "md";
  const layoutTransition = { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] };

  // ACRYLIC EFFECT
  const navBaseStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    transition:
      "background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease",
    ...(scrolled
      ? {
          background: "rgba(18, 18, 18, 0.92)",
          backdropFilter: "blur(16px) saturate(1.4)",
          WebkitBackdropFilter: "blur(16px) saturate(1.4)",
          boxShadow: "0 2px 24px rgba(0, 0, 0, 0.4)",
        }
      : {}),
  };

  // ===== MOBILE VERSION =====
  return (
    <AnimatePresence mode="wait">
      {isMobile && (
        <motion.div
          key="mobile"
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={layoutTransition}
        >
          <nav className="glass" style={{ ...navBaseStyle }}>
            <div
              className="container"
              style={{
                display: "flex",
                alignItems: "center",
                height: 56,
                gap: 8,
                padding: "0 16px",
              }}
            >
              {/* Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="nav-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  color: "#ccc",
                  cursor: "pointer",
                  padding: 8,
                  marginRight: 4,
                }}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Logo */}
              <Link
                to="/"
                className="nav-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <Gamepad2 size={22} color="var(--accent)" />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 1,
                    color: "#fff",
                  }}
                >
                  GAME
                </span>
              </Link>

              <div style={{ flex: 1 }} />

              {/* Cart */}
              <Link
                to="/cart"
                className="nav-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#999",
                  position: "relative",
                  padding: 8,
                }}
              >
                <ShoppingCart size={18} />
                {count() > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "var(--accent)",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 16,
                      height: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    color: "#ccc",
                    cursor: "pointer",
                    padding: 8,
                  }}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid rgba(255,255,255,0.1)",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <User size={18} />
                  )}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="nav-hover-glow"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    background: "var(--accent)",
                    padding: "6px 10px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    minWidth: 82,
                  }}
                >
                  {tn("login")}
                </Link>
              )}
            </div>

            {/* Mobile Nav Drawer */}
            {mobileMenuOpen && (
              <div
                ref={menuRef}
                style={{
                  position: "fixed",
                  top: 56,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(18,18,18,0.98)",
                  zIndex: 999,
                  overflowY: "auto",
                  animation: "fadeIn 0.2s ease",
                }}
              >
                <div style={{ padding: "16px 20px" }}>
                  {/* Wallet */}
                  {user && (
                    <button
                      onClick={() => {
                        setShowWallet(true);
                        setMobileMenuOpen(false);
                      }}
                      className="nav-hover-glow"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "14px 16px",
                        background: "#1a1a2e",
                        border: "1px solid #2a2a4a",
                        borderRadius: 10,
                        color: "#4fc3f7",
                        cursor: "pointer",
                        fontSize: 15,
                        fontWeight: 700,
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
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        color: "#ffd700",
                        fontSize: 14,
                        fontWeight: 600,
                        background: "rgba(255,215,0,0.08)",
                        borderRadius: 8,
                        marginBottom: 12,
                      }}
                    >
                      <Shield size={18} />
                      {tn("admin")}
                    </Link>
                  )}

                  {/* Nav Links */}
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {navLinks
                      .filter((link) => !link.auth || user)
                      .map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="nav-hover-link"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "12px 16px",
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 600,
                            color:
                              location.pathname === link.to ? "#fff" : "#999",
                            background:
                              location.pathname === link.to
                                ? "#2a2a3a"
                                : "transparent",
                          }}
                        >
                          {tn(link.key)}
                        </Link>
                      ))}
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      height: 1,
                      background: "#2a2a2a",
                      margin: "16px 0",
                    }}
                  />

                  {/* User Actions */}
                  {user ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="nav-hover-link"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 16px",
                          borderRadius: 8,
                          fontSize: 14,
                          color: "#ccc",
                        }}
                      >
                        <UserCircle size={18} />
                        {tn("profile")}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="nav-hover-danger"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 16px",
                          background: "none",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 14,
                          color: "#e94560",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
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
                        display: "block",
                        textAlign: "center",
                        padding: "12px",
                        background: "var(--accent)",
                        color: "#fff",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {tn("login")}
                    </Link>
                  )}

                  {/* Notifications in drawer */}
                  {user && (
                    <div style={{ marginTop: 16 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#888",
                          marginBottom: 8,
                          padding: "0 16px",
                        }}
                      >
                        {tn("notifications")}{" "}
                        {unreadCount > 0 && `(${unreadCount})`}
                      </p>
                      {notifications.length === 0 ? (
                        <p
                          style={{
                            padding: "12px 16px",
                            color: "#666",
                            fontSize: 13,
                          }}
                        >
                          {tn("noNotifications")}
                        </p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              handleMarkRead(n);
                              setMobileMenuOpen(false);
                            }}
                            className="nav-hover"
                            style={{
                              padding: "10px 16px",
                              borderBottom: "1px solid #222",
                              cursor: "pointer",
                              background: n.isRead ? "transparent" : "#1e1e30",
                              borderRadius: 4,
                              marginBottom: 2,
                            }}
                          >
                            <p
                              style={{
                                fontSize: 12,
                                color: "#fff",
                                fontWeight: n.isRead ? 400 : 600,
                              }}
                            >
                              {n.title}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: "#888",
                                marginTop: 2,
                              }}
                            >
                              {n.message}
                            </p>
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
                  position: "absolute",
                  top: "100%",
                  right: 12,
                  marginTop: 4,
                  width: 220,
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 10,
                  overflow: "hidden",
                  zIndex: 1001,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
                onClick={() => setMobileUserOpen(false)}
              >
                {/* User Info */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #2a2a2a",
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
                    {user.displayName || user.username}
                  </p>
                  <p style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                    @{user.username}
                  </p>
                </div>
                {mobileUserLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="nav-hover-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 16px",
                      fontSize: 13,
                      color: "#ccc",
                    }}
                  >
                    <link.icon size={16} color="#888" />
                    {tn(link.key)}
                  </Link>
                ))}
                <div style={{ height: 1, background: "#2a2a2a" }} />
                <button
                  onClick={() => {
                    logout();
                    setMobileUserOpen(false);
                  }}
                  className="nav-hover-danger"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    fontSize: 13,
                    color: "#e94560",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <LogOut size={16} />
                  {tn("logout")}
                </button>
              </div>
            )}
          </nav>
          {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
        </motion.div>
      )}
      {!isMobile && breakpoint === "sm" && (
        <motion.div
          key="tablet"
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={layoutTransition}
        >
          <nav className="glass" style={{ ...navBaseStyle }}>
            <div
              className="container"
              style={{
                display: "flex",
                alignItems: "center",
                height: 56,
                gap: 16,
              }}
            >
              {/* Logo */}
              <Link
                to="/"
                className="nav-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <Gamepad2 size={22} color="var(--accent)" />
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    letterSpacing: 1,
                    color: "#fff",
                  }}
                >
                  GAMESTORE
                </span>
              </Link>

              {/* Nav Links — only Store visible */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <Link
                  to="/store"
                  className="nav-hover-link"
                  style={{ padding: "4px 8px", ...isActive("/store") }}
                >
                  {tn("store")}
                </Link>
              </div>

              <div style={{ flex: 1 }} />

              {/* Right Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 12,
                }}
              >
                {/* Notifications */}
                {user && (
                  <div ref={notiRef} style={{ position: "relative" }}>
                    <button
                      onClick={() => {
                        setShowNoti(!showNoti);
                        fetchNotifications();
                      }}
                      className="nav-hover"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#999",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        padding: 6,
                      }}
                    >
                      <Bell size={16} />
                      {unreadCount > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            background: "#e94560",
                            color: "#fff",
                            borderRadius: "50%",
                            width: 16,
                            height: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 9,
                            fontWeight: 700,
                          }}
                        >
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                    {showNoti && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          marginTop: 8,
                          width: 300,
                          background: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: 8,
                          overflow: "hidden",
                          zIndex: 1001,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                          maxHeight: 360,
                          overflowY: "auto",
                        }}
                      >
                        <div
                          style={{
                            padding: "10px 14px",
                            borderBottom: "1px solid #333",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#fff",
                              fontSize: 12,
                            }}
                          >
                            {t("nav.notifications")}
                          </span>
                          <span style={{ color: "#888", fontSize: 11 }}>
                            {unreadCount} {t("common.unread")}
                          </span>
                        </div>
                        {notifications.length === 0 ? (
                          <div
                            style={{
                              padding: 20,
                              textAlign: "center",
                              color: "#666",
                              fontSize: 12,
                            }}
                          >
                            {t("nav.noNotifications")}
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleMarkRead(n)}
                              className="nav-hover-link"
                              style={{
                                padding: "10px 14px",
                                borderBottom: "1px solid #222",
                                cursor: "pointer",
                                background: n.isRead
                                  ? "transparent"
                                  : "#1e1e30",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "#fff",
                                  fontWeight: n.isRead ? 400 : 600,
                                  marginBottom: 2,
                                }}
                              >
                                {n.title}
                              </p>
                              <p style={{ fontSize: 11, color: "#888" }}>
                                {n.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Cart */}
                <Link
                  to="/cart"
                  className="nav-hover"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#999",
                    position: "relative",
                    padding: 6,
                  }}
                >
                  <ShoppingCart size={16} />
                  {count() > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "var(--accent)",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                    >
                      {count()}
                    </span>
                  )}
                </Link>

                {/* User */}
                {user ? (
                  <div ref={tabletUserRef} style={{ position: "relative" }}>
                    <button
                      onClick={() => setTabletUserOpen(!tabletUserOpen)}
                      className="nav-hover"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        background: "none",
                        border: "none",
                        color: "#ccc",
                        cursor: "pointer",
                        padding: "6px 8px",
                        borderRadius: 4,
                        background: tabletUserOpen
                          ? "rgba(255,255,255,0.08)"
                          : "transparent",
                      }}
                    >
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt=""
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid rgba(255,255,255,0.1)",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <User size={16} />
                      )}
                    </button>

                    {tabletUserOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          marginTop: 6,
                          width: 220,
                          background: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: 10,
                          overflow: "hidden",
                          zIndex: 1001,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        }}
                        onClick={() => setTabletUserOpen(false)}
                      >
                        {/* Wallet */}
                        <div
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #2a2a2a",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              color: "#4fc3f7",
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            <Wallet size={16} />
                            {formatVND(user.wallet)}
                          </div>
                          <p
                            style={{
                              fontSize: 11,
                              color: "#888",
                              marginTop: 4,
                            }}
                          >
                            @{user.username}
                          </p>
                        </div>

                        {/* Links */}
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {mobileUserLinks.map((link) => (
                            <Link
                              key={link.to}
                              to={link.to}
                              className="nav-hover-link"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 16px",
                                fontSize: 13,
                                color: "#ccc",
                              }}
                            >
                              <link.icon size={16} color="#888" />
                              {tn(link.key)}
                            </Link>
                          ))}
                        </div>

                        {/* Admin */}
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="nav-hover-gold"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "10px 16px",
                              fontSize: 13,
                              color: "#ffd700",
                              borderTop: "1px solid #2a2a2a",
                            }}
                          >
                            <Shield size={16} />
                            {tn("admin")}
                          </Link>
                        )}

                        {/* Logout */}
                        <div style={{ height: 1, background: "#2a2a2a" }} />
                        <button
                          onClick={() => {
                            logout();
                            setTabletUserOpen(false);
                          }}
                          className="nav-hover-danger"
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 16px",
                            background: "none",
                            border: "none",
                            fontSize: 13,
                            color: "#e94560",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <LogOut size={16} />
                          {tn("logout")}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="nav-hover-glow"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      background: "var(--accent)",
                      padding: "6px 12px",
                      borderRadius: 10,
                    }}
                  >
                    <User size={14} /> {tn("login")}
                  </Link>
                )}
              </div>
            </div>
          </nav>
          {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
        </motion.div>
      )}
      {!isMobile && breakpoint !== "sm" && (
        <motion.div
          key="desktop"
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={layoutTransition}
        >
          <nav className="glass" style={{ ...navBaseStyle }}>
            <div
              className="container"
              style={{
                display: "flex",
                alignItems: "center",
                height: 56,
                gap: compact ? 16 : 32,
              }}
            >
              {/* Logo */}
              <Link
                to="/"
                className="nav-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: compact ? 6 : 8,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                <Gamepad2 size={compact ? 22 : 24} color="var(--accent)" />
                <span
                  style={{
                    fontSize: compact ? 15 : 16,
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
                style={{
                  display: "flex",
                  gap: compact ? 12 : 24,
                  fontSize: compact ? 12 : 13,
                  fontWeight: 500,
                }}
              >
                <Link
                  to="/store"
                  className="nav-hover-link"
                  style={{
                    padding: "4px 10px",
                    whiteSpace: "nowrap",
                    ...isActive("/store"),
                  }}
                >
                  {tn("store")}
                </Link>
                {user && (
                  <Link
                    to="/library"
                    className="nav-hover-link"
                    style={{
                      padding: "4px 10px",
                      whiteSpace: "nowrap",
                      ...isActive("/library"),
                    }}
                  >
                    {tn("library")}
                  </Link>
                )}
                {user && (
                  <Link
                    to="/wishlist"
                    className="nav-hover-link"
                    style={{
                      padding: "4px 10px",
                      whiteSpace: "nowrap",
                      ...isActive("/wishlist"),
                    }}
                  >
                    {tn("wishlist")}
                  </Link>
                )}
                {user && (
                  <Link
                    to="/orders"
                    className="nav-hover-link"
                    style={{
                      padding: "4px 10px",
                      whiteSpace: "nowrap",
                      ...isActive("/orders"),
                    }}
                  >
                    {tn("orders")}
                  </Link>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }} />

              {/* Right Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: compact ? 10 : 16,
                  fontSize: compact ? 12 : 13,
                }}
              >
                {/* Notifications */}
                {user && (
                  <div ref={notiRef} style={{ position: "relative" }}>
                    <button
                      onClick={() => {
                        setShowNoti(!showNoti);
                        fetchNotifications();
                      }}
                      className="nav-hover"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#999",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        padding: compact ? 3 : 4,
                      }}
                    >
                      <Bell size={compact ? 16 : 18} />
                      {unreadCount > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: compact ? -1 : -2,
                            right: compact ? -1 : -2,
                            background: "#e94560",
                            color: "#fff",
                            borderRadius: "50%",
                            width: compact ? 16 : 18,
                            height: compact ? 16 : 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: compact ? 9 : 10,
                            fontWeight: 700,
                          }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {showNoti && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          marginTop: 8,
                          width: compact ? 280 : 320,
                          background: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: 8,
                          overflow: "hidden",
                          zIndex: 1001,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                          maxHeight: 400,
                          overflowY: "auto",
                        }}
                      >
                        <div
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #333",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "#fff",
                              fontSize: 13,
                            }}
                          >
                            {t("nav.notifications")}
                          </span>
                          <span style={{ color: "#888", fontSize: 11 }}>
                            {unreadCount} {t("common.unread")}
                          </span>
                        </div>
                        {notifications.length === 0 ? (
                          <div
                            style={{
                              padding: 20,
                              textAlign: "center",
                              color: "#666",
                              fontSize: 12,
                            }}
                          >
                            {t("nav.noNotifications")}
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleMarkRead(n)}
                              className="nav-hover-link"
                              style={{
                                padding: "10px 16px",
                                borderBottom: "1px solid #222",
                                cursor: "pointer",
                                background: n.isRead
                                  ? "transparent"
                                  : "#1e1e30",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "#fff",
                                  fontWeight: n.isRead ? 400 : 600,
                                  marginBottom: 2,
                                }}
                              >
                                {n.title}
                              </p>
                              <p style={{ fontSize: 11, color: "#888" }}>
                                {n.message}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: "#555",
                                  marginTop: 4,
                                }}
                              >
                                {new Date(n.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Cart */}
                <Link
                  to="/cart"
                  className="nav-hover"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#999",
                    position: "relative",
                    padding: 2,
                  }}
                >
                  <ShoppingCart size={compact ? 16 : 18} />
                  {count() > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: compact ? -3 : -6,
                        right: compact ? -5 : -10,
                        background: "var(--accent)",
                        color: "#fff",
                        borderRadius: "50%",
                        width: compact ? 16 : 18,
                        height: compact ? 16 : 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: compact ? 9 : 10,
                        fontWeight: 700,
                      }}
                    >
                      {count()}
                    </span>
                  )}
                </Link>

                {/* User */}
                {user ? (
                  <>
                    <button
                      onClick={() => setShowWallet(true)}
                      className="nav-hover-glow"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "none",
                        border: "none",
                        color: "#4fc3f7",
                        cursor: "pointer",
                        fontSize: compact ? 12 : 13,
                        fontWeight: 600,
                        padding: "4px 6px",
                        borderRadius: 4,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Wallet size={compact ? 13 : 14} />
                      {formatVND(user.wallet)}
                    </button>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="nav-hover-gold"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          color: "#ffd700",
                          fontSize: compact ? 11 : 12,
                          fontWeight: 600,
                          background: "rgba(255,215,0,0.1)",
                          padding: "4px 8px",
                          borderRadius: 4,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Shield size={compact ? 13 : 14} />{" "}
                        {compact ? "" : tn("admin")}
                      </Link>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: compact ? 4 : 8,
                        color: "#ccc",
                        fontSize: compact ? 11 : 12,
                        borderLeft: "1px solid #333",
                        paddingLeft: compact ? 10 : 16,
                      }}
                    >
                      {compact ? (
                        <button
                          onClick={() => navigate("/profile")}
                          className="nav-hover-link"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "none",
                            border: "none",
                            color: "#ccc",
                            cursor: "pointer",
                            padding: "4px 6px",
                            borderRadius: 4,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt=""
                              style={{
                                width: 23,
                                height: 23,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid rgba(255,255,255,0.1)",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <User size={16} />
                          )}
                        </button>
                      ) : (
                        <Link
                          to="/profile"
                          className="nav-hover-link"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            color: "#ccc",
                            textDecoration: "none",
                            padding: "4px 8px",
                            borderRadius: 4,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt=""
                              style={{
                                width: 25,
                                height: 25,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid rgba(255,255,255,0.1)",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <User size={16} />
                          )}
                          <span style={{ fontWeight: 500 }}>
                            {user.displayName || user.username}
                          </span>
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        title={tn("logout")}
                        className="nav-hover-danger"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          background: "none",
                          border: "none",
                          color: "#999",
                          cursor: "pointer",
                          fontSize: compact ? 11 : 12,
                          padding: "4px 6px",
                          borderRadius: 4,
                        }}
                      >
                        <LogOut size={compact ? 13 : 14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="nav-hover-glow"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      color: "#fff",
                      fontSize: compact ? 12 : 13,
                      fontWeight: 600,
                      background: "var(--accent)",
                      padding: "6px 12px",
                      borderRadius: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <User size={compact ? 13 : 14} /> {tn("login")}
                  </Link>
                )}
              </div>
            </div>
          </nav>
          {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
