// GameStore.WebClient/src/components/admin/UsersTab.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, X, Shield } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "../common/Pagination";
import { thStyle, actionBtnStyle, filterInputStyle } from "./adminStyles";
import { formatVND } from "../../utils/format";

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
  const { t } = useTranslation();
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder={t("admin.searchUsers")}
          value={userSearch.keyword}
          onChange={(e) => setUserSearch({ ...userSearch, keyword: e.target.value })}
          style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }}
        />
        <select
          value={userSearch.status}
          onChange={(e) => setUserSearch({ ...userSearch, status: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">{t("admin.allStatuses")}</option>
          <option value="active">{t("admin.active")}</option>
          <option value="locked">{t("admin.locked")}</option>
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#888", fontSize: 12 }}>
          {t("admin.fromDate")}:{" "}
          <input
            type="date"
            value={userSearch.fromDate}
            onChange={(e) => setUserSearch({ ...userSearch, fromDate: e.target.value })}
            style={filterInputStyle}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#888", fontSize: 12 }}>
          {t("admin.toDate")}:{" "}
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
            <X size={12} /> {t("admin.clearFilter")}
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
            >                {t("admin.username")}
              </SortableHeader>
            <SortableHeader
              field="displayName"
              sort={userSort}
              setSort={setUserSort}
            >                {t("admin.displayName")}
              </SortableHeader>
            <SortableHeader field="email" sort={userSort} setSort={setUserSort}>
              Email
            </SortableHeader>
            <SortableHeader
              field="wallet"
              sort={userSort}
              setSort={setUserSort}
            >                {t("admin.wallet")}
              </SortableHeader>
            <th style={{ ...thStyle, cursor: "default" }}>Role</th>
            <th style={{ ...thStyle, cursor: "default" }}>{t("admin.status")}</th>
            <SortableHeader
              field="createdAt"
              sort={userSort}
              setSort={setUserSort}
            >                {t("admin.joinDate")}
              </SortableHeader>
            <th style={{ ...thStyle, textAlign: "right" }}>{t("admin.actions")}</th>
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
                {formatVND(u.wallet || 0)}
              </td>
              <td style={{ padding: "9px 14px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {(u.roles || ["User"]).map((roleName) => (
                    <span
                      key={roleName}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 3,
                        background: roleName === "Admin" ? "#3a1020" : "#0a1a2e",
                        color: roleName === "Admin" ? "#e94560" : "#4fc3f7",
                        padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                      }}
                    >
                      <Shield size={8} />
                      {roleName}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ padding: "9px 14px" }}>
                <span className={`status-dot ${u.isActive ? 'active' : 'locked'}`}>
                  {u.isActive ? t("admin.active") : t("admin.locked")}
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
                    onClick={() => onEdit && onEdit(u)}                            title={t("admin.edit")}
                  >
                    <Edit2 size={14} color="#3498db" />
                  </button>
                  <button
                    style={actionBtnStyle}
                    onClick={() => onDelete && onDelete(u)}                            title={t("admin.deleteUser")}
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
                colSpan="9"
                style={{ padding: 20, textAlign: "center", color: "#666" }}
              >                  {t("admin.noUsers")}
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
