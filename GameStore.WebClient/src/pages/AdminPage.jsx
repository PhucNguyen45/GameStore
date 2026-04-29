import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { gameAPI } from "../services/api";
import api from "../services/api";
import { Gamepad2, Users, ShoppingBag, DollarSign, Plus, Edit, Trash2, Star, ArrowUp, ArrowDown, Search, X, Package, CheckCircle, XCircle, AlertCircle, LayoutDashboard, } from "lucide-react";

const thStyle = { textAlign: "left", padding: "12px 14px", color: "#888", textTransform: "uppercase", fontSize: 10, fontWeight: 700, letterSpacing: 1, borderBottom: "2px solid #1a1a2e", cursor: "pointer", userSelect: "none", transition: "color 0.2s",};

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
        releaseDate: new Date(form.releaseDate).toISOString(),
      };
      if (game) {
        await gameAPI.update(game.id, data);
      } else {
        await gameAPI.create(data);
      }
      onSave();
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: "100%", padding: "8px 12px", background: "#0a0a10", border: "1px solid #1a1a2e", borderRadius: 6, color: "#fff", fontSize: 13, outline: "none", };

  return (
    <div
      style={{position: "fixed",inset: 0,background: "rgba(0,0,0,0.8)",display: "flex",alignItems: "center",justifyContent: "center",zIndex: 9999,}}
      onClick={onClose}
    >
      <div
        style={{background: "#111118",borderRadius: 12,padding: 30,width: 600,maxHeight: "90vh",overflow: "auto",border: "1px solid #1a1a2e",}}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{color: "#fff",marginBottom: 20,fontSize: 18,fontWeight: 700,}}
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
            <input type="number" step="0.01" placeholder="Price *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} required/>
            <input type="number" step="0.01" placeholder="Discount Price" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value }) } style={inputStyle} />
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
            style={{ border: "1px solid #1a1a2e", borderRadius: 6, padding: 12, }}
          >
            <legend style={{ color: "#888", fontSize: 12, padding: "0 8px" }}>
              System Requirements
            </legend>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, }}
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
            style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8, }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "8px 20px", background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer",}}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: "8px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, }}
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
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, }}
      onClick={onClose}
    >
      <div
        style={{ background: "#111118", borderRadius: 12, padding: 30, width: 400, textAlign: "center", border: "1px solid #e94560",}}
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
            style={{ padding: "8px 20px", background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer",}}
          >
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting} style={{ padding: "8px 20px", background: "#e94560", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600,}}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [activeTab, setActiveTab] = useState("dashboard");

  const [gameSort, setGameSort] = useState({ field: "id", dir: "asc" });
  const [userSort, setUserSort] = useState({ field: "id", dir: "asc" });
  const [orderSort, setOrderSort] = useState({ field: "id", dir: "asc" });
  const [gameSearch, setGameSearch] = useState("");
  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gRes, uRes, oRes] = await Promise.all([
        gameAPI.getAll({ pageSize: 200 }),
        api.get("/users").catch(() => ({ data: { data: [], totalCount: 0 } })),
        api.get("/orders/all").catch(() => ({ data: [] })),
      ]);
      setGames(gRes.data?.data || []);
      setUsers(uRes.data?.data || []);

      const ordersData = oRes.data || [];
      setOrders(ordersData);

      const totalRevenue = ordersData.reduce(
        (s, o) => s + (o.totalAmount || 0),
        0,
      );
      setStats({
        users: uRes.data?.totalCount || uRes.data?.data?.length || 0,
        orders: ordersData.length,
        revenue: totalRevenue.toFixed(2),
      });

      // Tính doanh thu theo tháng từ orders thật
      const monthlyData = calculateMonthlyRevenue(ordersData);
      setMonthlyRevenue(monthlyData);
    } catch (e) {
      console.error(e);
    }
  };

  const calculateMonthlyRevenue = (ordersData) => {
    const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ];
    const currentYear = new Date().getFullYear();
    const monthlyMap = {};

    months.forEach((m, i) => { monthlyMap[i] = { month: m, value: 0, count: 0 }; });

    ordersData.forEach((order) => {
      if (order.status === "Completed" && order.orderDate) {
        const date = new Date(order.orderDate);
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          monthlyMap[monthIndex].value += order.totalAmount || 0;
          monthlyMap[monthIndex].count += 1;
        }
      }
    });

    // Trả về dữ liệu thật
    return Object.values(monthlyMap).map((m) => ({
      ...m,
      value: Math.round(m.value),
    }));
  };

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

  const toggleSort = (field, current, setter) => {
    setter({
      field,
      dir: current.field === field && current.dir === "asc" ? "desc" : "asc",
    });
  };

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

  if (loading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg-primary)", color: "#888", }}
      >
        Loading...
      </div>
    );
  if (!isAdmin) return <Navigate to="/" />;

  const sortedGames = sortFn(
    games.filter((g) =>
      g.title?.toLowerCase().includes(gameSearch.toLowerCase()),
    ),
    gameSort.field,
    gameSort.dir,
  );
  const sortedUsers = sortFn(users, userSort.field, userSort.dir);
  const sortedOrders = sortFn(orders, orderSort.field, orderSort.dir);
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1);
  const displayMax = maxRevenue > 0 ? maxRevenue : 100;

  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "games", icon: Gamepad2, label: "Games" },
    { id: "users", icon: Users, label: "Users" },
    { id: "orders", icon: Package, label: "Orders" },
  ];

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)", }}
    >
      {/* SIDEBAR */}
      <div
        style={{ width: 200, background: "#0d0d14", borderRight: "1px solid #1a1a2e", padding: "20px 0", flexShrink: 0, height: "100vh", position: "sticky", top: 0, }}
      >
        <div style={{ padding: "0 16px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{ width: 28, height: 28, borderRadius: 6, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", }}
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
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: activeTab === id ? "var(--accent)" : "transparent", color: activeTab === id ? "#fff" : "#888", textAlign: "left", transition: "all 0.15s", width: "100%", }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
        </div>

        {/* ===== DASHBOARD ===== */}
        {activeTab === "dashboard" && (
          <>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24, }}
            >
              {[
                { icon: Gamepad2, label: "Total Games", value: games.length, color: "var(--accent)", },
                { icon: Users, label: "Users", value: stats.users, color: "#00c853", },
                { icon: ShoppingBag, label: "Orders", value: stats.orders, color: "#ffc107",},
                { icon: DollarSign, label: "Revenue", value: `$${Number(stats.revenue).toLocaleString()}`, color: "#e94560",},
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  style={{ background: "#111118", borderRadius: 10, padding: 18, border: "1px solid #1a1a2e", }}
                >
                  <Icon size={18} color={color} style={{ marginBottom: 10 }} />
                  <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
                    {value}
                  </p>
                  <p
                    style={{ fontSize: 11, color: "#666", marginTop: 2, textTransform: "uppercase", letterSpacing: 1, }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, }}
            >
              {/* REVENUE CHART WITH ANIMATION */}
              <div
                style={{ background: "#111118", borderRadius: 10, padding: 20, border: "1px solid #1a1a2e", }}
              >
                <h3
                  style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4, }}
                >
                  Revenue ({new Date().getFullYear()})
                </h3>
                <p style={{ fontSize: 10, color: "#666", marginBottom: 16 }}>
                  Total: ${Number(stats.revenue).toLocaleString()}
                </p>
                <div
                  style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, }}
                >
                  {monthlyRevenue.map((item, i, arr) => {
                    const heightPercent = Math.max(
                      (item.value / displayMax) * 100,
                      6,
                    );
                    return (
                      <div
                        key={i}
                        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative",}}
                      >
                        <div
                          style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", background: "#1a1a2e", color: "#fff", padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, opacity: 0, pointerEvents: "none", transition: "opacity 0.2s", whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.5)", }}
                          className="bar-tooltip"
                        >
                          ${item.value.toLocaleString()}
                        </div>
                        <div
                          style={{ width: "100%", height: `${Math.max(heightPercent, 2)}%`, minHeight: 4, background: "var(--accent)", borderRadius: "4px 4px 0 0", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer", position: "relative", overflow: "hidden", }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(180deg, #4fc3f7 0%, var(--accent) 100%)";
                            e.currentTarget.style.transform = "scaleY(1.05)";
                            e.currentTarget.style.transformOrigin = "bottom";
                            e.currentTarget.querySelector(
                              ".shine",
                            ).style.opacity = 1;
                            e.currentTarget.parentElement.querySelector(
                              ".bar-tooltip",
                            ).style.opacity = 1;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "var(--accent)";
                            e.currentTarget.style.transform = "scaleY(1)";
                            e.currentTarget.querySelector(
                              ".shine",
                            ).style.opacity = 0;
                            e.currentTarget.parentElement.querySelector(
                              ".bar-tooltip",
                            ).style.opacity = 0;
                          }}
                        >
                          <div
                            className="shine"
                            style={{position: "absolute",top: 0,left: 0,right: 0,height: "40%",background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",borderRadius: "4px 4px 0 0",opacity: 0,transition: "opacity 0.3s", }}
                          />
                        </div>
                        <span
                          style={{ fontSize: 9, color: "#555", transition: "color 0.2s", }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                        >
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RECENT ORDERS */}
              <div
                style={{background: "#111118",borderRadius: 10,padding: 20,border: "1px solid #1a1a2e",}}
              >
                <h3
                  style={{fontSize: 13,fontWeight: 600,color: "#fff",marginBottom: 16,}}
                >
                  Recent Orders
                </h3>
                <div
                  style={{display: "flex",flexDirection: "column",gap: 4,maxHeight: 200,overflowY: "auto",}}
                >
                  {sortedOrders.slice(0, 10).map((o) => (
                    <div
                      key={o.id}
                      style={{display: "flex",justifyContent: "space-between",alignItems: "center",padding: "8px 10px",borderRadius: 6,background: "#0a0a10",fontSize: 12,}}
                    >
                      <div
                        style={{display: "flex",alignItems: "center",gap: 8,}}
                      >
                        <div
                          style={{width: 6,height: 6,borderRadius: "50%",background: o.status === "Completed"? "#4caf50": o.status === "Cancelled"? "#e94560": "#ffc107",}}
                        />
                        <span style={{ color: "#fff", fontWeight: 500 }}>
                          #{o.id}
                        </span>
                        <span style={{ color: "#666" }}>User #{o.userId}</span>
                      </div>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: 12, }}
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
                  {sortedOrders.length === 0 && (
                    <p
                      style={{ color: "#666", textAlign: "center", padding: 2 }}
                    >
                      No orders yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* GAMES TAB */}
        {activeTab === "games" && (
          <div>
            <div
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 1 }}
            >
              <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
                <Search
                  size={13}
                  color="#666"
                  style={{ position: "absolute", left: 10, top: 9 }}
                />
                <input
                  placeholder="Search games..."
                  value={gameSearch}
                  onChange={(e) => setGameSearch(e.target.value)}
                  style={{ width: "100%", padding: "7px 12px 7px 30px", background: "#111118", border: "1px solid #1a1a2e", borderRadius: 6, color: "#fff", fontSize: 12, outline: "none", }}
                />
                {gameSearch && (
                  <button
                    onClick={() => setGameSearch("")}
                    style={{ position: "absolute", right: 6, top: 7, background: "none", border: "none", color: "#666", cursor: "pointer", }}
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingGame(null);
                  setShowGameForm(true);
                }}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",}}
              >
                <Plus size={14} /> Add Game
              </button>
            </div>
            <div
              style={{ background: "#111118", borderRadius: 8, border: "1px solid #1a1a2e", overflow: "hidden", }}
            >
              <table
                style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, }}
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
                        style={{ padding: "9px 14px", color: "#fff", fontWeight: 500, }}
                      >
                        {game.title}
                      </td>
                      <td style={{ padding: "9px 14px", color: "#888" }}>
                        {game.developer?.substring(0, 18)}
                      </td>
                      <td
                        style={{ padding: "9px 14px", color: "#4caf50", fontWeight: 600, }}
                      >
                        ${game.price?.toFixed(2)}
                      </td>
                      <td style={{ padding: "9px 14px" }}>
                        {game.discountPrice ? (
                          <span
                            style={{ background: "#0078f220", color: "#0078f2", padding: "2px 7px", borderRadius: 8, fontSize: 10, fontWeight: 600, }}
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
                          style={{padding: "4px 7px",background: "#1a1a2e",border: "none",borderRadius: 4,cursor: "pointer",}}
                        >
                          <Edit size={11} color="#0078f2" />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(game)} style={{padding: "4px 7px",background: "#1a1a2e",border: "none",borderRadius: 4,cursor: "pointer",}}>
                          <Trash2 size={11} color="#e94560" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div style={{background: "#111118",borderRadius: 8,border: "1px solid #1a1a2e",overflow: "hidden",}}>
            <table style={{width: "100%",borderCollapse: "collapse",fontSize: 12,}}>
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
                      style={{ padding: "9px 14px", color: "#fff", fontWeight: 500, }}
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
                      style={{ padding: "9px 14px", color: "#4caf50", fontWeight: 600, }}
                    >
                      ${u.wallet?.toFixed(2) || "0.00"}
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <span
                        style={{ display: "flex", alignItems: "center", gap: 5,}}
                      >
                        <div
                          style={{ width: 7, height: 7, borderRadius: "50%", background: u.isActive ? "#4caf50" : "#e94560", }}
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
              </tbody>
            </table>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div
            style={{background: "#111118",borderRadius: 8,border: "1px solid #1a1a2e",overflow: "hidden",}}>
            <table
              style={{width: "100%",borderCollapse: "collapse",fontSize: 12,}}
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
                  <Th field="orderDate" sort={orderSort} setSort={setOrderSort}>
                    Date
                  </Th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "9px 14px", color: "#555" }}>
                      #{o.id}
                    </td>
                    <td style={{ padding: "9px 14px", color: "#fff" }}>
                      User #{o.userId}
                    </td>
                    <td
                      style={{ padding: "9px 14px", color: "#4caf50", fontWeight: 60 }}
                    >
                      ${o.totalAmount?.toFixed(2)}
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <span
                        style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 600, background: o.status === "Completed" ? "#4caf5020" : "#e9456020", color: o.status === "Completed" ? "#4caf50" : "#e94560",}}
                      >
                        {o.status}
                      </span>
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
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showGameForm && (
        <GameFormModal game={editingGame} onClose={() => {setShowGameForm(false);setEditingGame(null);}}
          onSave={() => {setShowGameForm(false); setEditingGame(null); loadData();}}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmModal game={showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} onConfirm={() => { setShowDeleteConfirm(null); loadData(); }}
        />
      )}
    </div>
  );
}
