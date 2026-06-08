// GameStore.WebClient/src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, Send, CheckCircle, Copy } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email không hợp lệ", {
        style: { background: "#16162a", color: "#fff", border: "1px solid #2a2a4a" },
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.forgotPassword(email);
      setSent(true);
      setResetToken(data.resetToken || "");
      toast.success(data.message || "Yêu cầu đặt lại mật khẩu đã được gửi!", {
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

  const copyToken = () => {
    navigator.clipboard.writeText(resetToken);
    toast.success("Đã sao chép token!", {
      style: { background: "#16162a", color: "#fff", border: "1px solid #2a2a4a" },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
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
            {sent ? (
              <CheckCircle size={28} color="#fff" />
            ) : (
              <Mail size={28} color="#fff" />
            )}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>
            {sent ? "Đã gửi yêu cầu" : "Quên mật khẩu"}
          </h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
            {sent
              ? "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu."
              : "Nhập email đã đăng ký để nhận link đặt lại mật khẩu."}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20, position: "relative" }}>
              <Mail
                size={18}
                color="#6b6b8e"
                style={{ position: "absolute", left: 14, top: 14 }}
              />
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 42px",
                  background: "#0a0a15",
                  border: "1px solid #2a2a4a",
                  borderRadius: 10,
                  color: "#e0e0e0",
                  fontSize: 14,
                  outline: "none",
                }}
                required
              />
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
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Gửi yêu cầu
                </>
              )}
            </button>
          </form>
        ) : (
          <div>
            {/* Dev mode: show reset token */}
            {resetToken && (
              <div
                style={{
                  background: "#0a0a15",
                  borderRadius: 10,
                  padding: 16,
                  border: "1px solid #2a2a4a",
                  marginBottom: 20,
                }}
              >
                <p style={{ fontSize: 12, color: "#ffc107", fontWeight: 600, marginBottom: 8 }}>
                  ⚠️ Môi trường phát triển
                </p>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                  Token đặt lại mật khẩu của bạn:
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#121212",
                    borderRadius: 6,
                    padding: "8px 12px",
                  }}
                >
                  <code
                    style={{
                      flex: 1,
                      fontSize: 11,
                      color: "#4fc3f7",
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                    }}
                  >
                    {resetToken}
                  </code>
                  <button
                    onClick={copyToken}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#888",
                      cursor: "pointer",
                      padding: 4,
                      flexShrink: 0,
                    }}
                    title="Sao chép token"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <Link
                  to={`/reset-password?token=${resetToken}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 12,
                    padding: "10px",
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Đặt lại mật khẩu ngay
                </Link>
              </div>
            )}
          </div>
        )}

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
