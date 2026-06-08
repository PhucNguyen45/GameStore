// GameStore.WebClient/src/pages/ResetPasswordPage.jsx
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get("token") || "";

  const [form, setForm] = useState({
    token: tokenFromUrl,
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.token.trim()) errs.token = "Token không được để trống";
    if (!form.newPassword) errs.newPassword = "Vui lòng nhập mật khẩu mới";
    else if (form.newPassword.length < 6)
      errs.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = "Mật khẩu xác nhận không khớp";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await authAPI.resetPassword(form.token.trim(), form.newPassword);
      setDone(true);
      toast.success("Mật khẩu đã được đặt lại thành công!", {
        style: { background: "#16162a", color: "#fff", border: "1px solid #2a2a4a" },
      });
    } catch (err) {
      const message = err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(message, {
        style: { background: "#16162a", color: "#fff", border: "1px solid #2a2a4a" },
      });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <div
          style={{
            background: "#16162a",
            borderRadius: 16,
            padding: 40,
            width: "100%",
            maxWidth: 440,
            border: "1px solid #2a2a4a",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4caf50, #2e7d32)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircle size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Đặt lại mật khẩu thành công!
          </h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập với mật khẩu mới.
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-block",
              padding: "12px 40px",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
      <div
        style={{
          background: "#16162a",
          borderRadius: 16,
          padding: 40,
          width: "100%",
          maxWidth: 440,
          border: "1px solid #2a2a4a",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), #0055b3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <KeyRound size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Đặt lại mật khẩu</h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginTop: 8 }}>
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Token (hidden if from URL) */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>
              Token đặt lại
            </label>
            <div style={{ position: "relative" }}>
              <KeyRound
                size={16}
                color="#6b6b8e"
                style={{ position: "absolute", left: 14, top: 14 }}
              />
              <input
                value={form.token}
                onChange={(e) => setForm({ ...form, token: e.target.value })}
                placeholder="Nhập token đặt lại mật khẩu"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  background: "#0a0a15",
                  border: `1px solid ${errors.token ? "#e94560" : "#2a2a4a"}`,
                  borderRadius: 10,
                  color: "#e0e0e0",
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "monospace",
                }}
              />
            </div>
            {errors.token && (
              <p style={{ color: "#e94560", fontSize: 12, marginTop: 4 }}>{errors.token}</p>
            )}
          </div>

          {/* New Password */}
          <div style={{ marginBottom: 16 }}>
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
                type={showPassword ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
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
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <p style={{ color: "#e94560", fontSize: 12, marginTop: 4 }}>{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 24 }}>
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
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  background: "#0a0a15",
                  border: `1px solid ${errors.confirmPassword ? "#e94560" : "#2a2a4a"}`,
                  borderRadius: 10,
                  color: "#e0e0e0",
                  fontSize: 14,
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
            {errors.confirmPassword && (
              <p style={{ color: "#e94560", fontSize: 12, marginTop: 4 }}>{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              background: loading ? "#555" : "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
          >
            {loading ? (
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
                Đang xử lý...
              </>
            ) : (
              <>
                <KeyRound size={18} />
                Đặt lại mật khẩu
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link
            to="/login"
            style={{
              color: "#6b6b8e",
              fontSize: 13,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b8e")}
          >
            <ArrowLeft size={14} />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
