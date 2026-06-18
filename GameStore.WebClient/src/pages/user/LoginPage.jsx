// GameStore.WebClient/src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";
import { BackButton } from "../../components/common";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!form.username.trim()) errors.username = t("auth.usernameRequired");
    if (!form.password) errors.password = t("auth.passwordRequired");
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const data = await login(form.username, form.password);
      if (data.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      const status = err?.response?.status;
      if (status === 403 && serverMsg) {
        setError(serverMsg);
      } else {
        setError(t("auth.invalidCredentials"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "70vh",
        paddingTop: 40,
      }}
    >
      {/* ERROR MODAL */}
      {error && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: 400, textAlign: "center", border: "2px solid #e94560" }}>
            <AlertCircle size={48} color="#e94560" style={{ marginBottom: 16 }} />
            <h2 style={{ color: "#fff", marginBottom: 8 }}>{t("auth.loginFailed")}</h2>
            <p style={{ color: "#e94560", marginBottom: 24, fontSize: 16 }}>
              {error}
            </p>
            <button
              onClick={() => setError("")}
              className="btn btn-danger btn-lg"
            >
              {t("common.ok")}
            </button>
          </div>
        </div>
      )}

      {/* LOGIN FORM */}
      <div
        className="card"
        style={{ padding: 40, maxWidth: 420, width: "100%" }}
      >
        <BackButton fallback="/store" label="Cửa hàng" />
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #e94560, #c23152)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <LogIn size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("auth.loginTitle")}</h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginTop: 6 }}>
            {t("auth.loginSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-icon" style={{ marginBottom: 16 }}>
            <User size={18} className="icon" />
            <input className="input" placeholder={t("auth.username")} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="input-icon" style={{ marginBottom: 20 }}>
            <Lock size={18} className="icon" />
            <input className="input" type="password" placeholder={t("auth.password")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
          >
            {loading ? t("auth.loggingIn") : t("auth.login")}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link
            to="/forgot-password"
            style={{ color: "#6b6b8e", fontSize: 12, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#4fc3f7")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b8e")}
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "#6b6b8e",
            fontSize: 13,
          }}
        >
          {t("auth.noAccount")}{" "}
          <Link to="/register" style={{ color: "#e94560", fontWeight: 600 }}>
            {t("auth.registerNow")}
          </Link>
        </p>
      </div>
    </div>
  );
}
