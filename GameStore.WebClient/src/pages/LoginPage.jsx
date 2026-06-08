// GameStore.WebClient/src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";
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
      if (!error) {
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
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      {/* ERROR MODAL */}
      {error && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              borderRadius: 16,
              padding: 40,
              width: 400,
              border: "2px solid #e94560",
              textAlign: "center",
            }}
          >
            <AlertCircle
              size={48}
              color="#e94560"
              style={{ marginBottom: 16 }}
            />
            <h2 style={{ color: "#fff", marginBottom: 8 }}>{t("auth.loginFailed")}</h2>
            <p style={{ color: "#e94560", marginBottom: 24, fontSize: 16 }}>
              {error}
            </p>
            <button
              onClick={() => setError("")}
              style={{
                padding: "12px 40px",
                background: "#e94560",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t("common.ok")}
            </button>
          </div>
        </div>
      )}

      {/* LOGIN FORM */}
      <div
        style={{
          background: "#16162a",
          borderRadius: 16,
          padding: 40,
          width: "100%",
          maxWidth: 420,
          border: "1px solid #2a2a4a",
        }}
      >
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
          <div style={{ marginBottom: 16, position: "relative" }}>
            <User
              size={18}
              color="#6b6b8e"
              style={{ position: "absolute", left: 14, top: 14 }}
            />
            <input
              placeholder={t("auth.username")}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
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
          <div style={{ marginBottom: 20, position: "relative" }}>
            <Lock
              size={18}
              color="#6b6b8e"
              style={{ position: "absolute", left: 14, top: 14 }}
            />
            <input
              type="password"
              placeholder={t("auth.password")}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            className="btn-primary"
            style={{ width: "100%", padding: 14, fontSize: 16 }}
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
