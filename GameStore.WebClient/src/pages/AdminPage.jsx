// GameStore.WebClient/src/pages/AdminPage.jsx
import { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { gameAPI } from "../services/api";
import api from "../services/api";
import {
  Gamepad2,
  Users,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Package,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
} from "lucide-react";

const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  color: "#888",
  textTransform: "uppercase",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1,
  borderBottom: "2px solid #1a1a2e",
  cursor: "pointer",
  userSelect: "none",
  transition: "color 0.2s",
};

// ===== GAME FORM MODAL =====
function GameFormModal({ game, onClose, onSave }) {
  const [form, setForm] = useState({
    title: game?.title || "",
    description: game?.description || "",
    price: game?.price || 0,
    discountPrice: game?.discountPrice || "",
    developer: game?.developer || "",
    publisher: game?.publisher || "",
    releaseDate: game?.releaseDate
      ? new Date(game.releaseDate).toISOString().split("T")[0]
      : "",
    coverImageUrl: game?.coverImageUrl || "",
    trailerUrl: game?.trailerUrl || "",
    minimumOS: game?.minimumOS || "",
    minimumProcessor: game?.minimumProcessor || "",
    minimumMemory: game?.minimumMemory || "",
    minimumGraphics: game?.minimumGraphics || "",
    minimumStorage: game?.minimumStorage || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice
          ? parseFloat(form.discountPrice)
          : null,
        releaseDate: form.releaseDate
          ? new Date(form.releaseDate).toISOString()
          : null,
      };
      if (game) await gameAPI.update(game.id, data);
      else await gameAPI.create(data);
      onSave();
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    background: "#0a0a10",
    border: "1px solid #1a1a2e",
    borderRadius: 6,
    color: "#fff",
    fontSize: 13,
    outline: "none",
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
          width: 600,
          maxHeight: "90vh",
          overflow: "auto",
          border: "1px solid #1a1a2e",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: 20,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {game ? "✏️ Edit Game" : "➕ Add New Game"}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <input
              placeholder="Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price *"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Discount Price"
              value={form.discountPrice}
              onChange={(e) =>
                setForm({ ...form, discountPrice: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="date"
              placeholder="Release Date"
              value={form.releaseDate}
              onChange={(e) =>
                setForm({ ...form, releaseDate: e.target.value })
              }
              style={inputStyle}
            />
            <input
              placeholder="Developer"
              value={form.developer}
              onChange={(e) => setForm({ ...form, developer: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Publisher"
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              style={inputStyle}
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <input
              placeholder="Cover Image URL"
              value={form.coverImageUrl}
              onChange={(e) =>
                setForm({ ...form, coverImageUrl: e.target.value })
              }
              style={inputStyle}
            />
            <input
              placeholder="Trailer URL"
              value={form.trailerUrl}
              onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
              style={inputStyle}
            />
          </div>
          <fieldset
            style={{
              border: "1px solid #1a1a2e",
              borderRadius: 6,
              padding: 12,
            }}
          >
            <legend style={{ color: "#888", fontSize: 12, padding: "0 8px" }}>
              System Requirements
            </legend>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <input
                placeholder="OS"
                value={form.minimumOS}
                onChange={(e) =>
                  setForm({ ...form, minimumOS: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Processor"
                value={form.minimumProcessor}
                onChange={(e) =>
                  setForm({ ...form, minimumProcessor: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Memory"
                value={form.minimumMemory}
                onChange={(e) =>
                  setForm({ ...form, minimumMemory: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Graphics"
                value={form.minimumGraphics}
                onChange={(e) =>
                  setForm({ ...form, minimumGraphics: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Storage"
                value={form.minimumStorage}
                onChange={(e) =>
                  setForm({ ...form, minimumStorage: e.target.value })
                }
                style={{ ...inputStyle, gridColumn: "1 / -1" }}
              />
            </div>
          </fieldset>
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
              Cancel
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
              {saving ? "Saving..." : game ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===== DELETE CONFIRM MODAL =====
function DeleteConfirmModal({ game, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await gameAPI.delete(game.id);
      onConfirm();
    } catch (err) {
      alert(
        "Failed to delete: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setDeleting(false);
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
          width: 400,
          textAlign: "center",
          border: "1px solid #e94560",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Trash2 size={40} color="#e94560" style={{ marginBottom: 12 }} />
        <h3 style={{ color: "#fff", marginBottom: 8 }}>Delete Game?</h3>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "#fff" }}>"{game.title}"</strong>?
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
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
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
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
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== PAGINATION (Improved) =====
function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  setPage,
  setPageSize,
}) {
  if (!totalPages || totalPages < 1) totalPages = 1;

  // Compute page numbers with ellipsis (max 5 visible numbers)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1)
        start = Math.max(1, end - maxVisible + 1);
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  }, [page, totalPages]);

  const from = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, totalItems);

  const btnBase = {
    minWidth: 30,
    height: 30,
    padding: "0 8px",
    background: "#1a1a2e",
    color: "#fff",
    border: "1px solid #1a1a2e",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  };
  const disabledStyle = { opacity: 0.4, cursor: "not-allowed" };
  const activeStyle = {
    background: "var(--accent)",
    borderColor: "var(--accent)",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        padding: "12px 14px",
        borderTop: "1px solid #1a1a2e",
        background: "#0d0d14",
      }}
    >
      {/* Left: info + page size */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "#888",
          fontSize: 12,
        }}
      >
        <span>
          {totalItems > 0 ? (
            <>
              Showing <strong style={{ color: "#fff" }}>{from}</strong>–
              <strong style={{ color: "#fff" }}>{to}</strong> of{" "}
              <strong style={{ color: "#fff" }}>{totalItems}</strong>
            </>
          ) : (
            <>No records</>
          )}
        </span>
        {setPageSize && (
          <>
            <span style={{ color: "#444" }}>|</span>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              Rows per page:
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  padding: "4px 8px",
                  background: "#111118",
                  color: "#fff",
                  border: "1px solid #1a1a2e",
                  borderRadius: 4,
                  fontSize: 12,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {[10, 20, 50, 100].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>

      {/* Right: page controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          style={{ ...btnBase, ...(page === 1 ? disabledStyle : {}) }}
          title="First page"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ ...btnBase, ...(page === 1 ? disabledStyle : {}) }}
          title="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {pageNumbers.map((p, idx) =>
          p === "..." ? (
            <span key={`e-${idx}`} style={{ color: "#666", padding: "0 4px" }}>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{ ...btnBase, ...(p === page ? activeStyle : {}) }}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{ ...btnBase, ...(page === totalPages ? disabledStyle : {}) }}
          title="Next page"
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          style={{ ...btnBase, ...(page === totalPages ? disabledStyle : {}) }}
          title="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();

  // ===== Data lists (per current tab/page) =====
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // ===== Dashboard global data (independent of tabs) =====
  const [allOrders, setAllOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [activeTab, setActiveTab] = useState("dashboard");

  // ===== Sorting =====
  const [gameSort, setGameSort] = useState({ field: "id", dir: "asc" });
  const [userSort, setUserSort] = useState({ field: "id", dir: "asc" });
  const [orderSort, setOrderSort] = useState({ field: "id", dir: "asc" });

  // ===== Pagination state (page + pageSize + totals) =====
  const [gamesPage, setGamesPage] = useState(1);
  const [gamesPageSize, setGamesPageSize] = useState(10);
  const [gamesTotal, setGamesTotal] = useState(0);

  const [usersPage, setUsersPage] = useState(1);
  const [usersPageSize, setUsersPageSize] = useState(10);
  const [usersTotal, setUsersTotal] = useState(0);

  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPageSize, setOrdersPageSize] = useState(10);
  const [ordersTotal, setOrdersTotal] = useState(0);

  // ===== Filters =====
  const [orderSearch, setOrderSearch] = useState({
    keyword: "",
    fromDate: "",
    toDate: "",
    status: "",
  });
  const [gameSearch, setGameSearch] = useState({
    keyword: "",
    genreId: "",
    maxPrice: "",
  });
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    api
      .get("/genres")
      .then((res) => setGenres(res.data))
      .catch(() => {});
  }, []);

  // ===== Modals =====
  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const gamesTotalPages = Math.max(1, Math.ceil(gamesTotal / gamesPageSize));
  const usersTotalPages = Math.max(1, Math.ceil(usersTotal / usersPageSize));
  const ordersTotalPages = Math.max(1, Math.ceil(ordersTotal / ordersPageSize));

  // ===== Reset page=1 whenever filters or pageSize change =====
  useEffect(() => {
    setGamesPage(1);
  }, [gameSearch, gamesPageSize]);
  useEffect(() => {
    setUsersPage(1);
  }, [usersPageSize]);
  useEffect(() => {
    setOrdersPage(1);
  }, [orderSearch, ordersPageSize]);

  // ===== Calculate monthly revenue from full order list =====
  const calculateMonthlyRevenue = (ordersData) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const map = months.map((m) => ({ month: m, value: 0, count: 0 }));
    ordersData.forEach((o) => {
      if (o.status === "Completed" && o.orderDate) {
        const d = new Date(o.orderDate);
        if (d.getFullYear() === currentYear) {
          map[d.getMonth()].value += o.totalAmount || 0;
          map[d.getMonth()].count += 1;
        }
      }
    });
    return map.map((m) => ({ ...m, value: Math.round(m.value) }));
  };

  // ===== Load list data per tab =====
  const loadGames = async () => {
    const obj = { page: gamesPage, pageSize: gamesPageSize };
    if (gameSearch.keyword) obj.keyword = gameSearch.keyword;
    if (gameSearch.genreId) obj.genreId = gameSearch.genreId;
    if (gameSearch.maxPrice) obj.maxPrice = gameSearch.maxPrice;
    const q = new URLSearchParams(obj).toString();
    try {
      const res = await api.get(`/games?${q}`);
      setGames(res.data?.data || []);
      setGamesTotal(
        res.data?.totalCount ??
          res.data?.total ??
          (res.data?.data?.length || 0),
      );
    } catch {
      setGames([]);
      setGamesTotal(0);
    }
  };

  const loadUsers = async () => {
    const q = new URLSearchParams({
      page: usersPage,
      pageSize: usersPageSize,
    }).toString();
    try {
      const res = await api.get(`/users?${q}`);
      setUsers(res.data?.data || []);
      setUsersTotal(res.data?.totalCount ?? 0);
    } catch {
      setUsers([]);
      setUsersTotal(0);
    }
  };

  const loadOrders = async () => {
    const obj = { page: ordersPage, pageSize: ordersPageSize };
    if (orderSearch.keyword) obj.keyword = orderSearch.keyword;
    if (orderSearch.fromDate) obj.fromDate = orderSearch.fromDate;
    if (orderSearch.toDate) obj.toDate = orderSearch.toDate;
    if (orderSearch.status) obj.status = orderSearch.status;
    const q = new URLSearchParams(obj).toString();
    try {
      const res = await api.get(`/orders/search?${q}`);
      setOrders(res.data?.data || []);
      setOrdersTotal(res.data?.totalCount ?? 0);
    } catch {
      setOrders([]);
      setOrdersTotal(0);
    }
  };

  // ===== Load global dashboard data (independent of pagination) =====
  const loadDashboard = async () => {
    try {
      const [allOrdersRes, gamesCountRes, usersCountRes] = await Promise.all([
        api.get(`/orders/all`).catch(() => ({ data: [] })),
        api
          .get(`/games?page=1&pageSize=1`)
          .catch(() => ({ data: { totalCount: 0 } })),
        api
          .get(`/users?page=1&pageSize=1`)
          .catch(() => ({ data: { totalCount: 0 } })),
      ]);
      const orderList = allOrdersRes.data || [];
      setAllOrders(orderList);
      const totalRevenue = orderList
        .filter((o) => o.status === "Completed")
        .reduce((s, o) => s + (o.totalAmount || 0), 0);

      setStats({
        totalGames: gamesCountRes.data?.totalCount ?? 0,
        totalUsers: usersCountRes.data?.totalCount ?? 0,
        totalOrders: orderList.length,
        revenue: totalRevenue.toFixed(2),
      });
      setMonthlyRevenue(calculateMonthlyRevenue(orderList));
    } catch (e) {
      console.error("Dashboard load error:", e);
    }
  };

  // ===== Effects: load data per tab (debounced for search) =====
  useEffect(() => {
    const t = setTimeout(loadGames, 300);
    return () => clearTimeout(t);
  }, [gamesPage, gamesPageSize, gameSearch]);

  useEffect(() => {
    loadUsers();
  }, [usersPage, usersPageSize]);

  useEffect(() => {
    const t = setTimeout(loadOrders, 300);
    return () => clearTimeout(t);
  }, [ordersPage, ordersPageSize, orderSearch]);

  // Refresh dashboard once on mount, and when user switches BACK to dashboard
  useEffect(() => {
    if (activeTab === "dashboard") loadDashboard();
  }, [activeTab]);

  // ===== Sort helpers (client-side sort within current page) =====
  const sortFn = (data, field, dir) =>
    [...data].sort((a, b) => {
      let va = a[field],
        vb = b[field];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va == null) return 1;
      if (vb == null) return -1;
      return dir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });

  const toggleSort = (field, current, setter) =>
    setter({
      field,
      dir: current.field === field && current.dir === "asc" ? "desc" : "asc",
    });

  const SortIcon = ({ field, current }) => {
    if (field !== current.field) return null;
    return current.dir === "asc" ? (
      <ArrowUp size={10} color="var(--accent)" />
    ) : (
      <ArrowDown size={10} color="var(--accent)" />
    );
  };

  const Th = ({ field, sort, setSort, children }) => (
    <th
      onClick={() => toggleSort(field, sort, setSort)}
      style={{ ...thStyle, color: sort.field === field ? "#fff" : "#888" }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {children} <SortIcon field={field} current={sort} />
      </span>
    </th>
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "var(--bg-primary)",
          color: "#888",
        }}
      >
        Loading...
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/" />;

  const sortedGames = sortFn(games, gameSort.field, gameSort.dir);
  const sortedUsers = sortFn(users, userSort.field, userSort.dir);
  const sortedOrders = sortFn(orders, orderSort.field, orderSort.dir);

  // For dashboard "Recent Orders": derive from allOrders
  const recentOrders = useMemo(() => {
    return [...allOrders]
      .sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0))
      .slice(0, 8);
  }, [allOrders]);

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1);
  const displayMax = maxRevenue > 0 ? maxRevenue : 100;

  // Find current month for highlighting
  const currentMonthIdx = new Date().getMonth();

  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "games", icon: Gamepad2, label: "Games" },
    { id: "users", icon: Users, label: "Users" },
    { id: "orders", icon: Package, label: "Orders" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-primary)",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 200,
          background: "#0d0d14",
          borderRight: "1px solid #1a1a2e",
          padding: "20px 0",
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        <div style={{ padding: "0 16px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
                A
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 12, color: "#fff" }}>
                Admin
              </div>
              <div style={{ fontSize: 10, color: "#666" }}>
                {user?.displayName || user?.username}
              </div>
            </div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 16px",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                background: activeTab === id ? "var(--accent)" : "transparent",
                color: activeTab === id ? "#fff" : "#888",
                textAlign: "left",
                transition: "all 0.15s",
                width: "100%",
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          {activeTab === "dashboard" && (
            <button
              onClick={loadDashboard}
              style={{
                padding: "6px 14px",
                background: "#1a1a2e",
                color: "#fff",
                border: "1px solid #2a2a3e",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <TrendingUp size={12} /> Refresh
            </button>
          )}
        </div>

        {/* ===== DASHBOARD ===== */}
        {activeTab === "dashboard" && (
          <>
            {/* STATS CARDS — now use REAL totals */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {[
                {
                  icon: Gamepad2,
                  label: "Total Games",
                  value: stats.totalGames.toLocaleString(),
                  color: "var(--accent)",
                },
                {
                  icon: Users,
                  label: "Users",
                  value: stats.totalUsers.toLocaleString(),
                  color: "#00c853",
                },
                {
                  icon: ShoppingBag,
                  label: "Orders",
                  value: stats.totalOrders.toLocaleString(),
                  color: "#ffc107",
                },
                {
                  icon: DollarSign,
                  label: "Revenue",
                  value: `$${Number(stats.revenue).toLocaleString()}`,
                  color: "#e94560",
                },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  style={{
                    background: "#111118",
                    borderRadius: 10,
                    padding: 18,
                    border: "1px solid #1a1a2e",
                  }}
                >
                  <Icon size={18} color={color} style={{ marginBottom: 10 }} />
                  <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
                    {value}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#666",
                      marginTop: 2,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {/* REVENUE CHART */}
              <div
                style={{
                  background: "#111118",
                  borderRadius: 10,
                  padding: 20,
                  border: "1px solid #1a1a2e",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      Revenue ({new Date().getFullYear()})
                    </h3>
                    <p style={{ fontSize: 10, color: "#666" }}>
                      Total:{" "}
                      <span style={{ color: "#4caf50", fontWeight: 600 }}>
                        ${Number(stats.revenue).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div style={{ fontSize: 10, color: "#666" }}>
                    Peak:{" "}
                    <span style={{ color: "#fff", fontWeight: 600 }}>
                      ${maxRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 6,
                    height: 160,
                  }}
                >
                  {monthlyRevenue.map((item, i) => {
                    const heightPercent = Math.max(
                      (item.value / displayMax) * 100,
                      6,
                    );
                    const isCurrent = i === currentMonthIdx;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 6,
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: -34,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#1a1a2e",
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 600,
                            opacity: 0,
                            pointerEvents: "none",
                            transition: "opacity 0.2s",
                            whiteSpace: "nowrap",
                            zIndex: 10,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                          }}
                          className="bar-tooltip"
                        >
                          ${item.value.toLocaleString()} • {item.count} order
                          {item.count !== 1 ? "s" : ""}
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: `${Math.max(heightPercent, 2)}%`,
                            minHeight: 4,
                            background: isCurrent
                              ? "linear-gradient(180deg, #4fc3f7 0%, var(--accent) 100%)"
                              : "var(--accent)",
                            borderRadius: "4px 4px 0 0",
                            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            opacity: item.value === 0 ? 0.35 : 1,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(180deg, #4fc3f7 0%, var(--accent) 100%)";
                            e.currentTarget.style.transform = "scaleY(1.05)";
                            e.currentTarget.style.transformOrigin = "bottom";
                            const shine =
                              e.currentTarget.querySelector(".shine");
                            const tip =
                              e.currentTarget.parentElement.querySelector(
                                ".bar-tooltip",
                              );
                            if (shine) shine.style.opacity = 1;
                            if (tip) tip.style.opacity = 1;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isCurrent
                              ? "linear-gradient(180deg, #4fc3f7 0%, var(--accent) 100%)"
                              : "var(--accent)";
                            e.currentTarget.style.transform = "scaleY(1)";
                            const shine =
                              e.currentTarget.querySelector(".shine");
                            const tip =
                              e.currentTarget.parentElement.querySelector(
                                ".bar-tooltip",
                              );
                            if (shine) shine.style.opacity = 0;
                            if (tip) tip.style.opacity = 0;
                          }}
                        >
                          <div
                            className="shine"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "40%",
                              background:
                                "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
                              borderRadius: "4px 4px 0 0",
                              opacity: 0,
                              transition: "opacity 0.3s",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 9,
                            color: isCurrent ? "#fff" : "#555",
                            fontWeight: isCurrent ? 700 : 400,
                          }}
                        >
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RECENT ORDERS — from allOrders, not from paginated list */}
              <div
                style={{
                  background: "#111118",
                  borderRadius: 10,
                  padding: 20,
                  border: "1px solid #1a1a2e",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--accent)",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    View all →
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    maxHeight: 240,
                    overflowY: "auto",
                  }}
                >
                  {recentOrders.map((o) => (
                    <div
                      key={o.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 10px",
                        borderRadius: 6,
                        background: "#0a0a10",
                        fontSize: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background:
                              o.status === "Completed"
                                ? "#4caf50"
                                : o.status === "Cancelled"
                                  ? "#e94560"
                                  : o.status === "Refunded"
                                    ? "#ff9800"
                                    : "#ffc107",
                          }}
                        />
                        <span style={{ color: "#fff", fontWeight: 500 }}>
                          #{o.id}
                        </span>
                        <span style={{ color: "#666" }}>User #{o.userId}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <span style={{ color: "#888", fontSize: 10 }}>
                          {o.orderDate
                            ? new Date(o.orderDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )
                            : "-"}
                        </span>
                        <span style={{ color: "#4caf50", fontWeight: 600 }}>
                          ${o.totalAmount?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {recentOrders.length === 0 && (
                    <p
                      style={{
                        color: "#666",
                        textAlign: "center",
                        padding: 12,
                        fontSize: 12,
                      }}
                    >
                      No orders yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===== GAMES TAB ===== */}
        {activeTab === "games" && (
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
                placeholder="Search by Title or Developer..."
                value={gameSearch.keyword}
                onChange={(e) =>
                  setGameSearch({ ...gameSearch, keyword: e.target.value })
                }
                style={{
                  padding: "7px 12px",
                  background: "#111118",
                  border: "1px solid #1a1a2e",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: 12,
                  outline: "none",
                  flex: 1,
                  maxWidth: 220,
                }}
              />
              <select
                value={gameSearch.genreId}
                onChange={(e) =>
                  setGameSearch({ ...gameSearch, genreId: e.target.value })
                }
                style={{
                  padding: "7px 12px",
                  background: "#111118",
                  border: "1px solid #1a1a2e",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: 12,
                  outline: "none",
                }}
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  color: "#888",
                  fontSize: 12,
                }}
              >
                Max Price: $
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={gameSearch.maxPrice}
                  onChange={(e) =>
                    setGameSearch({ ...gameSearch, maxPrice: e.target.value })
                  }
                  style={{
                    width: 60,
                    padding: "7px 12px",
                    background: "#111118",
                    border: "1px solid #1a1a2e",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: 12,
                    outline: "none",
                  }}
                  placeholder="Any"
                />
              </div>
              {(gameSearch.keyword ||
                gameSearch.genreId ||
                gameSearch.maxPrice) && (
                <button
                  onClick={() =>
                    setGameSearch({ keyword: "", genreId: "", maxPrice: "" })
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
                  <X size={12} /> Clear
                </button>
              )}
              <button
                onClick={() => {
                  setEditingGame(null);
                  setShowGameForm(true);
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
                <Plus size={14} /> Add Game
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
                    <Th field="id" sort={gameSort} setSort={setGameSort}>
                      #
                    </Th>
                    <Th field="title" sort={gameSort} setSort={setGameSort}>
                      Title
                    </Th>
                    <Th field="developer" sort={gameSort} setSort={setGameSort}>
                      Developer
                    </Th>
                    <Th field="price" sort={gameSort} setSort={setGameSort}>
                      Price
                    </Th>
                    <th style={thStyle}>Sale</th>
                    <Th field="rating" sort={gameSort} setSort={setGameSort}>
                      Rating
                    </Th>
                    <Th
                      field="totalSales"
                      sort={gameSort}
                      setSort={setGameSort}
                    >
                      Sales
                    </Th>
                    <th style={{ ...thStyle, cursor: "default" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedGames.map((game) => (
                    <tr
                      key={game.id}
                      style={{ borderBottom: "1px solid #1a1a1a" }}
                    >
                      <td style={{ padding: "9px 14px", color: "#555" }}>
                        #{game.id}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      >
                        {game.title}
                      </td>
                      <td style={{ padding: "9px 14px", color: "#888" }}>
                        {game.developer?.substring(0, 18)}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          color: "#4caf50",
                          fontWeight: 600,
                        }}
                      >
                        ${game.price?.toFixed(2)}
                      </td>
                      <td style={{ padding: "9px 14px" }}>
                        {game.discountPrice ? (
                          <span
                            style={{
                              background: "#0078f220",
                              color: "#0078f2",
                              padding: "2px 7px",
                              borderRadius: 8,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            -
                            {Math.round(
                              (1 - game.discountPrice / game.price) * 100,
                            )}
                            %
                          </span>
                        ) : (
                          <span style={{ color: "#555" }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: "9px 14px" }}>
                        ⭐ {game.rating?.toFixed(1)}
                      </td>
                      <td style={{ padding: "9px 14px", color: "#888" }}>
                        {game.totalSales?.toLocaleString()}
                      </td>
                      <td
                        style={{ padding: "9px 14px", display: "flex", gap: 5 }}
                      >
                        <button
                          onClick={() => {
                            setEditingGame(game);
                            setShowGameForm(true);
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
                          onClick={() => setShowDeleteConfirm(game)}
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
                  {sortedGames.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          padding: 20,
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        No games found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination
                page={gamesPage}
                totalPages={gamesTotalPages}
                totalItems={gamesTotal}
                pageSize={gamesPageSize}
                setPage={setGamesPage}
                setPageSize={setGamesPageSize}
              />
            </div>
          </div>
        )}

        {/* ===== USERS TAB ===== */}
        {activeTab === "users" && (
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
                  <Th field="id" sort={userSort} setSort={setUserSort}>
                    #
                  </Th>
                  <Th field="username" sort={userSort} setSort={setUserSort}>
                    Username
                  </Th>
                  <Th field="displayName" sort={userSort} setSort={setUserSort}>
                    Name
                  </Th>
                  <Th field="email" sort={userSort} setSort={setUserSort}>
                    Email
                  </Th>
                  <Th field="wallet" sort={userSort} setSort={setUserSort}>
                    Wallet
                  </Th>
                  <th style={{ ...thStyle, cursor: "default" }}>Status</th>
                  <Th field="createdAt" sort={userSort} setSort={setUserSort}>
                    Joined
                  </Th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((u) => (
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
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
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
                          {u.isActive ? "Active" : "Banned"}
                        </span>
                      </span>
                    </td>
                    <td style={{ padding: "9px 14px", color: "#888" }}>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
                {sortedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      No users found
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
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === "orders" && (
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
                placeholder="Search Username or Order ID"
                value={orderSearch.keyword}
                onChange={(e) =>
                  setOrderSearch({ ...orderSearch, keyword: e.target.value })
                }
                style={{
                  padding: "7px 12px",
                  background: "#111118",
                  border: "1px solid #1a1a2e",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: 12,
                  outline: "none",
                  flex: 1,
                  maxWidth: 220,
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  color: "#888",
                  fontSize: 12,
                }}
              >
                From:{" "}
                <input
                  type="date"
                  value={orderSearch.fromDate}
                  onChange={(e) =>
                    setOrderSearch({ ...orderSearch, fromDate: e.target.value })
                  }
                  style={{
                    padding: "7px 12px",
                    background: "#111118",
                    border: "1px solid #1a1a2e",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: 12,
                    outline: "none",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  color: "#888",
                  fontSize: 12,
                }}
              >
                To:{" "}
                <input
                  type="date"
                  value={orderSearch.toDate}
                  onChange={(e) =>
                    setOrderSearch({ ...orderSearch, toDate: e.target.value })
                  }
                  style={{
                    padding: "7px 12px",
                    background: "#111118",
                    border: "1px solid #1a1a2e",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: 12,
                    outline: "none",
                  }}
                />
              </div>
              <select
                value={orderSearch.status}
                onChange={(e) =>
                  setOrderSearch({ ...orderSearch, status: e.target.value })
                }
                style={{
                  padding: "7px 12px",
                  background: "#111118",
                  border: "1px solid #1a1a2e",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: 12,
                  outline: "none",
                }}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
              {(orderSearch.keyword ||
                orderSearch.fromDate ||
                orderSearch.toDate ||
                orderSearch.status) && (
                <button
                  onClick={() =>
                    setOrderSearch({
                      keyword: "",
                      fromDate: "",
                      toDate: "",
                      status: "",
                    })
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
                  <X size={12} /> Clear
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
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ background: "#0a0a10" }}>
                    <Th field="id" sort={orderSort} setSort={setOrderSort}>
                      #
                    </Th>
                    <Th field="userId" sort={orderSort} setSort={setOrderSort}>
                      User
                    </Th>
                    <Th
                      field="totalAmount"
                      sort={orderSort}
                      setSort={setOrderSort}
                    >
                      Total
                    </Th>
                    <Th field="status" sort={orderSort} setSort={setOrderSort}>
                      Status
                    </Th>
                    <Th
                      field="paymentMethod"
                      sort={orderSort}
                      setSort={setOrderSort}
                    >
                      Method
                    </Th>
                    <Th
                      field="orderDate"
                      sort={orderSort}
                      setSort={setOrderSort}
                    >
                      Date
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((o) => (
                    <tr
                      key={o.id}
                      style={{ borderBottom: "1px solid #1a1a1a" }}
                    >
                      <td style={{ padding: "9px 14px", color: "#555" }}>
                        #{o.id}
                      </td>
                      <td style={{ padding: "9px 14px", color: "#fff" }}>
                        {o.username
                          ? `${o.username} (#${o.userId})`
                          : `User #${o.userId}`}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          color: "#4caf50",
                          fontWeight: 600,
                        }}
                      >
                        ${o.totalAmount?.toFixed(2)}
                      </td>
                      <td style={{ padding: "9px 14px" }}>
                        <select
                          value={o.status}
                          onChange={async (e) => {
                            try {
                              await api.put(`/orders/${o.id}/status`, {
                                status: e.target.value,
                              });
                              await loadOrders();
                              if (activeTab === "dashboard") loadDashboard();
                            } catch {
                              alert("Failed to update status");
                            }
                          }}
                          style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontSize: 11,
                            background: "#0a0a10",
                            color:
                              o.status === "Completed"
                                ? "#4caf50"
                                : o.status === "Cancelled"
                                  ? "#e94560"
                                  : o.status === "Refunded"
                                    ? "#ff9800"
                                    : "#2196f3",
                            border: "1px solid #1a1a2e",
                            cursor: "pointer",
                            outline: "none",
                            fontWeight: 600,
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>
                      <td style={{ padding: "9px 14px", color: "#888" }}>
                        {o.paymentMethod || "Wallet"}
                      </td>
                      <td style={{ padding: "9px 14px", color: "#888" }}>
                        {o.orderDate
                          ? new Date(o.orderDate).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  {sortedOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          padding: 20,
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination
                page={ordersPage}
                totalPages={ordersTotalPages}
                totalItems={ordersTotal}
                pageSize={ordersPageSize}
                setPage={setOrdersPage}
                setPageSize={setOrdersPageSize}
              />
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showGameForm && (
        <GameFormModal
          game={editingGame}
          onClose={() => {
            setShowGameForm(false);
            setEditingGame(null);
          }}
          onSave={() => {
            setShowGameForm(false);
            setEditingGame(null);
            loadGames();
            loadDashboard();
          }}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          game={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            setShowDeleteConfirm(null);
            loadGames();
            loadDashboard();
          }}
        />
      )}
    </div>
  );
}
