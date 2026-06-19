// GameStore.WebClient/src/pages/ResetPasswordPage.jsx
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, CheckCircle, KeyRound } from "lucide-react";
import { BackButton } from "../../components/common";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
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
    if (!form.token.trim()) errs.token = t("resetPassword.tokenRequired");
    if (!form.newPassword) errs.newPassword = t("resetPassword.newPasswordRequired");
    else if (form.newPassword.length < 6)
      errs.newPassword = t("resetPassword.newPasswordMin");
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = t("resetPassword.confirmPasswordNoMatch");
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
      toast.success(t("resetPassword.success"));
    } catch (err) {
      const message = err.response?.data?.message || t("resetPassword.error");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", paddingTop: 40 }}>
      <div
        className="card"
        style={{ padding: 40, maxWidth: 440, textAlign: "center" }}
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
            {t("resetPassword.titleSuccess")}
          </h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            {t("resetPassword.descriptionSuccess")}
          </p>
          <Link
            to="/login"
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            {t("resetPassword.login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "70vh", paddingTop: 40 }}>
      <div
        className="card"
        style={{ padding: 40, maxWidth: 440, width: "100%" }}
      >
        <BackButton fallback="/login" label={t("resetPassword.backToLogin")} />
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
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{t("resetPassword.title")}</h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginTop: 8 }}>
            {t("resetPassword.description")}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Token */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">{t("resetPassword.tokenLabel")}</label>
            <div className="input-icon">
              <KeyRound size={16} className="icon" />
              <input
                className={`input ${errors.token ? 'input-error' : ''}`}
                value={form.token}
                onChange={(e) => setForm({ ...form, token: e.target.value })}
                placeholder={t("resetPassword.tokenPlaceholder")}
                style={{ fontFamily: "monospace", fontSize: 13 }}
              />
            </div>
            <div style={{ minHeight: 20, marginTop: 4 }}>
              {errors.token && <p style={{ color: "#e94560", fontSize: 12 }}>{errors.token}</p>}
            </div>
          </div>

          {/* New Password */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">{t("resetPassword.newPasswordLabel")}</label>
            <div style={{ position: "relative" }}>
              <div className="input-icon">
                <Lock size={16} className="icon" />
                <input
                  className={`input ${errors.newPassword ? 'input-error' : ''}`}
                  type={showPassword ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder={t("resetPassword.newPasswordPlaceholder")}
                  style={{ paddingRight: 42 }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 12, top: 12,
                  background: "none", border: "none", color: "#6b6b8e",
                  cursor: "pointer", padding: 2,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ minHeight: 20, marginTop: 4 }}>
              {errors.newPassword && <p style={{ color: "#e94560", fontSize: 12 }}>{errors.newPassword}</p>}
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 24 }}>
            <label className="form-label">{t("resetPassword.confirmPasswordLabel")}</label>
            <div className="input-icon">
              <CheckCircle size={16} className="icon" />
              <input
                className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder={t("resetPassword.confirmPasswordPlaceholder")}
              />
            </div>
            <div style={{ minHeight: 20, marginTop: 4 }}>
              {errors.confirmPassword && <p style={{ color: "#e94560", fontSize: 12 }}>{errors.confirmPassword}</p>}
            </div>
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
                {t("resetPassword.processing")}
              </>
            ) : (
              <>
                <KeyRound size={18} />
                {t("resetPassword.submit")}
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
