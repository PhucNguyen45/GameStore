// GameStore.WebClient/src/components/admin/UserFormModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function UserFormModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    avatarUrl: "",
    wallet: 0,
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || "",
        email: user.email || "",
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || "",
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
    width: "100%",
    padding: "10px 14px",
    background: "#111118",
    border: "1px solid #2a2a35",
    borderRadius: 6,
    color: "#fff",
    fontSize: 13,
    marginBottom: 16,
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    color: "#888",
    fontSize: 12,
    fontWeight: 500,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: 450 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 18, margin: 0, color: "#fff" }}>
            Chỉnh sửa: {user?.username}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Tên hiển thị</label>
            <input
              style={inputStyle}
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
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
            <label style={labelStyle}>Số điện thoại</label>
            <input
              type="tel"
              style={inputStyle}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Nhập số điện thoại..."
            />
          </div>

          <div>
            <label style={labelStyle}>Số dư ví ($)</label>
            <input
              type="number"
              step="0.01"
              style={inputStyle}
              value={form.wallet}
              onChange={(e) =>
                setForm({ ...form, wallet: parseFloat(e.target.value) || 0 })
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              style={{ accentColor: "#4caf50", width: 16, height: 16 }}
            />
            <label
              htmlFor="isActive"
              style={{ color: "#ccc", fontSize: 13, cursor: "pointer" }}
            >
              Đang hoạt động (Bỏ chọn để khóa)
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
