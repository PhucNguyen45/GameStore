import { useState } from "react";
import { Trash2 } from "lucide-react";
import { adminAPI } from "../../services/api";

export default function DeleteUserModal({ user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteUser(user.id);
      onConfirm();
    } catch (err) {
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={onClose}>
      <div style={{ background: "#111118", borderRadius: 12, padding: 30, width: 400, textAlign: "center", border: "1px solid #e94560" }} onClick={(e) => e.stopPropagation()}>
        <Trash2 size={40} color="#e94560" style={{ marginBottom: 12 }} />
        <h3 style={{ color: "#fff", marginBottom: 8 }}>Delete User?</h3>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
          Are you sure you want to delete user <strong style={{ color: "#fff" }}>"{user.username}"</strong>?
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onClose} style={{ padding: "8px 20px", background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleDelete} disabled={deleting} style={{ padding: "8px 20px", background: "#e94560", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
