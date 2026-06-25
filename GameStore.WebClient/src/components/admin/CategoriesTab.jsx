// GameStore.WebClient/src/components/admin/CategoriesTab.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, X, Tag } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "../common/Pagination";
import { thStyle, filterInputStyle } from "./adminStyles";
import { adminAPI, genreAPI } from "../../services/api";

// Modal dùng chung để tạo mới hoặc chỉnh sửa danh mục (category/genre)
// Nếu truyền prop `category` vào → chế độ chỉnh sửa; không truyền → chế độ tạo mới
function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    iconUrl: category?.iconUrl || "",
    isActive: category?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  // Ví dụ validation (đang comment để bạn bật sau):
  // const validateCategoryForm = (data) => {
  //   if (!data.name.trim()) return "Tên danh mục không được để trống.";
  //   if (data.iconUrl && !/^https?:\/\//i.test(data.iconUrl))
  //     return "URL icon phải bắt đầu bằng http:// hoặc https://.";
  //   return "";
  // };

  // Gửi form lên API: cập nhật nếu có category.id, tạo mới nếu không
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // const error = validateCategoryForm(form);
      // if (error) {
      //   toast.error(error);
      //   setSaving(false);
      //   return;
      // }
      if (category) await adminAPI.updateCategory(category.id, form);
      else await adminAPI.createCategory(form);
      toast.success(
        category ? "Cập nhật danh mục thành công!" : "Tạo danh mục thành công!",
      );
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
          {category ? "✏️ Chỉnh sửa danh mục" : "➕ Thêm danh mục"}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder="Tên *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={iStyle}
            required
          />
          <textarea
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...iStyle, minHeight: 60, resize: "vertical" }}
          />
          <input
            placeholder="URL icon (tùy chọn)"
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
            Đang hoạt động
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
              Hủy
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
              {saving ? "Đang lưu..." : category ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Tab quản lý danh mục game trong trang Admin
export default function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalGenres, setTotalGenres] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({
    keyword: "",
    status: "",
    hasGames: "",
  });
  const [sort, setSort] = useState({ field: "name", dir: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // danh mục đang được chỉnh sửa (null = đang tạo mới)
  const [deleteTarget, setDeleteTarget] = useState(null); // danh mục được chọn để xóa

  // Gọi API lấy danh sách danh mục với filter/sort/phân trang hiện tại
  const load = async () => {
    try {
      const params = {
        page,
        pageSize,
        sortBy: sort.field,
        desc: sort.dir === "desc",
      };
      if (search.keyword) params.keyword = search.keyword;
      if (search.status) params.status = search.status;
      if (search.hasGames !== "") params.hasGames = search.hasGames === "yes";
      const res = await adminAPI.getCategories(params);
      setCategories(res.data.data || []);
      setTotal(res.data.totalCount || 0);
    } catch (err) {
      console.error("[CategoriesTab] load error:", err);
      setCategories([]);
      setTotal(0);
    }
  };

  const loadTotalGenres = async () => {
    try {
      const res = await genreAPI.getTotal();
      setTotalGenres(res.data?.total ?? 0);
    } catch (err) {
      console.error("[CategoriesTab] loadTotalGenres error:", err);
      setTotalGenres(0);
    }
  };

  // Reset về trang 1 mỗi khi thay đổi bộ lọc, cỡ trang hoặc sắp xếp
  useEffect(() => {
    setPage(1);
  }, [search, pageSize, sort]);
  // Debounce 300ms trước khi gọi load, tránh gọi API liên tục khi đang gõ
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [page, pageSize, search, sort]);

  useEffect(() => {
    loadTotalGenres();
  }, []);

  // Gọi API xóa danh mục được chọn, rồi tải lại danh sách
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminAPI.deleteCategory(deleteTarget.id);
      toast.success(`Đã xóa danh mục "${deleteTarget.name}"!`);
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
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 10px",
            background: "#0a0a10",
            border: "1px solid #1a1a2e",
            borderRadius: 6,
            color: "#ccc",
            fontSize: 12,
          }}
        >
          <Tag size={12} color="#4caf50" />
          <span>Tổng danh mục: {totalGenres}</span>
        </div> */}
        <input
          placeholder="Tìm danh mục..."
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }}
        />
        <select
          value={search.status}
          onChange={(e) => setSearch({ ...search, status: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
        <select
          value={search.hasGames}
          onChange={(e) => setSearch({ ...search, hasGames: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">Tất cả</option>
          <option value="yes">Có game</option>
          <option value="no">Chưa có game</option>
        </select>
        {(search.keyword || search.status || search.hasGames) && (
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
            <X size={12} /> Xóa lọc
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
          <Plus size={14} /> Thêm danh mục
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
                Tên
              </SortableHeader>
              <SortableHeader field="description" sort={sort} setSort={setSort}>
                Mô tả
              </SortableHeader>
              <SortableHeader field="gameCount" sort={sort} setSort={setSort}>
                Số game
              </SortableHeader>
              <th style={{ ...thStyle, cursor: "default" }}>Trạng thái</th>
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
                      {cat.isActive ? "Hoạt động" : "Không hoạt động"}
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
                  Không tìm thấy danh mục
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
          onClick={() => setDeleteTarget(null)}
        >
          <div
            style={{
              background: "#111118",
              borderRadius: 12,
              padding: 28,
              width: 360,
              textAlign: "center",
              border: "1px solid #e94560",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 size={36} color="#e94560" style={{ marginBottom: 10 }} />
            <h3 style={{ color: "#fff", marginBottom: 8, fontSize: 15 }}>
              Xóa danh mục?
            </h3>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
              Bạn có chắc muốn xóa{" "}
              <strong style={{ color: "#fff" }}>"{deleteTarget.name}"</strong>?
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: "8px 20px",
                  background: "#2a2a2a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "8px 20px",
                  background: "#e94560",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
