// GameStore.WebClient/src/components/admin/UserFormModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";

// Modal chỉnh sửa thông tin người dùng (admin không tạo user mới, chỉ sửa)
// Props: user = object user cần sửa, onSave(form) được gọi khi submit
export default function UserFormModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    avatarUrl: "",
    wallet: 0,
    isActive: true,
  });

  // Điền dữ liệu của user vào form mỗi khi prop user thay đổi
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

  // Ví dụ validation (đang comment để bạn bật sau):
  // const validateUserForm = (data) => {
  //   if (!data.displayName.trim()) return "Tên hiển thị không được để trống.";
  //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Email không hợp lệ.";
  //   if (data.phone && !/^[0-9]{9,11}$/.test(data.phone.replace(/\s+/g, "")))
  //     return "Số điện thoại không hợp lệ.";
  //   if (data.wallet < 0) return "Số dư ví không được âm.";
  //   return "";
  // };

  // Chuyển dữ liệu form lên component cha xử lý (không tự gọi API)
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (const error = validateUserForm(form)) {
    //   toast.error(error);
    //   return;
    // }
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
            <label style={labelStyle}>Số dư ví (VNĐ)</label>
            <input
              type="number"
              step="1"
              min="0"
              style={inputStyle}
              value={form.wallet}
              onChange={(e) =>
                setForm({ ...form, wallet: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <div>
            <label style={labelStyle}>URL ảnh đại diện</label>
            <input
              placeholder="https://..."
              value={form.avatarUrl}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
              style={inputStyle}
            />
          </div>
          {form.avatarUrl && (
            <div
              style={{
                marginTop: -8,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <img
                src={form.avatarUrl}
                alt="Preview"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #2a2a35",
                  background: "#111",
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/72x72?text=?";
                }}
              />
              <span style={{ color: "#666", fontSize: 11 }}>
                Preview ảnh đại diện
              </span>
            </div>
          )}

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
            <button type="submit" className="btn btn-primary btn-sm">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
