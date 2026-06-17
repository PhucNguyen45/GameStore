// GameStore.WebClient/src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, Send, CheckCircle, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t("forgotPassword.emailInvalid"));
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.forgotPassword(email);
      setSent(true);
      setResetToken(data.resetToken || "");
      toast.success(data.message || t("forgotPassword.success"));
    } catch (err) {
      toast.error(err.response?.data?.message || t("forgotPassword.error"));
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(resetToken);
    toast.success(t("forgotPassword.tokenCopied"));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        paddingTop: 40,
      }}
    >
      <div
        className="card"
        style={{ padding: 40, maxWidth: 440 }}
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
            {sent ? t("forgotPassword.titleSent") : t("forgotPassword.title")}
          </h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
            {sent
              ? t("forgotPassword.descriptionSent")
              : t("forgotPassword.description")}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="input-icon" style={{ marginBottom: 20 }}>
              <Mail size={18} className="icon" />
              <input className="input" type="email" placeholder={t("forgotPassword.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ padding: 14, fontSize: 15 }}
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
                  {t("forgotPassword.sending")}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t("forgotPassword.sendRequest")}
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
                  {t("forgotPassword.devEnvironment")}
                </p>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                  {t("forgotPassword.yourToken")}
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
                    title={t("forgotPassword.copyToken")}
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <Link
                  to={`/reset-password?token=${resetToken}`}
                  className="btn btn-primary btn-block"
                  style={{ marginTop: 12, padding: 10, textDecoration: "none" }}
                >
                  {t("forgotPassword.resetNow")}
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
            {t("forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
