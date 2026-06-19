// GameStore.WebClient/src/components/admin/StaffRolesTab.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Shield,
  UserPlus,
  UserMinus,
} from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "../common/Pagination";
import { thStyle, filterInputStyle } from "./adminStyles";
import { adminAPI } from "../../services/api";

function RoleModal({ role, onClose, onSave }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: role?.name || "",
    description: role?.description || "",
    isActive: role?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  // Ví dụ validation (đang comment để bạn bật sau):
  // const validateRoleForm = (data) => {
  //   if (!data.name.trim()) return "Tên vai trò không được để trống.";
  //   if (data.name.length < 3) return "Tên vai trò phải có ít nhất 3 ký tự.";
  //   return "";
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // const error = validateRoleForm(form);
      // if (error) {
      //   toast.error(error);
      //   setSaving(false);
      //   return;
      // }
      if (role) await adminAPI.updateRole(role.id, form);
      else await adminAPI.createRole(form);
      toast.success(
        role ? t("admin.roleUpdatedSuccess") : t("admin.roleCreatedSuccess"),
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: 16,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {role ? `✏️ ${t("admin.editRole")}` : `➕ ${t("admin.createRole")}`}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder={t("admin.roleNameInput")}
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
            />{" "}
            {t("admin.isActive")}
          </label>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 4,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-sm"
            >
              {saving
                ? t("admin.saving")
                : role
                  ? t("admin.update")
                  : t("admin.createNew")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AssignRoleModal({ onClose, onSave, roles, presetUser }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    userId: presetUser ? String(presetUser.id) : "",
    roleId: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.assignRole({
        userId: parseInt(form.userId),
        roleId: parseInt(form.roleId),
      });
      toast.success(t("admin.roleAssignedSuccess"));
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const iStyle = { ...filterInputStyle, width: "100%" };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: 16,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          👤 {t("admin.assignRole")}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          {/* User field */}
          {presetUser ? (
            <div
              style={{
                ...iStyle,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#0a0a10",
                cursor: "default",
                borderRadius: 6,
                padding: "10px 14px",
              }}
            >
              <UserPlus size={14} color="#4caf50" />
              <span style={{ color: "#fff", fontWeight: 600 }}>
                {presetUser.username}
              </span>
              <span style={{ color: "#555", fontSize: 11 }}>
                #{presetUser.id}
              </span>
            </div>
          ) : (
            <input
              type="number"
              placeholder={t("admin.userIdField")}
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              style={iStyle}
              required
              min={1}
            />
          )}

          <select
            value={form.roleId}
            onChange={(e) => setForm({ ...form, roleId: e.target.value })}
            style={iStyle}
            required
          >
            <option value="">{t("admin.selectRole")}</option>
            {roles
              .filter((r) => r.name !== "User")
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
          </select>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-sm"
            >
              {saving ? t("admin.saving") : t("admin.assignRole")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StaffRolesTab() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("roles"); // roles | staff

  // Roles state
  const [roles, setRoles] = useState([]);
  const [rolesTotal, setRolesTotal] = useState(0);
  const [rolesPage, setRolesPage] = useState(1);
  const [rolesPageSize, setRolesPageSize] = useState(10);
  const [roleSearch, setRoleSearch] = useState({
    keyword: "",
    isActive: "",
    hasUsers: "",
  });
  const [roleSort, setRoleSort] = useState({ field: "name", dir: "asc" });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteRoleTarget, setDeleteRoleTarget] = useState(null);

  // Staff state
  const [staff, setStaff] = useState([]);
  const [staffTotal, setStaffTotal] = useState(0);
  const [staffPage, setStaffPage] = useState(1);
  const [staffPageSize, setStaffPageSize] = useState(10);
  const [staffSearch, setStaffSearch] = useState({
    keyword: "",
    roleId: "",
    isActive: "",
  });
  const [staffSort, setStaffSort] = useState({ field: "username", dir: "asc" });
  const [showAssignModal, setShowAssignModal] = useState(null); // null | { presetUser?: {id, username} }
  const [revokeTarget, setRevokeTarget] = useState(null);

  const loadRoles = async () => {
    try {
      const params = {
        page: rolesPage,
        pageSize: rolesPageSize,
        sortBy: roleSort.field,
        desc: roleSort.dir === "desc",
      };
      if (roleSearch.keyword) params.keyword = roleSearch.keyword;
      if (roleSearch.isActive !== "")
        params.isActive = roleSearch.isActive === "active";
      if (roleSearch.hasUsers !== "")
        params.hasUsers = roleSearch.hasUsers === "yes";
      const res = await adminAPI.getRoles(params);
      setRoles(res.data.data || []);
      setRolesTotal(res.data.totalCount || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || t("admin.loadRolesFailed"));
      setRoles([]);
      setRolesTotal(0);
    }
  };

  const loadStaff = async () => {
    try {
      const params = {
        page: staffPage,
        pageSize: staffPageSize,
        sortBy: staffSort.field,
        desc: staffSort.dir === "desc",
      };
      if (staffSearch.keyword) params.keyword = staffSearch.keyword;
      if (staffSearch.roleId) params.roleId = staffSearch.roleId;
      if (staffSearch.isActive !== "")
        params.isActive = staffSearch.isActive === "active";
      const res = await adminAPI.getStaff(params);
      setStaff(res.data.data || []);
      setStaffTotal(res.data.totalCount || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || t("admin.loadStaffFailed"));
      setStaff([]);
      setStaffTotal(0);
    }
  };

  useEffect(() => {
    setRolesPage(1);
  }, [roleSearch, rolesPageSize, roleSort]);
  useEffect(() => {
    setStaffPage(1);
  }, [staffSearch, staffPageSize, staffSort]);
  useEffect(() => {
    const t = setTimeout(loadRoles, 300);
    return () => clearTimeout(t);
  }, [rolesPage, rolesPageSize, roleSearch, roleSort]);
  useEffect(() => {
    const t = setTimeout(loadStaff, 300);
    return () => clearTimeout(t);
  }, [staffPage, staffPageSize, staffSearch, staffSort]);

  const handleDeleteRole = async () => {
    if (!deleteRoleTarget) return;
    try {
      await adminAPI.deleteRole(deleteRoleTarget.id);
      toast.success(t("admin.roleDeletedSuccess"));
      setDeleteRoleTarget(null);
      loadRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleRevokeRole = async () => {
    if (!revokeTarget) return;
    try {
      await adminAPI.revokeRole({
        userId: revokeTarget.userId,
        roleId: revokeTarget.roleId,
      });
      toast.success(t("admin.roleRevokedSuccess"));
      setRevokeTarget(null);
      loadStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const rolesTotalPages = Math.max(1, Math.ceil(rolesTotal / rolesPageSize));
  const staffTotalPages = Math.max(1, Math.ceil(staffTotal / staffPageSize));

  return (
    <div>
      {/* Section switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { id: "roles", icon: Shield, label: t("admin.rolesSection") },
          { id: "staff", icon: UserPlus, label: t("admin.staffSection") },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #1a1a2e",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: activeSection === id ? "var(--accent)" : "#111118",
              color: "#fff",
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ===== ROLES SECTION ===== */}
      {activeSection === "roles" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <input
              placeholder={t("admin.searchRoles")}
              value={roleSearch.keyword}
              onChange={(e) =>
                setRoleSearch({ ...roleSearch, keyword: e.target.value })
              }
              style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }}
            />
            <select
              value={roleSearch.isActive}
              onChange={(e) =>
                setRoleSearch({ ...roleSearch, isActive: e.target.value })
              }
              style={filterInputStyle}
            >
              <option value="">{t("admin.allStatuses")}</option>
              <option value="active">{t("admin.active")}</option>
              <option value="inactive">{t("admin.inactive")}</option>
            </select>
            <select
              value={roleSearch.hasUsers}
              onChange={(e) =>
                setRoleSearch({ ...roleSearch, hasUsers: e.target.value })
              }
              style={filterInputStyle}
            >
              <option value="">{t("admin.all")}</option>
              <option value="yes">{t("admin.hasStaff")}</option>
              <option value="no">{t("admin.noStaff")}</option>
            </select>
            {(roleSearch.keyword ||
              roleSearch.isActive ||
              roleSearch.hasUsers) && (
              <button
                onClick={() =>
                  setRoleSearch({ keyword: "", isActive: "", hasUsers: "" })
                }
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
                setEditingRole(null);
                setShowRoleModal(true);
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
              <Plus size={14} /> {t("admin.addRole")}
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
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: "#0a0a10" }}>
                  <SortableHeader
                    field="id"
                    sort={roleSort}
                    setSort={setRoleSort}
                  >
                    #
                  </SortableHeader>
                  <SortableHeader
                    field="name"
                    sort={roleSort}
                    setSort={setRoleSort}
                  >
                    {t("admin.nameColumn")}
                  </SortableHeader>
                  <SortableHeader
                    field="description"
                    sort={roleSort}
                    setSort={setRoleSort}
                  >
                    {t("admin.description")}
                  </SortableHeader>
                  <SortableHeader
                    field="userCount"
                    sort={roleSort}
                    setSort={setRoleSort}
                  >
                    {t("admin.userCount")}
                  </SortableHeader>
                  <th style={{ ...thStyle, cursor: "default" }}>
                    {t("admin.permissions")}
                  </th>
                  <th style={{ ...thStyle, cursor: "default" }}>
                    {t("admin.status")}
                  </th>
                  <th style={{ ...thStyle, cursor: "default" }}></th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "9px 14px", color: "#555" }}>
                      #{r.id}
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Shield size={12} color="var(--accent)" />
                        <span style={{ color: "#fff", fontWeight: 600 }}>
                          {r.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "9px 14px", color: "#888" }}>
                      {r.description || "-"}
                    </td>
                    <td
                      style={{
                        padding: "9px 14px",
                        color: "#4caf50",
                        fontWeight: 600,
                      }}
                    >
                      {r.userCount}
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      {r.permissionCount > 0 ? (
                        <span
                          style={{
                            background: "#0a1a2e",
                            color: "#4fc3f7",
                            padding: "3px 8px",
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {r.permissionCount} quyền
                        </span>
                      ) : (
                        <span style={{ color: "#444", fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <span
                        className={`status-dot ${r.isActive ? "active" : "inactive"}`}
                      >
                        {r.isActive ? t("admin.active") : t("admin.inactive")}
                      </span>
                    </td>
                    <td
                      style={{ padding: "9px 14px", display: "flex", gap: 5 }}
                    >
                      <button
                        onClick={() => {
                          setEditingRole(r);
                          setShowRoleModal(true);
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
                      {r.name !== "Admin" && r.name !== "User" && (
                        <button
                          onClick={() => setDeleteRoleTarget(r)}
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
                      )}
                    </td>
                  </tr>
                ))}
                {roles.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      {t("admin.noRoles")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              page={rolesPage}
              totalPages={rolesTotalPages}
              totalItems={rolesTotal}
              pageSize={rolesPageSize}
              setPage={setRolesPage}
              setPageSize={setRolesPageSize}
            />
          </div>
        </div>
      )}

      {/* ===== STAFF SECTION ===== */}
      {activeSection === "staff" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <input
              placeholder={t("admin.searchUsers")}
              value={staffSearch.keyword}
              onChange={(e) =>
                setStaffSearch({ ...staffSearch, keyword: e.target.value })
              }
              style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }}
            />
            <select
              value={staffSearch.roleId}
              onChange={(e) =>
                setStaffSearch({ ...staffSearch, roleId: e.target.value })
              }
              style={filterInputStyle}
            >
              <option value="">{t("admin.allRoles")}</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <select
              value={staffSearch.isActive}
              onChange={(e) =>
                setStaffSearch({ ...staffSearch, isActive: e.target.value })
              }
              style={filterInputStyle}
            >
              <option value="">{t("admin.allStatuses")}</option>
              <option value="active">{t("admin.active")}</option>
              <option value="locked">{t("admin.locked")}</option>
            </select>
            {(staffSearch.keyword ||
              staffSearch.roleId ||
              staffSearch.isActive) && (
              <button
                onClick={() =>
                  setStaffSearch({ keyword: "", roleId: "", isActive: "" })
                }
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
              onClick={() => setShowAssignModal({})}
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
              <UserPlus size={14} /> {t("admin.assignRole")}
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
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: "#0a0a10" }}>
                  <SortableHeader
                    field="id"
                    sort={staffSort}
                    setSort={setStaffSort}
                  >
                    #
                  </SortableHeader>
                  <SortableHeader
                    field="username"
                    sort={staffSort}
                    setSort={setStaffSort}
                  >
                    {t("admin.username")}
                  </SortableHeader>
                  <SortableHeader
                    field="displayName"
                    sort={staffSort}
                    setSort={setStaffSort}
                  >
                    {t("admin.displayName")}
                  </SortableHeader>
                  <SortableHeader
                    field="email"
                    sort={staffSort}
                    setSort={setStaffSort}
                  >
                    Email
                  </SortableHeader>
                  <th style={{ ...thStyle, cursor: "default" }}>
                    {t("admin.sectionRoles")}
                  </th>
                  <th style={{ ...thStyle, cursor: "default" }}>
                    {t("admin.status")}
                  </th>
                  <th style={{ ...thStyle, cursor: "default" }}></th>
                </tr>
              </thead>
              <tbody>
                {staff.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "9px 14px", color: "#555" }}>
                      #{u.id}
                    </td>
                    <td
                      style={{
                        padding: "9px 14px",
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    >
                      {u.username}
                    </td>
                    <td style={{ padding: "9px 14px", color: "#ccc" }}>
                      {u.displayName || "-"}
                    </td>
                    <td style={{ padding: "9px 14px", color: "#888" }}>
                      {u.email || "-"}
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
                      >
                        {(u.roles || []).length === 0 ? (
                          // User chưa có UserRole trong DB → hiển thị badge "User" mặc định (không thể thu hồi)
                          <span
                            className="badge badge-accent"
                            style={{
                              padding: "2px 8px",
                              fontSize: 10,
                              opacity: 0.6,
                            }}
                          >
                            User
                          </span>
                        ) : (
                          (u.roles || []).map((r) => (
                            <span
                              key={r.roleId}
                              className={`badge ${r.roleName === "Admin" ? "badge-danger" : r.roleName === "User" ? "badge-accent" : "badge-accent"}`}
                              style={{
                                padding: "2px 8px",
                                fontSize: 10,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              {r.roleName}
                              {/* Chỉ cho phép thu hồi role không phải "User" */}
                              {r.roleName !== "User" && (
                                <button
                                  onClick={() =>
                                    setRevokeTarget({
                                      userId: u.id,
                                      username: u.username,
                                      roleId: r.roleId,
                                      roleName: r.roleName,
                                    })
                                  }
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    display: "flex",
                                  }}
                                >
                                  <X size={10} color="#e94560" />
                                </button>
                              )}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <span
                        className={`status-dot ${u.isActive ? "active" : "locked"}`}
                      >
                        {u.isActive ? t("admin.active") : t("admin.locked")}
                      </span>
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <button
                        onClick={() =>
                          setShowAssignModal({
                            presetUser: { id: u.id, username: u.username },
                          })
                        }
                        style={{
                          padding: "4px 7px",
                          background: "#1a1a2e",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                        title={t("admin.assignRoleTo")}
                      >
                        <UserPlus size={11} color="#4caf50" />
                      </button>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      {t("admin.noStaff")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              page={staffPage}
              totalPages={staffTotalPages}
              totalItems={staffTotal}
              pageSize={staffPageSize}
              setPage={setStaffPage}
              setPageSize={setStaffPageSize}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {showRoleModal && (
        <RoleModal
          role={editingRole}
          onClose={() => {
            setShowRoleModal(false);
            setEditingRole(null);
          }}
          onSave={() => {
            setShowRoleModal(false);
            setEditingRole(null);
            loadRoles();
          }}
        />
      )}
      {showAssignModal !== null && (
        <AssignRoleModal
          roles={roles}
          presetUser={showAssignModal.presetUser || null}
          onClose={() => setShowAssignModal(null)}
          onSave={() => {
            setShowAssignModal(null);
            loadStaff();
          }}
        />
      )}
      {deleteRoleTarget && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ width: 360, textAlign: "center", borderColor: "#e94560" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 size={36} color="#e94560" style={{ marginBottom: 10 }} />
            <h3 style={{ color: "#fff", marginBottom: 8, fontSize: 15 }}>
              {t("admin.deleteRole")}
            </h3>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
              {t("admin.confirmDeleteRole", { name: deleteRoleTarget.name })}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setDeleteRoleTarget(null)}
                className="btn btn-ghost btn-sm"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDeleteRole}
                className="btn btn-danger btn-sm"
              >
                {t("admin.confirmDelete")}
              </button>
            </div>
          </div>
        </div>
      )}
      {revokeTarget && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ width: 360, textAlign: "center", borderColor: "#ff9800" }}
            onClick={(e) => e.stopPropagation()}
          >
            <UserMinus size={36} color="#ff9800" style={{ marginBottom: 10 }} />
            <h3 style={{ color: "#fff", marginBottom: 8, fontSize: 15 }}>
              {t("admin.revokeRole")}
            </h3>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
              {t("admin.confirmRevokeRole", {
                role: revokeTarget.roleName,
                user: revokeTarget.username,
                userId: revokeTarget.userId,
              })}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setRevokeTarget(null)}
                className="btn btn-ghost btn-sm"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleRevokeRole}
                className="btn btn-danger btn-sm"
              >
                {t("admin.confirmRevoke")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
