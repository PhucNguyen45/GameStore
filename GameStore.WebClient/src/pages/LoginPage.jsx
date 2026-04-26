import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch {
      setError("Invalid username or password");
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
            <LogIn size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Welcome Back</h1>
          <p style={{ color: "#6b6b8e", fontSize: 14, marginTop: 6 }}>
            Login to your GameStore account
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
          <div style={{ marginBottom: 16, position: "relative" }}>
            <User
              size={18}
              color="#6b6b8e"
              style={{ position: "absolute", left: 14, top: 14 }}
            />
            <input
              placeholder="Username"
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
              placeholder="Password"
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
            {loading ? "Logging in..." : "Login"}
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
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#e94560", fontWeight: 600 }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
