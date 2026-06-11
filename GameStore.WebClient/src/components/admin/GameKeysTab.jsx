// GameStore.WebClient/src/components/admin/GameKeysTab.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, X, Key, Upload, Edit } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "../common/Pagination";
import { thStyle, filterInputStyle } from "./adminStyles";
import { adminAPI } from "../../services/api";
import api from "../../services/api";

function AddKeyModal({ onClose, onSave, games }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState("single"); // single | batch
  const [form, setForm] = useState({ gameId: "", keyCode: "", expiresAt: "" });
  const [batchForm, setBatchForm] = useState({
    gameId: "",
    keyCodes: "",
    expiresAt: "",
  });
  const [saving, setSaving] = useState(false);

  const iStyle = { ...filterInputStyle, width: "100%" };

  const handleSingle = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.createGameKey({
        gameId: parseInt(form.gameId),
        keyCode: form.keyCode,
        expiresAt: form.expiresAt || null,
      });
      toast.success(t("admin.addKeySuccess"));
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBatch = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const codes = batchForm.keyCodes
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await adminAPI.createBatchGameKeys({
        gameId: parseInt(batchForm.gameId),
        keyCodes: codes,
        expiresAt: batchForm.expiresAt || null,
      });
      toast.success(res.data.message || t("admin.keyCreatedSuccess"));
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

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
          width: 500,
          border: "1px solid #1a1a2e",
          maxHeight: "90vh",
          overflow: "auto",
        }}
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
          🔑 {t("admin.addKey")}
        </h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["single", "batch"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid #1a1a2e",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                background: mode === m ? "var(--accent)" : "#0a0a10",
                color: "#fff",
              }}
            >
              {m === "single" ? t("admin.singleKey") : t("admin.batchKeys")}
            </button>
          ))}
        </div>

        {mode === "single" ? (
          <form onSubmit={handleSingle} style={{ display: "grid", gap: 12 }}>
            <select
              value={form.gameId}
              onChange={(e) => setForm({ ...form, gameId: e.target.value })}
              style={iStyle}
              required
            >
              <option value="">Chọn game *</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
            <input
              placeholder={t("admin.keyCodeInput")}
              value={form.keyCode}
              onChange={(e) => setForm({ ...form, keyCode: e.target.value })}
              style={iStyle}
              required
            />
            <div style={{ color: "#888", fontSize: 11 }}>
              Ngày hết hạn (tùy chọn):
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
                style={{ ...iStyle, marginTop: 4 }}
              />
            </div>
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
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
                {saving ? t("admin.saving") : t("admin.addKey")}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleBatch} style={{ display: "grid", gap: 12 }}>
            <select
              value={batchForm.gameId}
              onChange={(e) =>
                setBatchForm({ ...batchForm, gameId: e.target.value })
              }
              style={iStyle}
              required
            >
              <option value="">Chọn game *</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
            <textarea
              placeholder={t("admin.pasteKeys")}
              value={batchForm.keyCodes}
              onChange={(e) =>
                setBatchForm({ ...batchForm, keyCodes: e.target.value })
              }
              style={{
                ...iStyle,
                minHeight: 120,
                resize: "vertical",
                fontFamily: "monospace",
                fontSize: 11,
              }}
              required
            />
            <p style={{ color: "#666", fontSize: 10, margin: 0 }}>
              {batchForm.keyCodes.split("\n").filter((s) => s.trim()).length}{" "}
              {t("admin.keysDetected")}
            </p>
            <div style={{ color: "#888", fontSize: 11 }}>
              Ngày hết hạn (tùy chọn):
              <input
                type="datetime-local"
                value={batchForm.expiresAt}
                onChange={(e) =>
                  setBatchForm({ ...batchForm, expiresAt: e.target.value })
                }
                style={{ ...iStyle, marginTop: 4 }}
              />
            </div>
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
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
                <Upload size={12} style={{ marginRight: 4 }} />{" "}
                {saving ? t("admin.saving") : t("admin.batchKeys")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function EditKeyModal({ keyData, onClose, onSave }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    keyCode: keyData.keyCode || "",
    expiresAt: keyData.expiresAt
      ? new Date(keyData.expiresAt).toISOString().slice(0, 16)
      : "",
    clearExpiry: false,
  });
  const [saving, setSaving] = useState(false);
  const iStyle = { ...filterInputStyle, width: "100%" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.updateGameKey(keyData.id, {
        keyCode: form.keyCode,
        expiresAt: form.clearExpiry ? null : (form.expiresAt || null),
        clearExpiry: form.clearExpiry,
      });
      toast.success(t("admin.keyUpdatedSuccess"));
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#111118", borderRadius: 12, padding: 30, width: 460, border: "1px solid #1a1a2e" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: "#fff", marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
          ✏️ {t("admin.editKey")}
        </h3>
        <p style={{ color: "#888", fontSize: 11, marginBottom: 14 }}>
          Game: <strong style={{ color: "#ccc" }}>{keyData.gameTitle}</strong>
        </p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <p style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>{t("admin.keyCodeInput")}</p>
            <input
              placeholder={t("admin.enterKeyCode")}
              value={form.keyCode}
              onChange={(e) => setForm({ ...form, keyCode: e.target.value })}
              style={{ ...iStyle, fontFamily: "monospace" }}
              required
            />
          </div>
          <div>
            <p style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>{t("admin.expiryOptional")}</p>
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value, clearExpiry: false })}
              style={iStyle}
              disabled={form.clearExpiry}
            />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.clearExpiry}
              onChange={(e) => setForm({ ...form, clearExpiry: e.target.checked, expiresAt: "" })}
            />
            {t("admin.clearExpiry")}
          </label>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "8px 20px", background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: "8px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
            >
              {saving ? t("admin.saving") : t("admin.update")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GameKeysTab() {
  const { t } = useTranslation();
  const [keys, setKeys] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    totalKeys: 0,
    usedKeys: 0,
    availableKeys: 0,
    expiredKeys: 0,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({ keyword: "", gameId: "", status: "" });
  const [sort, setSort] = useState({ field: "createdAt", dir: "desc" });
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    api
      .get("/games?page=1&pageSize=500")
      .then((r) => setGames(r.data?.data || []))
      .catch(() => {});
  }, []);

  const load = async () => {
    try {
      const params = { page, pageSize, sortBy: sort.field, desc: sort.dir === "desc" };
      if (search.keyword) params.keyword = search.keyword;
      if (search.gameId) params.gameId = search.gameId;
      if (search.status) params.status = search.status;
      const res = await adminAPI.getGameKeys(params);
      setKeys(res.data.data || []);
      setTotal(res.data.totalCount || 0);
      if (res.data.stats) setStats(res.data.stats);
    } catch {
      setKeys([]);
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
      await adminAPI.deleteGameKey(deleteTarget.id);
      toast.success(t("admin.keyDeletedSuccess"));
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const statCards = [
    { label: t("admin.totalKeys"), value: stats.totalKeys, color: "var(--accent)" },
    { label: t("admin.availableKeys"), value: stats.availableKeys, color: "#4caf50" },
    { label: t("admin.usedKeys"), value: stats.usedKeys, color: "#ffc107" },
    { label: t("admin.expiredKeys"), value: stats.expiredKeys, color: "#e94560" },
  ];

  const getKeyStatus = (k) => {
    if (k.isUsed)      return { text: t("admin.usedKeys"), color: "#ff9800" };
    if (k.expiresAt && new Date(k.expiresAt) <= new Date())
      return { text: t("admin.expiredKeys"), color: "#e94560" };
    return { text: t("admin.availableKeys"), color: "#4caf50" };
  };

  return (
    <div>
      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#111118",
              borderRadius: 8,
              padding: 14,
              border: "1px solid #1a1a2e",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 20, fontWeight: 800, color: s.color }}>
              {s.value}
            </p>
            <p
              style={{
                fontSize: 10,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        <input
          placeholder={t("admin.searchKeys")}
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          style={{ ...filterInputStyle, flex: 1, maxWidth: 200 }}
        />
        <select
          value={search.gameId}
          onChange={(e) => setSearch({ ...search, gameId: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">{t("admin.allGames")}</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
        <select
          value={search.status}
          onChange={(e) => setSearch({ ...search, status: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">{t("admin.allStatuses")}</option>
          <option value="available">{t("admin.availableKeys")}</option>
          <option value="used">{t("admin.usedKeys")}</option>
          <option value="expired">{t("admin.expiredKeys")}</option>
        </select>
        {(search.keyword || search.gameId || search.status) && (
          <button
            onClick={() => setSearch({ keyword: "", gameId: "", status: "" })}
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
          onClick={() => setShowModal(true)}
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
          <Plus size={14} /> {t("admin.addKey")}
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
              <SortableHeader field="gameTitle" sort={sort} setSort={setSort}>
                {t("admin.gameName")}
              </SortableHeader>
              <SortableHeader field="keyCode" sort={sort} setSort={setSort}>
                {t("admin.keyCode")}
              </SortableHeader>
              <th style={{ ...thStyle, cursor: "default" }}>{t("admin.status")}</th>
              <SortableHeader field="createdAt" sort={sort} setSort={setSort}>
                {t("admin.createdDate")}
              </SortableHeader>
              <SortableHeader field="expiresAt" sort={sort} setSort={setSort}>
                {t("admin.expiryDate")}
              </SortableHeader>
              <th style={{ ...thStyle, cursor: "default" }}></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => {
              const st = getKeyStatus(k);
              return (
                <tr key={k.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "9px 14px", color: "#555" }}>
                    #{k.id}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    {k.gameTitle}
                  </td>
                  <td style={{ padding: "9px 14px" }}>
                    <code
                      style={{
                        background: "#0a0a10",
                        padding: "3px 8px",
                        borderRadius: 4,
                        color: "#4fc3f7",
                        fontSize: 11,
                        letterSpacing: 0.5,
                      }}
                    >
                      {k.keyCode}
                    </code>
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
                          background: st.color,
                        }}
                      />
                      <span
                        style={{
                          color: st.color,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {st.text}
                      </span>
                    </span>
                  </td>
                  <td style={{ padding: "9px 14px", color: "#888" }}>
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      color: k.expiresAt ? "#ff9800" : "#555",
                    }}
                  >
                    {k.expiresAt
                      ? new Date(k.expiresAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ padding: "9px 14px", display: "flex", gap: 5, justifyContent: "center" }}>
                    {!k.isUsed ? (
                      <>
                        <button
                          onClick={() => setEditingKey(k)}
                          style={{ padding: "4px 7px", background: "#1a1a2e", border: "none", borderRadius: 4, cursor: "pointer" }}
                          title={t("admin.edit")}
                        >
                          <Edit size={11} color="#0078f2" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(k)}
                          style={{ padding: "4px 7px", background: "#1a1a2e", border: "none", borderRadius: 4, cursor: "pointer" }}
                        >
                          <Trash2 size={11} color="#e94560" />
                        </button>
                      </>
                    ) : (
                      <span title={t("admin.soldKeyTooltip")} style={{ opacity: 0.3 }}>
                        <Trash2 size={11} color="#888" />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {keys.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{ padding: 20, textAlign: "center", color: "#666" }}
                >
                  {t("admin.noKeys")}
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
        <AddKeyModal
          games={games}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
      {editingKey && (
        <EditKeyModal
          keyData={editingKey}
          onClose={() => setEditingKey(null)}
          onSave={() => {
            setEditingKey(null);
            load();
          }}
        />
      )}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#111118", borderRadius: 12, padding: 28, width: 380, textAlign: "center", border: "1px solid #e94560" }} onClick={(e) => e.stopPropagation()}>
            <Trash2 size={36} color="#e94560" style={{ marginBottom: 10 }} />
            <h3 style={{ color: "#fff", marginBottom: 8, fontSize: 15 }}>{t("admin.deleteKey")}</h3>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>
              {t("admin.confirmDeleteKey")}
            </p>
            <code style={{ display: "block", background: "#0a0a10", padding: "6px 12px", borderRadius: 4, color: "#4fc3f7", fontSize: 12, marginBottom: 20 }}>
              {deleteTarget.keyCode}
            </code>
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
