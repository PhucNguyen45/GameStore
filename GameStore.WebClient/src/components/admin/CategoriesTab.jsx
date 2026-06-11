// GameStore.WebClient/src/components/admin/CategoriesTab.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2, X, Tag } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "../common/Pagination";
import { thStyle, filterInputStyle } from "./adminStyles";
import { adminAPI } from "../../services/api";

function CategoryModal({ category, onClose, onSave }) {
  const { t } = useTranslation();
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
      toast.success(category ? t("admin.categoryUpdated") : t("admin.categoryCreated"));
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const iStyle = { ...filterInputStyle, width: "100%" };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#111118",
          borderRadius: 12,
          padding: 30,
          width: 450,
          border: "1px solid #1a1a2e",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: 20,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {category ? `✏️ ${t("admin.editCategory")}` : `➕ ${t("admin.addCategoryTitle")}`}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder={`${t("admin.nameColumn")} *`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={iStyle}
            required
          />
          <textarea
            placeholder={t("admin.description")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...iStyle, minHeight: 60, resize: "vertical" }}
          />
          <input
            placeholder={t("admin.iconUrl")}
            value={form.iconUrl}
            onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
            style={iStyle}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#ccc",
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            {t("admin.isActive")}
          </label>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 20px",
                background: "#2a2a2a",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "8px 20px",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {saving ? t("admin.saving") : category ? t("admin.update") : t("admin.createNew")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriesTab() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({ keyword: "", status: "", hasGames: "" });
  const [sort, setSort] = useState({ field: "name", dir: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      const params = { page, pageSize, sortBy: sort.field, desc: sort.dir === "desc" };
      if (search.keyword) params.keyword = search.keyword;
      if (search.status) params.status = search.status;
      if (search.hasGames !== "") params.hasGames = search.hasGames === "yes";
      const res = await adminAPI.getCategories(params);
      setCategories(res.data.data || []);
      setTotal(res.data.totalCount || 0);
    } catch {
      setCategories([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, pageSize, sort]);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [page, pageSize, search, sort]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminAPI.deleteCategory(deleteTarget.id);
      toast.success(t("admin.categoryDeleted", { name: deleteTarget.name }));
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        <input
          placeholder={t("admin.searchCategories")}
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }}
        />
        <select
          value={search.status}
          onChange={(e) => setSearch({ ...search, status: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">{t("admin.allStatuses")}</option>
          <option value="active">{t("admin.active")}</option>
          <option value="inactive">{t("admin.inactive")}</option>
        </select>
        <select
          value={search.hasGames}
          onChange={(e) => setSearch({ ...search, hasGames: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">{t("admin.all")}</option>
          <option value="yes">{t("admin.hasGames")}</option>
          <option value="no">{t("admin.noGames")}</option>
        </select>
        {(search.keyword || search.status || search.hasGames !== "") && (
          <button
            onClick={() => setSearch({ keyword: "", status: "", hasGames: "" })}
            style={{
              padding: "7px 12px",
              background: "#2a2a2a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <X size={12} /> {t("admin.clearFilter")}
          </button>
        )}
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 16px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <Plus size={14} /> {t("admin.addCategory")}
        </button>
      </div>
      <div
        style={{
          background: "#111118",
          borderRadius: 8,
          border: "1px solid #1a1a2e",
          overflow: "hidden",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
        >
          <thead>
            <tr style={{ background: "#0a0a10" }}>
              <SortableHeader field="id" sort={sort} setSort={setSort}>
                #
              </SortableHeader>
              <SortableHeader field="name" sort={sort} setSort={setSort}>
                {t("admin.nameColumn")}
              </SortableHeader>
              <SortableHeader field="description" sort={sort} setSort={setSort}>
                {t("admin.description")}
              </SortableHeader>
              <SortableHeader field="gameCount" sort={sort} setSort={setSort}>
                {t("admin.gameCount")}
              </SortableHeader>
              <th style={{ ...thStyle, cursor: "default" }}>{t("admin.status")}</th>
              <th style={{ ...thStyle, cursor: "default" }}></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "9px 14px", color: "#555" }}>
                  #{cat.id}
                </td>
                <td style={{ padding: "9px 14px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Tag size={12} color="var(--accent)" />
                    <span style={{ color: "#fff", fontWeight: 500 }}>
                      {cat.name}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "9px 14px",
                    color: "#888",
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.description || "-"}
                </td>
                <td
                  style={{
                    padding: "9px 14px",
                    color: "#4caf50",
                    fontWeight: 600,
                  }}
                >
                  {cat.gameCount}
                </td>
                <td style={{ padding: "9px 14px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: cat.isActive ? "#4caf50" : "#e94560",
                      }}
                    />
                    <span
                      style={{
                        color: cat.isActive ? "#4caf50" : "#e94560",
                        fontSize: 11,
                      }}
                    >
                      {cat.isActive ? t("admin.active") : t("admin.inactive")}
                    </span>
                  </span>
                </td>
                <td style={{ padding: "9px 14px", display: "flex", gap: 5 }}>
                  <button
                    onClick={() => {
                      setEditing(cat);
                      setShowModal(true);
                    }}
                    style={{
                      padding: "4px 7px",
                      background: "#1a1a2e",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    <Edit size={11} color="#0078f2" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    style={{
                      padding: "4px 7px",
                      background: "#1a1a2e",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={11} color="#e94560" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{ padding: 20, textAlign: "center", color: "#666" }}
                >
                  {t("admin.noCategories")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </div>
      {showModal && (
        <CategoryModal
          category={editing}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSave={() => {
            setShowModal(false);
            setEditing(null);
            load();
          }}
        />
      )}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#111118", borderRadius: 12, padding: 28, width: 360, textAlign: "center", border: "1px solid #e94560" }} onClick={(e) => e.stopPropagation()}>
            <Trash2 size={36} color="#e94560" style={{ marginBottom: 10 }} />
            <h3 style={{ color: "#fff", marginBottom: 8, fontSize: 15 }}>{t("admin.deleteCategory")}</h3>              <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
                {t("admin.confirmDeleteCategory", { name: deleteTarget.name })}
              </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} style={{ padding: "8px 20px", background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>{t("common.cancel")}</button>
              <button onClick={handleDelete} style={{ padding: "8px 20px", background: "#e94560", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>{t("admin.confirmDelete")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
