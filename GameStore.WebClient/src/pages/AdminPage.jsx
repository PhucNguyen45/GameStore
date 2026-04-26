import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
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
  Star,
  Eye,
  LogOut,
  BarChart3,
  PieChart,
  Crown,
  LayoutDashboard,
  Package,
  ArrowUp,
  ArrowDown,
  Search,
  X,
} from "lucide-react";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loadingData, setLoadingData] = useState(true);

  // Sort states
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [gameSortField, setGameSortField] = useState("id");
  const [gameSortDir, setGameSortDir] = useState("asc");
  const [userSortField, setUserSortField] = useState("id");
  const [userSortDir, setUserSortDir] = useState("asc");
  const [orderSortField, setOrderSortField] = useState("id");
  const [orderSortDir, setOrderSortDir] = useState("asc");

  // Search
  const [gameSearch, setGameSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, usersRes, ordersRes] = await Promise.all([
          gameAPI.getAll({ pageSize: 100 }),
          api
            .get("/users")
            .catch(() => ({ data: { data: [], totalCount: 0 } })),
          api.get("/orders/all").catch(() => ({ data: [] })),
        ]);

        setGames(gamesRes.data?.data || []);

        const usersData = usersRes.data?.data || [];
        setUsers(usersData);

        const ordersData = ordersRes.data || [];
        setOrders(ordersData);

        const totalRevenue = ordersData.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0,
        );
        setStats({
          users: usersRes.data?.totalCount || usersData.length,
          orders: ordersData.length,
          revenue: totalRevenue.toFixed(2),
        });
      } catch (e) {
        console.error("Failed to load admin data:", e);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Sort helper
  const handleSort = (field, currentField, currentDir, setField, setDir) => {
    if (currentField === field) {
      setDir(currentDir === "asc" ? "desc" : "asc");
    } else {
      setField(field);
      setDir("asc");
    }
  };

  const sortData = (data, field, dir) => {
    return [...data].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (dir === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  };

  const sortedGames = sortData(
    games.filter((g) =>
      g.title?.toLowerCase().includes(gameSearch.toLowerCase()),
    ),
    gameSortField,
    gameSortDir,
  );
  const sortedUsers = sortData(users, userSortField, userSortDir);
  const sortedOrders = sortData(orders, orderSortField, orderSortDir);

  const SortIcon = ({ field, currentField, currentDir }) => {
    if (field !== currentField) return null;
    return currentDir === "asc" ? (
      <ArrowUp size={10} />
    ) : (
      <ArrowDown size={10} />
    );
  };

  const Th = ({
    field,
    currentField,
    setField,
    currentDir,
    setDir,
    children,
    ...props
  }) => (
    <th
      onClick={() =>
        handleSort(field, currentField, currentDir, setField, setDir)
      }
      style={{ ...props, cursor: "pointer", userSelect: "none" }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {children}
        <SortIcon
          field={field}
          currentField={currentField}
          currentDir={currentDir}
        />
      </span>
    </th>
  );

  if (loading)
    return (
      <div style={{ padding: 80, textAlign: "center", color: "#888" }}>
        Loading...
      </div>
    );
  if (!isAdmin) return <Navigate to="/" />;

  const thStyle = {
    textAlign: "left",
    padding: "12px 14px",
    color: "#888",
    textTransform: "uppercase",
    fontSize: 10,
    letterSpacing: 1,
    borderBottom: "1px solid #2a2a2a",
    transition: "color 0.2s",
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* TOP BAR */}
      <div className="glass" style={{ padding: "0 40px" }}>
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Crown size={20} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>
              ADMIN DASHBOARD
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 13,
            }}
          >
            <span style={{ color: "#888" }}>
              {user?.displayName || user?.username}
            </span>
            <Link
              to="/"
              style={{
                color: "#888",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Eye size={14} /> View Store
            </Link>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--danger)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 40px" }}>
        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 24,
            background: "#1a1a1a",
            borderRadius: 4,
            padding: 2,
            width: "fit-content",
          }}
        >
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "games", label: "Games", icon: Gamepad2 },
            { id: "users", label: "Users", icon: Users },
            { id: "orders", label: "Orders", icon: ShoppingBag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 20px",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                background:
                  activeTab === tab.id ? "var(--accent)" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#888",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
                marginBottom: 24,
              }}
            >
              {[
                {
                  icon: Gamepad2,
                  label: "TOTAL GAMES",
                  value: games.length,
                  color: "var(--accent)",
                },
                {
                  icon: Users,
                  label: "TOTAL USERS",
                  value: stats.users,
                  color: "#00c853",
                },
                {
                  icon: ShoppingBag,
                  label: "TOTAL ORDERS",
                  value: stats.orders,
                  color: "#ffc107",
                },
                {
                  icon: DollarSign,
                  label: "REVENUE",
                  value: `$${stats.revenue}`,
                  color: "#ff3d00",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#1a1a1a",
                    borderRadius: 8,
                    padding: 20,
                    border: "1px solid #2a2a2a",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#888",
                          marginBottom: 6,
                          letterSpacing: 1,
                        }}
                      >
                        {stat.label}
                      </p>
                      <p
                        style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon size={20} color={stat.color} />
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 14,
              }}
            >
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: 8,
                  padding: 24,
                  border: "1px solid #2a2a2a",
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <BarChart3 size={16} color="var(--accent)" /> MONTHLY SALES
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    height: 120,
                  }}
                >
                  {[35, 55, 40, 70, 50, 80, 65, 75, 85, 55, 60, 45].map(
                    (h, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <div
                          style={{
                            height: `${h}%`,
                            background: "var(--accent)",
                            borderRadius: "2px 2px 0 0",
                            minHeight: 8,
                          }}
                        />
                        <span
                          style={{ fontSize: 9, color: "#666", marginTop: 4 }}
                        >
                          {
                            [
                              "J",
                              "F",
                              "M",
                              "A",
                              "M",
                              "J",
                              "J",
                              "A",
                              "S",
                              "O",
                              "N",
                              "D",
                            ][i]
                          }
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: 8,
                  padding: 24,
                  border: "1px solid #2a2a2a",
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <PieChart size={16} color="var(--accent)" /> TOP GENRES
                </h3>
                {[
                  { name: "Action", pct: 35 },
                  { name: "RPG", pct: 25 },
                  { name: "Adventure", pct: 20 },
                  { name: "FPS", pct: 12 },
                  { name: "Indie", pct: 8 },
                ].map((g) => (
                  <div
                    key={g.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 4,
                        background: "#333",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${g.pct}%`,
                          height: "100%",
                          background: "var(--accent)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: "#888", minWidth: 60 }}>
                      {g.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#fff",
                        fontWeight: 600,
                        minWidth: 30,
                      }}
                    >
                      {g.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* GAMES TAB */}
        {activeTab === "games" && (
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: 8,
              border: "1px solid #2a2a2a",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #2a2a2a",
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>
                🎮 Games ({sortedGames.length})
              </h3>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <Search
                    size={14}
                    color="#888"
                    style={{ position: "absolute", left: 8, top: 8 }}
                  />
                  <input
                    placeholder="Search games..."
                    value={gameSearch}
                    onChange={(e) => setGameSearch(e.target.value)}
                    style={{
                      padding: "6px 12px 6px 28px",
                      background: "#2a2a2a",
                      border: "1px solid #444",
                      borderRadius: 4,
                      color: "#fff",
                      fontSize: 12,
                      width: 180,
                      outline: "none",
                    }}
                  />
                  {gameSearch && (
                    <button
                      onClick={() => setGameSearch("")}
                      style={{
                        position: "absolute",
                        right: 6,
                        top: 6,
                        background: "none",
                        border: "none",
                        color: "#888",
                        cursor: "pointer",
                      }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                <button
                  className="btn-primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    fontSize: 12,
                  }}
                >
                  <Plus size={14} /> Add Game
                </button>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
                    <Th
                      field="id"
                      currentField={gameSortField}
                      setField={setGameSortField}
                      currentDir={gameSortDir}
                      setDir={setGameSortDir}
                      style={thStyle}
                    >
                      ID
                    </Th>
                    <Th
                      field="title"
                      currentField={gameSortField}
                      setField={setGameSortField}
                      currentDir={gameSortDir}
                      setDir={setGameSortDir}
                      style={thStyle}
                    >
                      TITLE
                    </Th>
                    <Th
                      field="developer"
                      currentField={gameSortField}
                      setField={setGameSortField}
                      currentDir={gameSortDir}
                      setDir={setGameSortDir}
                      style={thStyle}
                    >
                      DEVELOPER
                    </Th>
                    <Th
                      field="price"
                      currentField={gameSortField}
                      setField={setGameSortField}
                      currentDir={gameSortDir}
                      setDir={setGameSortDir}
                      style={thStyle}
                    >
                      PRICE
                    </Th>
                    <th style={thStyle}>DISCOUNT</th>
                    <Th
                      field="rating"
                      currentField={gameSortField}
                      setField={setGameSortField}
                      currentDir={gameSortDir}
                      setDir={setGameSortDir}
                      style={thStyle}
                    >
                      RATING
                    </Th>
                    <Th
                      field="totalSales"
                      currentField={gameSortField}
                      setField={setGameSortField}
                      currentDir={gameSortDir}
                      setDir={setGameSortDir}
                      style={thStyle}
                    >
                      SALES
                    </Th>
                    <th style={thStyle}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedGames.map((game) => (
                    <tr
                      key={game.id}
                      style={{ borderBottom: "1px solid #222" }}
                    >
                      <td style={{ padding: "10px 14px", color: "#666" }}>
                        #{game.id}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      >
                        {game.title}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#888" }}>
                        {game.developer?.substring(0, 20)}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        ${game.price?.toFixed(2)}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        {game.discountPrice ? (
                          <span
                            style={{
                              background: "var(--accent)",
                              color: "#fff",
                              padding: "2px 6px",
                              borderRadius: 2,
                              fontSize: 11,
                            }}
                          >
                            -
                            {Math.round(
                              (1 - game.discountPrice / game.price) * 100,
                            )}
                            %
                          </span>
                        ) : (
                          <span style={{ color: "#666" }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#ffd700" }}>
                        ⭐ {game.rating?.toFixed(1)}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#888" }}>
                        {game.totalSales?.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          display: "flex",
                          gap: 6,
                        }}
                      >
                        <button
                          style={{
                            padding: "5px 8px",
                            background: "#2a2a2a",
                            border: "none",
                            borderRadius: 2,
                            cursor: "pointer",
                          }}
                        >
                          <Edit size={12} color="var(--accent)" />
                        </button>
                        <button
                          style={{
                            padding: "5px 8px",
                            background: "#2a2a2a",
                            border: "none",
                            borderRadius: 2,
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={12} color="var(--danger)" />
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
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: 8,
              border: "1px solid #2a2a2a",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #2a2a2a",
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>
                👥 Users ({sortedUsers.length})
              </h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
                    <Th
                      field="id"
                      currentField={userSortField}
                      setField={setUserSortField}
                      currentDir={userSortDir}
                      setDir={setUserSortDir}
                      style={thStyle}
                    >
                      ID
                    </Th>
                    <Th
                      field="username"
                      currentField={userSortField}
                      setField={setUserSortField}
                      currentDir={userSortDir}
                      setDir={setUserSortDir}
                      style={thStyle}
                    >
                      USERNAME
                    </Th>
                    <Th
                      field="displayName"
                      currentField={userSortField}
                      setField={setUserSortField}
                      currentDir={userSortDir}
                      setDir={setUserSortDir}
                      style={thStyle}
                    >
                      DISPLAY NAME
                    </Th>
                    <Th
                      field="email"
                      currentField={userSortField}
                      setField={setUserSortField}
                      currentDir={userSortDir}
                      setDir={setUserSortDir}
                      style={thStyle}
                    >
                      EMAIL
                    </Th>
                    <Th
                      field="wallet"
                      currentField={userSortField}
                      setField={setUserSortField}
                      currentDir={userSortDir}
                      setDir={setUserSortDir}
                      style={thStyle}
                    >
                      WALLET
                    </Th>
                    <Th
                      field="createdAt"
                      currentField={userSortField}
                      setField={setUserSortField}
                      currentDir={userSortDir}
                      setDir={setUserSortDir}
                      style={thStyle}
                    >
                      JOINED
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #222" }}>
                      <td style={{ padding: "10px 14px", color: "#666" }}>
                        #{u.id}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      >
                        {u.username}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#ccc" }}>
                        {u.displayName || "-"}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#888" }}>
                        {u.email || "-"}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          color: "#4caf50",
                          fontWeight: 600,
                        }}
                      >
                        ${u.wallet?.toFixed(2)}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#888" }}>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: 8,
              border: "1px solid #2a2a2a",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #2a2a2a",
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>
                📦 Orders ({sortedOrders.length})
              </h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
                    <Th
                      field="id"
                      currentField={orderSortField}
                      setField={setOrderSortField}
                      currentDir={orderSortDir}
                      setDir={setOrderSortDir}
                      style={thStyle}
                    >
                      ID
                    </Th>
                    <Th
                      field="userId"
                      currentField={orderSortField}
                      setField={setOrderSortField}
                      currentDir={orderSortDir}
                      setDir={setOrderSortDir}
                      style={thStyle}
                    >
                      USER ID
                    </Th>
                    <Th
                      field="totalAmount"
                      currentField={orderSortField}
                      setField={setOrderSortField}
                      currentDir={orderSortDir}
                      setDir={setOrderSortDir}
                      style={thStyle}
                    >
                      TOTAL
                    </Th>
                    <Th
                      field="status"
                      currentField={orderSortField}
                      setField={setOrderSortField}
                      currentDir={orderSortDir}
                      setDir={setOrderSortDir}
                      style={thStyle}
                    >
                      STATUS
                    </Th>
                    <Th
                      field="orderDate"
                      currentField={orderSortField}
                      setField={setOrderSortField}
                      currentDir={orderSortDir}
                      setDir={setOrderSortDir}
                      style={thStyle}
                    >
                      DATE
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #222" }}>
                      <td style={{ padding: "10px 14px", color: "#666" }}>
                        #{o.id}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#fff" }}>
                        #{o.userId}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          color: "#4caf50",
                          fontWeight: 600,
                        }}
                      >
                        ${o.totalAmount?.toFixed(2)}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 2,
                            fontSize: 11,
                            fontWeight: 600,
                            background:
                              o.status === "Completed"
                                ? "#4caf5020"
                                : o.status === "Cancelled"
                                  ? "#ff3d0020"
                                  : "#ffc10720",
                            color:
                              o.status === "Completed"
                                ? "#4caf50"
                                : o.status === "Cancelled"
                                  ? "#ff3d00"
                                  : "#ffc107",
                          }}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#888" }}>
                        {o.orderDate
                          ? new Date(o.orderDate).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
