// GameStore.WebClient/src/components/admin/UsersTab.jsx
import { useState } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "./Pagination";
import { thStyle, sortFn, actionBtnStyle, filterInputStyle } from "./adminStyles";

export default function UsersTab({
  users,
  usersTotal,
  usersPage,
  setUsersPage,
  usersPageSize,
  setUsersPageSize,
  usersTotalPages,
  userSearch,
  setUserSearch,
  userSort,
  setUserSort,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="Tìm tên đăng nhập, tên, email..."
          value={userSearch.keyword}
          onChange={(e) => setUserSearch({ ...userSearch, keyword: e.target.value })}
          style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }}
        />
        <select
          value={userSearch.status}
          onChange={(e) => setUserSearch({ ...userSearch, status: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Bị khóa</option>
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#888", fontSize: 12 }}>
          Từ ngày:{" "}
          <input
            type="date"
            value={userSearch.fromDate}
            onChange={(e) => setUserSearch({ ...userSearch, fromDate: e.target.value })}
            style={filterInputStyle}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#888", fontSize: 12 }}>
          Đến ngày:{" "}
          <input
            type="date"
            value={userSearch.toDate}
            onChange={(e) => setUserSearch({ ...userSearch, toDate: e.target.value })}
            style={filterInputStyle}
          />
        </div>
        {(userSearch.keyword || userSearch.status || userSearch.fromDate || userSearch.toDate) && (
          <button
            onClick={() => setUserSearch({ keyword: "", status: "", fromDate: "", toDate: "" })}
            style={{ padding: "7px 12px", background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <X size={12} /> Xóa lọc
          </button>
        )}
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
            <SortableHeader field="id" sort={userSort} setSort={setUserSort}>
              #
            </SortableHeader>
            <SortableHeader
              field="username"
              sort={userSort}
              setSort={setUserSort}
            >
              Tên đăng nhập
            </SortableHeader>
            <SortableHeader
              field="displayName"
              sort={userSort}
              setSort={setUserSort}
            >
              Tên hiển thị
            </SortableHeader>
            <SortableHeader field="email" sort={userSort} setSort={setUserSort}>
              Email
            </SortableHeader>
            <SortableHeader
              field="wallet"
              sort={userSort}
              setSort={setUserSort}
            >
              Ví
            </SortableHeader>
            <th style={{ ...thStyle, cursor: "default" }}>Trạng thái</th>
            <SortableHeader
              field="createdAt"
              sort={userSort}
              setSort={setUserSort}
            >
              Ngày tham gia
            </SortableHeader>
            <th style={{ ...thStyle, textAlign: "right" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
              <td style={{ padding: "9px 14px", color: "#555" }}>#{u.id}</td>
              <td
                style={{ padding: "9px 14px", color: "#fff", fontWeight: 500 }}
              >
                {u.username}
              </td>
              <td style={{ padding: "9px 14px", color: "#ccc" }}>
                {u.displayName || "-"}
              </td>
              <td style={{ padding: "9px 14px", color: "#888" }}>
                {u.email || "-"}
              </td>
              <td
                style={{
                  padding: "9px 14px",
                  color: "#4caf50",
                  fontWeight: 600,
                }}
              >
                ${u.wallet?.toFixed(2) || "0.00"}
              </td>
              <td style={{ padding: "9px 14px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: u.isActive ? "#4caf50" : "#e94560",
                    }}
                  />
                  <span
                    style={{
                      color: u.isActive ? "#4caf50" : "#e94560",
                      fontSize: 11,
                    }}
                  >
                    {u.isActive ? "Hoạt động" : "Bị khóa"}
                  </span>
                </span>
              </td>
              <td style={{ padding: "9px 14px", color: "#888" }}>
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
              </td>
              <td style={{ padding: "9px 14px", textAlign: "right" }}>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    style={actionBtnStyle}
                    onClick={() => onEdit && onEdit(u)}
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={14} color="#3498db" />
                  </button>
                  <button
                    style={actionBtnStyle}
                    onClick={() => onDelete && onDelete(u)}
                    title="Xóa người dùng"
                  >
                    <Trash2 size={14} color="#e94560" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td
                colSpan="8"
                style={{ padding: 20, textAlign: "center", color: "#666" }}
              >
                Không tìm thấy người dùng
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        page={usersPage}
        totalPages={usersTotalPages}
        totalItems={usersTotal}
        pageSize={usersPageSize}
        setPage={setUsersPage}
        setPageSize={setUsersPageSize}
      />
    </div>
    </div>
  );
}
