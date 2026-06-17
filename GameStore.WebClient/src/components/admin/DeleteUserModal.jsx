// GameStore.WebClient/src/components/admin/DeleteUserModal.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { adminAPI } from "../../services/api";

export default function DeleteUserModal({ user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteUser(user.id);
      toast.success(`Đã xóa người dùng "${user.username}"!`);
      onConfirm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: 400, textAlign: "center", borderColor: "#e94560" }} onClick={(e) => e.stopPropagation()}>
        <Trash2 size={40} color="#e94560" style={{ marginBottom: 12 }} />
        <h3 style={{ color: "#fff", marginBottom: 8 }}>Xóa người dùng?</h3>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
          Bạn có chắc muốn xóa người dùng{" "}
          <strong style={{ color: "#fff" }}>"{user.username}"</strong>?
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-danger btn-sm"
          >
            {deleting ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
