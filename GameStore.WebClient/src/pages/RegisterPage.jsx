// GameStore.WebClient/src/pages/RegisterPage.jsx
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserPlus, User, Lock, Mail, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0[35789][0-9]{8}$/;

export default function RegisterPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    username: "",
    password: "",
    displayName: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateField = useCallback((field, value) => {
    switch (field) {
      case "username":
        if (!value.trim()) return "Vui lòng nhập tên đăng nhập";
        if (value.trim().length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự";
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới";
        return "";
      case "password":
        if (!value) return "Vui lòng nhập mật khẩu";
        if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
        return "";
      case "displayName":
        return ""; // optional
      case "email":
        if (!value.trim()) return ""; // optional
        if (!EMAIL_REGEX.test(value)) return "Email không hợp lệ";
        return "";
      case "phone":
        if (!value.trim()) return ""; // optional
        if (!PHONE_REGEX.test(value)) return "Số điện thoại không hợp lệ (VD: 0912345678)";
        return "";
      default:
        return "";
    }
  }, []);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form[field]) }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched({ username: true, password: true, displayName: true, email: true, phone: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const hasError = (field) => touched[field] && errors[field];
  const isValid = (field) => touched[field] && !errors[field] && form[field].length > 0;
  const borderColor = (field) =>
    hasError(field) ? "#e94560" : isValid(field) ? "#4caf50" : "#2a2a4a";

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
        style={{ padding: 40, maxWidth: 460 }}
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
            <UserPlus size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("auth.registerTitle")}</h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginTop: 6 }}>
            {t("auth.registerSubtitle")}
          </p>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 12,
              background: "rgba(233,69,96,0.1)",
              borderRadius: 8,
              marginBottom: 20,
              border: "1px solid rgba(233,69,96,0.3)",
            }}
          >
            <AlertCircle size={18} color="#e94560" />
            <span style={{ color: "#e94560", fontSize: 13 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { icon: User, placeholder: t("auth.usernamePlaceholder"), key: "username", required: true },
            { icon: Lock, placeholder: t("auth.passwordPlaceholder"), key: "password", type: "password", required: true },
            { icon: User, placeholder: t("auth.displayName"), key: "displayName" },
            { icon: Mail, placeholder: t("auth.email"), key: "email", type: "email" },
            { icon: Phone, placeholder: t("auth.phone"), key: "phone" },
          ].map(({ icon: Icon, key, placeholder, type, required }) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <div className="input-icon">
                <Icon size={18} className="icon" />
                <input
                  className={`input ${hasError(key) ? 'input-error' : isValid(key) ? 'input-success' : ''}`}
                  type={type || "text"}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  onBlur={() => handleBlur(key)}
                  required={required}
                />
                {isValid(key) && <CheckCircle2 size={16} color="#4caf50" className="icon-right" />}
                {hasError(key) && <AlertCircle size={16} color="#e94560" className="icon-right" />}
              </div>
              <div style={{ minHeight: 20, marginTop: 4 }}>
                {hasError(key) && (
                  <p style={{ color: "#e94560", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    <AlertCircle size={11} /> {errors[key]}
                  </p>
                )}
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{ marginTop: 8, padding: 14, fontSize: 15 }}
          >
            {loading ? t("auth.creatingAccount") : t("auth.register")}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "#6b6b8e",
            fontSize: 13,
          }}
        >
          {t("auth.haveAccount")}{" "}
          <Link to="/login" style={{ color: "#e94560", fontWeight: 600 }}>
            {t("auth.loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
