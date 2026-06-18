// GameStore.WebClient/src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  Wallet,
  Clock,
  ArrowUp,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { ProfileSkeleton } from "../../components/common";
import { formatVND } from "../../utils/format";
import { useTranslation } from "react-i18next";
import WalletModal from "../../components/wallet/WalletModal";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Profile form state
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [avatarError, setAvatarError] = useState(false);
  const fileInputRef = useRef(null);

  // Wallet state
  const [walletTxns, setWalletTxns] = useState([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  // Load profile data
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const { data } = await userAPI.getProfile();
        setProfile({
          displayName: data.displayName || "",
          email: data.email || "",
          phone: data.phone || "",
          avatarUrl: data.avatarUrl || "",
        });
      } catch {
        // Fallback to auth context data
        setProfile({
          displayName: user.displayName || "",
          email: user.email || "",
          phone: user.phone || "",
          avatarUrl: user.avatarUrl || "",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // Load wallet transactions
    const loadTxns = async () => {
      setWalletLoading(true);
      try {
        const { data } = await userAPI.getTransactions(1, 10);
        const items = Array.isArray(data) ? data : data?.items || data?.data || [];
        setWalletTxns(items);
      } catch { /* ignore */ }
      finally { setWalletLoading(false); }
    };
    loadTxns();
  }, [user, navigate]);

  const validateProfile = () => {
    const errs = {};
    if (!profile.displayName.trim()) errs.displayName = t("profile.displayNameRequired");
    if (!profile.email.trim()) errs.email = t("profile.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      errs.email = t("profile.emailInvalid");
    if (profile.phone.trim() && !/^0[35789][0-9]{8}$/.test(profile.phone))
      errs.phone = t("profile.phoneInvalid");
    return errs;
  };

  const validatePassword = () => {
    const errs = {};
    if (passwordForm.newPassword || passwordForm.confirmPassword) {
      if (!passwordForm.currentPassword)
        errs.currentPassword = t("profile.currentPasswordRequired");
      if (passwordForm.newPassword.length < 6)
        errs.newPassword = t("profile.newPasswordMin");
      if (passwordForm.newPassword !== passwordForm.confirmPassword)
        errs.confirmPassword = t("profile.confirmPasswordNoMatch");
    }
    return errs;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields at once
    const profileErrs = validateProfile();
    const hasPasswordChange =
      passwordForm.currentPassword ||
      passwordForm.newPassword ||
      passwordForm.confirmPassword;
    const passwordErrs = hasPasswordChange ? validatePassword() : {};

    const allErrors = { ...profileErrs, ...passwordErrs };
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        displayName: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        avatarUrl: profile.avatarUrl,
      };

      if (hasPasswordChange) {
        payload.currentPassword = passwordForm.currentPassword;
        payload.password = passwordForm.newPassword;
      }

      await userAPI.updateProfile(payload);
      updateUser({
        displayName: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        avatarUrl: profile.avatarUrl,
      });

      toast.success(t("profile.updateSuccess"));

      // Reset password form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (err) {
      const message =
        err.response?.data?.message || t("profile.error");
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;
  if (loading) return <ProfileSkeleton />;

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60, maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{t("profile.title")}</h1>
        <p style={{ color: "#888", fontSize: 14 }}>{t("profile.subtitle")}</p>
      </div>

      <form onSubmit={handleProfileSubmit}>
        {/* Personal Info Card */}
        <div
          style={{
            background: "#16162a",
            borderRadius: 16,
            border: "1px solid #2a2a4a",
            padding: "clamp(20px, 3vw, 32px)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <User size={20} color="var(--accent)" />
            {t("profile.personalInfo")}
          </h2>

          {/* Avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(12px, 2.5vw, 20px)",
              marginBottom: 28,
              paddingBottom: 28,
              borderBottom: "1px solid #2a2a4a",
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setProfile({ ...profile, avatarUrl: ev.target?.result });
                    setAvatarError(false);
                  };
                  reader.onerror = () => setAvatarError(true);
                  reader.readAsDataURL(file);
                }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: profile.avatarUrl && !avatarError
                    ? "transparent"
                    : "linear-gradient(135deg, #2a2a4a, #1a1a3e)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #2a2a4a",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(0,120,242,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a4a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {profile.avatarUrl && !avatarError ? (
                  <img
                    src={profile.avatarUrl}
                    alt="avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={() => setAvatarError(true)}
                    onLoad={() => setAvatarError(false)}
                  />
                ) : (
                  <User size={36} color="#6b6b8e" />
                )}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                {profile.displayName || user.username}
              </p>
              <p style={{ fontSize: 12, color: "#6b6b8e", marginTop: 2 }}>
                @{user.username}
              </p>

            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Username (read-only) */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
                {t("profile.username")}
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  background: "#0a0a15",
                  border: "1px solid #2a2a4a",
                  borderRadius: 10,
                  color: "#555",
                  fontSize: 14,
                }}
              >
                <User size={16} color="#444" />
                {user.username}
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
                {t("profile.displayName")} <span style={{ color: "#e94560" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  color="#6b6b8e"
                  style={{ position: "absolute", left: 14, top: 14 }}
                />
                <input
                  value={profile.displayName}
                  onChange={(e) =>
                    setProfile({ ...profile, displayName: e.target.value })
                  }
                  placeholder={t("profile.displayNamePlaceholder")}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    background: "#0a0a15",
                    border: `1px solid ${errors.displayName ? "#e94560" : "#2a2a4a"}`,
                    borderRadius: 10,
                    color: "#e0e0e0",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              {errors.displayName && (
                <p style={{ color: "#e94560", fontSize: 12, marginTop: 4 }}>
                  {errors.displayName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
                {t("profile.email")} <span style={{ color: "#e94560" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  color="#6b6b8e"
                  style={{ position: "absolute", left: 14, top: 14 }}
                />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  placeholder={t("profile.emailPlaceholder")}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    background: "#0a0a15",
                    border: `1px solid ${errors.email ? "#e94560" : "#2a2a4a"}`,
                    borderRadius: 10,
                    color: "#e0e0e0",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              {errors.email && (
                <p style={{ color: "#e94560", fontSize: 12, marginTop: 4 }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
                {t("profile.phone")}
              </label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={16}
                  color="#6b6b8e"
                  style={{ position: "absolute", left: 14, top: 14 }}
                />
                <input
                  value={profile.phone}
                  onChange={(e) => {
                    setProfile({ ...profile, phone: e.target.value });
                    if (errors.phone) {
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }
                  }}
                  placeholder={t("profile.phonePlaceholder")}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    background: "#0a0a15",
                    border: `1px solid ${errors.phone ? "#e94560" : "#2a2a4a"}`,
                    borderRadius: 10,
                    color: "#e0e0e0",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              {errors.phone && (
                <p style={{ color: "#e94560", fontSize: 12, marginTop: 4 }}>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Password Change Card */}
        <div
          style={{
            background: "#16162a",
            borderRadius: 16,
            border: "1px solid #2a2a4a",
            padding: "clamp(20px, 3vw, 32px)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Lock size={20} color="var(--accent)" />
            {t("profile.changePassword")}
          </h2>

          <p style={{ fontSize: 13, color: "#6b6b8e", marginBottom: 20 }}>
            {t("profile.passwordSubtitle")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Current Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
                {t("profile.currentPassword")}
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  color="#6b6b8e"
                  style={{ position: "absolute", left: 14, top: 14 }}
                />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder={t("profile.currentPasswordPlaceholder")}
                  style={{
                    width: "100%",
                    padding: "12px 42px 12px 42px",
                    background: "#0a0a15",
                    border: `1px solid ${errors.currentPassword ? "#e94560" : "#2a2a4a"}`,
                    borderRadius: 10,
                    color: "#e0e0e0",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    background: "none",
                    border: "none",
                    color: "#6b6b8e",
                    cursor: "pointer",
                    padding: 2,
                  }}
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p style={{ color: "#e94560", fontSize: 12, marginTop: 4 }}>
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
                {t("profile.newPassword")}
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  color="#6b6b8e"
                  style={{ position: "absolute", left: 14, top: 14 }}
                />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder={t("profile.newPasswordPlaceholder")}
                  style={{
                    width: "100%",
                    padding: "12px 42px 12px 42px",
                    background: "#0a0a15",
                    border: `1px solid ${errors.newPassword ? "#e94560" : "#2a2a4a"}`,
                    borderRadius: 10,
                    color: "#e0e0e0",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    background: "none",
                    border: "none",
                    color: "#6b6b8e",
                    cursor: "pointer",
                    padding: 2,
                  }}
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPassword && (
                <p style={{ color: "#e94560", fontSize: 12, marginTop: 4 }}>
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
                {t("profile.confirmPassword")}
              </label>
              <div style={{ position: "relative" }}>
                <CheckCircle
                  size={16}
                  color="#6b6b8e"
                  style={{ position: "absolute", left: 14, top: 14 }}
                />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder={t("profile.confirmPasswordPlaceholder")}
                  style={{
                    width: "100%",
                    padding: "12px 42px 12px 42px",
                    background: "#0a0a15",
                    border: `1px solid ${errors.confirmPassword ? "#e94560" : "#2a2a4a"}`,
                    borderRadius: 10,
                    color: "#e0e0e0",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    background: "none",
                    border: "none",
                    color: "#6b6b8e",
                    cursor: "pointer",
                    padding: 2,
                  }}
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{ color: "#e94560", fontSize: 12, marginTop: 4 }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Wallet & Transaction History */}
        <div
          style={{
            background: "#16162a",
            borderRadius: 16,
            border: "1px solid #2a2a4a",
            padding: "clamp(20px, 3vw, 32px)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Wallet size={20} color="var(--accent)" />
            {t("wallet.title")}
          </h2>

          {/* Balance — clickable to open Wallet modal */}
          <div
            onClick={() => setShowWallet(true)}
            style={{
              background: "linear-gradient(135deg, #0d1b2a, #1b2838)",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 16,
              border: "1px solid rgba(79,195,247,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(79,195,247,0.4)";
              e.currentTarget.style.background = "linear-gradient(135deg, #0f1e30, #1d2c40)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(79,195,247,0.15)";
              e.currentTarget.style.background = "linear-gradient(135deg, #0d1b2a, #1b2838)";
            }}
          >
            <div>
              <p style={{ color: "#8ab", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                {t("wallet.balance")}
              </p>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#4fc3f7" }}>
                {formatVND(user?.wallet)}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, color: "#4fc3f7", opacity: 0.6 }}>{t("wallet.openWallet")}</span>
              <Wallet size={36} color="#4fc3f7" style={{ opacity: 0.3 }} />
            </div>
          </div>

          {/* Recent Transactions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Clock size={14} color="#888" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>
              {t("wallet.recentTransactions")}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 260, overflowY: "auto", paddingRight: 4 }}>
            {walletLoading && (
              <div style={{ textAlign: "center", padding: 20, color: "#888", fontSize: 13 }}>
                {t("common.loading")}
              </div>
            )}

            {!walletLoading && walletTxns.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#666", fontSize: 13 }}>
                <Clock size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                <p>{t("wallet.noTransactions")}</p>
              </div>
            )}

            {!walletLoading && walletTxns.map((tx) => {
              const isPositive = tx.type !== "Purchase";
              let icon, color;
              if (tx.type === "TopUp") { icon = ArrowUp; color = "#4caf50"; }
              else if (tx.type === "Purchase") { icon = ShoppingBag; color = "#e94560"; }
              else { icon = RotateCcw; color = "#ff9800"; }
              const Icon = icon;
              return (
                <div key={tx.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 8,
                  background: "#0d1117", border: "1px solid #1a1a2e",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${color}18`,
                  }}>
                    <Icon size={14} color={color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#e0e0e0" }}>
                      {tx.type === "TopUp" ? t("wallet.typeTopUp") :
                       tx.type === "Purchase" ? t("wallet.typePurchase") :
                       t("wallet.typeRefund")}
                    </p>
                    <p style={{ fontSize: 10, color: "#888", marginTop: 1 }}>
                      {new Date(tx.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p style={{
                    fontSize: 13, fontWeight: 700,
                    color: isPositive ? "#4caf50" : "#e94560",
                  }}>
                    {isPositive ? "+" : ""}{formatVND(tx.amount)}
                  </p>
                </div>
              );
            })}

            {/* View Full History */}
            <button onClick={() => setShowWallet(true)}
              style={{
                width: "100%", padding: "10px", borderRadius: 10, marginTop: 8,
                background: "none", border: "1px solid #2a2a4a", color: "#888",
                cursor: "pointer", fontSize: 12, fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4fc3f7";
                e.currentTarget.style.color = "#4fc3f7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a4a";
                e.currentTarget.style.color = "#888";
              }}
            >
              {t("wallet.openWallet")} →
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {saving ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                {t("profile.saving")}
              </>
            ) : (
              <>
                <Save size={18} />
                {t("profile.save")}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Wallet Modal */}
      {showWallet && <WalletModal onClose={() => setShowWallet(false)} initialTab="history" />}
    </div>
  );
}
