import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserPlus, User, Lock, Mail, Phone, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    displayName: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            <UserPlus size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Create Account</h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginTop: 6 }}>
            Join the GameStore community
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
            {
              icon: User,
              placeholder: "Username *",
              value: form.username,
              key: "username",
            },
            {
              icon: Lock,
              placeholder: "Password *",
              value: form.password,
              key: "password",
              type: "password",
            },
            {
              icon: User,
              placeholder: "Display Name",
              value: form.displayName,
              key: "displayName",
            },
            {
              icon: Mail,
              placeholder: "Email",
              value: form.email,
              key: "email",
              type: "email",
            },
            {
              icon: Phone,
              placeholder: "Phone",
              value: form.phone,
              key: "phone",
            },
          ].map(({ icon: Icon, ...field }) => (
            <div
              key={field.key}
              style={{ marginBottom: 12, position: "relative" }}
            >
              <Icon
                size={18}
                color="#6b6b8e"
                style={{ position: "absolute", left: 14, top: 14 }}
              />
              <input
                {...field}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
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
                required={field.placeholder.includes("*")}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", padding: 14, fontSize: 16, marginTop: 8 }}
          >
            {loading ? "Creating account..." : "Register"}
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#e94560", fontWeight: 600 }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
