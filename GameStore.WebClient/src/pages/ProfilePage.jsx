// GameStore.WebClient/src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userAPI } from "../services/api";
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
} from "lucide-react";
import { ProfileSkeleton } from "../components/common/PageSkeleton";

export default function ProfilePage() {
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
  }, [user, navigate]);

  const validateProfile = () => {
    const errs = {};
    if (!profile.displayName.trim()) errs.displayName = "Tên hiển thị không được để trống";
    if (!profile.email.trim()) errs.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      errs.email = "Email không hợp lệ";
    return errs;
  };

  const validatePassword = () => {
    const errs = {};
    if (passwordForm.newPassword || passwordForm.confirmPassword) {
      if (!passwordForm.currentPassword)
        errs.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      if (passwordForm.newPassword.length < 6)
        errs.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
      if (passwordForm.newPassword !== passwordForm.confirmPassword)
        errs.confirmPassword = "Mật khẩu xác nhận không khớp";
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

      toast.success("Cập nhật thông tin thành công!", {
        style: { background: "#16162a", color: "#fff", border: "1px solid #2a2a4a" },
      });

      // Reset password form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (err) {
      const message =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(message, {
        style: { background: "#16162a", color: "#fff", border: "1px solid #2a2a4a" },
      });
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
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Thông tin tài khoản</h1>
        <p style={{ color: "#888", fontSize: 14 }}>Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>

      <form onSubmit={handleProfileSubmit}>
        {/* Personal Info Card */}
        <div
          style={{
            background: "#16162a",
            borderRadius: 16,
            border: "1px solid #2a2a4a",
            padding: 32,
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
            Thông tin cá nhân
          </h2>

          {/* Avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 28,
              paddingBottom: 28,
              borderBottom: "1px solid #2a2a4a",
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
              <div style={{ marginTop: 10 }}>
                <input
                  value={profile.avatarUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, avatarUrl: e.target.value })
                  }
                  placeholder="URL ảnh đại diện..."
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "#0a0a15",
                    border: "1px solid #2a2a4a",
                    borderRadius: 8,
                    color: "#e0e0e0",
                    fontSize: 12,
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Username (read-only) */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
                Tên đăng nhập
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
                Tên hiển thị <span style={{ color: "#e94560" }}>*</span>
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
                  placeholder="Nhập tên hiển thị"
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
                Email <span style={{ color: "#e94560" }}>*</span>
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
                  placeholder="Nhập email"
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
                Số điện thoại
              </label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={16}
                  color="#6b6b8e"
                  style={{ position: "absolute", left: 14, top: 14 }}
                />
                <input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="Nhập số điện thoại"
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    background: "#0a0a15",
                    border: "1px solid #2a2a4a",
                    borderRadius: 10,
                    color: "#e0e0e0",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Card */}
        <div
          style={{
            background: "#16162a",
            borderRadius: 16,
            border: "1px solid #2a2a4a",
            padding: 32,
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
            Đổi mật khẩu
          </h2>

          <p style={{ fontSize: 13, color: "#6b6b8e", marginBottom: 20 }}>
            Để trống nếu không muốn thay đổi mật khẩu
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Current Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
                Mật khẩu hiện tại
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
                  placeholder="Nhập mật khẩu hiện tại"
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
                Mật khẩu mới
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
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
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
                Xác nhận mật khẩu mới
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
                  placeholder="Nhập lại mật khẩu mới"
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

        {/* Submit Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
            style={{ padding: "12px 24px", fontSize: 14 }}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 32px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
              boxShadow: saving ? "none" : "0 0 20px rgba(0,120,242,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.boxShadow = "0 0 30px rgba(0,120,242,0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0,120,242,0.3)";
              }
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
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
