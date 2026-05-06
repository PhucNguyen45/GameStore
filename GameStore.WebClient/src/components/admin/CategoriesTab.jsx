// GameStore.WebClient/src/components/admin/CategoriesTab.jsx
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Tag } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "./Pagination";
import { thStyle, sortFn, filterInputStyle } from "./adminStyles";
import { adminAPI } from "../../services/api";

function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    iconUrl: category?.iconUrl || "",
    isActive: category?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (category) await adminAPI.updateCategory(category.id, form);
      else await adminAPI.createCategory(form);
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const iStyle = { ...filterInputStyle, width: "100%" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={onClose}>
      <div style={{ background: "#111118", borderRadius: 12, padding: 30, width: 450, border: "1px solid #1a1a2e" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: "#fff", marginBottom: 20, fontSize: 16, fontWeight: 700 }}>
          {category ? "✏️ Edit Category" : "➕ New Category"}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={iStyle} required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...iStyle, minHeight: 60, resize: "vertical" }} />
          <input placeholder="Icon URL (optional)" value={form.iconUrl} onChange={(e) => setForm({ ...form, iconUrl: e.target.value })} style={iStyle} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 13 }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 20px", background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: "8px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
              {saving ? "Saving..." : category ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({ keyword: "", status: "" });
  const [sort, setSort] = useState({ field: "name", dir: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const params = { page, pageSize };
      if (search.keyword) params.keyword = search.keyword;
      if (search.status) params.status = search.status;
      const res = await adminAPI.getCategories(params);
      setCategories(res.data.data || []);
      setTotal(res.data.totalCount || 0);
    } catch { setCategories([]); setTotal(0); }
  };

  useEffect(() => { setPage(1); }, [search, pageSize]);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [page, pageSize, search]);

  const handleDelete = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await adminAPI.deleteCategory(cat.id);
      load();
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };

  const sorted = sortFn(categories, sort.field, sort.dir);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input placeholder="Search categories..." value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }} />
        <select value={search.status} onChange={(e) => setSearch({ ...search, status: e.target.value })} style={filterInputStyle}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(search.keyword || search.status) && (
          <button onClick={() => setSearch({ keyword: "", status: "" })} style={{ padding: "7px 12px", background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <X size={12} /> Clear
          </button>
        )}
        <button onClick={() => { setEditing(null); setShowModal(true); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>
          <Plus size={14} /> Add Category
        </button>
      </div>
      <div style={{ background: "#111118", borderRadius: 8, border: "1px solid #1a1a2e", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0a0a10" }}>
              <SortableHeader field="id" sort={sort} setSort={setSort}>#</SortableHeader>
              <SortableHeader field="name" sort={sort} setSort={setSort}>Name</SortableHeader>
              <SortableHeader field="description" sort={sort} setSort={setSort}>Description</SortableHeader>
              <SortableHeader field="gameCount" sort={sort} setSort={setSort}>Games</SortableHeader>
              <th style={{ ...thStyle, cursor: "default" }}>Status</th>
              <th style={{ ...thStyle, cursor: "default" }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "9px 14px", color: "#555" }}>#{cat.id}</td>
                <td style={{ padding: "9px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Tag size={12} color="var(--accent)" />
                    <span style={{ color: "#fff", fontWeight: 500 }}>{cat.name}</span>
                  </div>
                </td>
                <td style={{ padding: "9px 14px", color: "#888", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.description || "-"}</td>
                <td style={{ padding: "9px 14px", color: "#4caf50", fontWeight: 600 }}>{cat.gameCount}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: cat.isActive ? "#4caf50" : "#e94560" }} />
                    <span style={{ color: cat.isActive ? "#4caf50" : "#e94560", fontSize: 11 }}>{cat.isActive ? "Active" : "Inactive"}</span>
                  </span>
                </td>
                <td style={{ padding: "9px 14px", display: "flex", gap: 5 }}>
                  <button onClick={() => { setEditing(cat); setShowModal(true); }} style={{ padding: "4px 7px", background: "#1a1a2e", border: "none", borderRadius: 4, cursor: "pointer" }}>
                    <Edit size={11} color="#0078f2" />
                  </button>
                  <button onClick={() => handleDelete(cat)} style={{ padding: "4px 7px", background: "#1a1a2e", border: "none", borderRadius: 4, cursor: "pointer" }}>
                    <Trash2 size={11} color="#e94560" />
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan="6" style={{ padding: 20, textAlign: "center", color: "#666" }}>No categories found</td></tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} totalItems={total} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} />
      </div>
      {showModal && (
        <CategoryModal
          category={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={() => { setShowModal(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}
