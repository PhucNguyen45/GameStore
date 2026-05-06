import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function UserFormModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    wallet: 0,
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || "",
        email: user.email || "",
        wallet: user.wallet || 0,
        isActive: user.isActive ?? true,
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "#111118", border: "1px solid #2a2a35",
    borderRadius: 6, color: "#fff", fontSize: 13,
    marginBottom: 16, outline: "none",
  };

  const labelStyle = {
    display: "block", marginBottom: 6,
    color: "#888", fontSize: 12, fontWeight: 500,
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "#111118", borderRadius: 12, padding: 30, width: 450, maxHeight: "90vh", overflow: "auto", border: "1px solid #1a1a2e" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, margin: 0, color: "#fff" }}>
            Edit User: {user?.username}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Display Name</label>
            <input
              style={inputStyle}
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label style={labelStyle}>Wallet Balance ($)</label>
            <input
              type="number"
              step="0.01"
              style={inputStyle}
              value={form.wallet}
              onChange={(e) => setForm({ ...form, wallet: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              style={{ accentColor: "#4caf50", width: 16, height: 16 }}
            />
            <label htmlFor="isActive" style={{ color: "#ccc", fontSize: 13, cursor: "pointer" }}>
              Active (Uncheck to Ban)
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px", background: "transparent",
                border: "1px solid #333", color: "#ccc", borderRadius: 6, cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "10px 20px", borderRadius: 6 }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
