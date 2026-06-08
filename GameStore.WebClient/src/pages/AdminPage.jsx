// GameStore.WebClient/src/pages/AdminPage.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { adminAPI } from "../services/api";


import AdminSidebar, { tabs } from "../components/admin/AdminSidebar";
import DashboardTab from "../components/admin/DashboardTab";
import GamesTab from "../components/admin/GamesTab";
import UsersTab from "../components/admin/UsersTab";
import OrdersTab from "../components/admin/OrdersTab";
import CategoriesTab from "../components/admin/CategoriesTab";
import GameKeysTab from "../components/admin/GameKeysTab";
import StaffRolesTab from "../components/admin/StaffRolesTab";
import GameFormModal from "../components/admin/GameFormModal";
import DeleteConfirmModal from "../components/admin/DeleteConfirmModal";
import UserFormModal from "../components/admin/UserFormModal";
import DeleteUserModal from "../components/admin/DeleteUserModal";
import { AdminSkeleton } from "../components/common/PageSkeleton";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();

  // ===== Data lists =====
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // ===== Dashboard global data =====
  const [allOrders, setAllOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [activeTab, setActiveTab] = useState("dashboard");

  // ===== Pagination state =====
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
    minPrice: "",
    maxPrice: "",
  });
  const [userSearch, setUserSearch] = useState({
    keyword: "",
    status: "",
    fromDate: "",
    toDate: "",
  });
  const [genres, setGenres] = useState([]);

  // ===== Sorting =====
  const [gameSort, setGameSort] = useState({ field: "createdAt", dir: "desc" });
  const [userSort, setUserSort] = useState({ field: "createdAt", dir: "desc" });
  const [orderSort, setOrderSort] = useState({
    field: "orderDate",
    dir: "desc",
  });

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
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showUserDeleteConfirm, setShowUserDeleteConfirm] = useState(null);

  const gamesTotalPages = Math.max(1, Math.ceil(gamesTotal / gamesPageSize));
  const usersTotalPages = Math.max(1, Math.ceil(usersTotal / usersPageSize));
  const ordersTotalPages = Math.max(1, Math.ceil(ordersTotal / ordersPageSize));

  // ===== Reset page=1 khi filter hoặc pageSize thay đổi =====
  useEffect(() => {
    setGamesPage(1);
  }, [gameSearch, gamesPageSize, gameSort]);
  useEffect(() => {
    setUsersPage(1);
  }, [usersPageSize, userSearch, userSort]);
  useEffect(() => {
    setOrdersPage(1);
  }, [orderSearch, ordersPageSize, orderSort]);

  // ===== Tính doanh thu theo tháng =====
  const calculateMonthlyRevenue = (ordersData) => {
    const months = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
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

  // ===== Load data =====
  const loadGames = async () => {
    const params = {
      page: gamesPage,
      pageSize: gamesPageSize,
      sortBy: gameSort.field,
      desc: gameSort.dir === "desc",
    };
    if (gameSearch.keyword) params.keyword = gameSearch.keyword;
    if (gameSearch.genreId) params.genreId = gameSearch.genreId;
    if (gameSearch.minPrice) params.minPrice = gameSearch.minPrice;
    if (gameSearch.maxPrice) params.maxPrice = gameSearch.maxPrice;
    try {
      const res = await api.get("/admin/games", { params });
      setGames(res.data?.data || []);
      setGamesTotal(res.data?.totalCount ?? 0);
    } catch {
      setGames([]);
      setGamesTotal(0);
    }
  };

  const loadUsers = async () => {
    const params = {
      page: usersPage,
      pageSize: usersPageSize,
      sortBy: userSort.field,
      desc: userSort.dir === "desc",
    };
    if (userSearch.keyword) params.keyword = userSearch.keyword;
    if (userSearch.status) params.isActive = userSearch.status === "active";
    if (userSearch.fromDate) params.fromDate = userSearch.fromDate;
    if (userSearch.toDate) params.toDate = userSearch.toDate;
    try {
      const res = await api.get("/admin/users", { params });
      setUsers(res.data?.data || []);
      setUsersTotal(res.data?.totalCount ?? 0);
    } catch {
      setUsers([]);
      setUsersTotal(0);
    }
  };

  const loadOrders = async () => {
    const params = {
      page: ordersPage,
      pageSize: ordersPageSize,
      sortBy: orderSort.field,
      desc: orderSort.dir === "desc",
    };
    if (orderSearch.keyword) params.keyword = orderSearch.keyword;
    if (orderSearch.fromDate) params.fromDate = orderSearch.fromDate;
    if (orderSearch.toDate) params.toDate = orderSearch.toDate;
    if (orderSearch.status) params.status = orderSearch.status;
    try {
      const res = await api.get("/admin/orders", { params });
      setOrders(res.data?.data || []);
      setOrdersTotal(res.data?.totalCount ?? 0);
    } catch {
      setOrders([]);
      setOrdersTotal(0);
    }
  };

  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      const dashboard = res.data || {};
      const recentOrders = dashboard.recentOrders || [];
      setAllOrders(recentOrders);
      setStats({
        totalGames: dashboard.totalGames ?? 0,
        totalUsers: dashboard.totalUsers ?? 0,
        totalOrders: dashboard.totalOrders ?? 0,
        revenue: dashboard.totalRevenue ?? 0,
      });
      const months = [
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
      ];
      const monthly = (dashboard.monthlyRevenue || []).map((m, i) => ({
        month: months[i],
        value: Math.round(m.value ?? 0),
        count: m.count ?? 0,
      }));
      setMonthlyRevenue(
        monthly.length === 12 ? monthly : calculateMonthlyRevenue(recentOrders),
      );
    } catch (e) {
      console.error("Lỗi tải bảng:", e);
    }
  };

  // ===== Effects =====
  useEffect(() => {
    const t = setTimeout(loadGames, 300);
    return () => clearTimeout(t);
  }, [gamesPage, gamesPageSize, gameSearch, gameSort]);
  useEffect(() => {
    const t = setTimeout(loadUsers, 300);
    return () => clearTimeout(t);
  }, [usersPage, usersPageSize, userSearch, userSort]);
  useEffect(() => {
    const t = setTimeout(loadOrders, 300);
    return () => clearTimeout(t);
  }, [ordersPage, ordersPageSize, orderSearch, orderSort]);
  useEffect(() => {
    if (activeTab === "dashboard") loadDashboard();
  }, [activeTab]);

  if (loading) return <AdminSkeleton />;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-primary)",
      }}
    >
      <AdminSidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        {activeTab !== "dashboard" && (
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>
        )}

        {activeTab === "dashboard" && (
          <DashboardTab
            stats={stats}
            monthlyRevenue={monthlyRevenue}
            allOrders={allOrders}
            loadDashboard={loadDashboard}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "games" && (
          <GamesTab
            games={games}
            gamesTotal={gamesTotal}
            gamesPage={gamesPage}
            setGamesPage={setGamesPage}
            gamesPageSize={gamesPageSize}
            setGamesPageSize={setGamesPageSize}
            gamesTotalPages={gamesTotalPages}
            gameSearch={gameSearch}
            setGameSearch={setGameSearch}
            gameSort={gameSort}
            setGameSort={setGameSort}
            genres={genres}
            onAdd={() => {
              setEditingGame(null);
              setShowGameForm(true);
            }}
            onEdit={(game) => {
              setEditingGame(game);
              setShowGameForm(true);
            }}
            onDelete={(game) => setShowDeleteConfirm(game)}
          />
        )}

        {activeTab === "users" && (
          <UsersTab
            users={users}
            usersTotal={usersTotal}
            usersPage={usersPage}
            setUsersPage={setUsersPage}
            usersPageSize={usersPageSize}
            setUsersPageSize={setUsersPageSize}
            usersTotalPages={usersTotalPages}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            userSort={userSort}
            setUserSort={setUserSort}
            onEdit={(u) => {
              setEditingUser(u);
              setShowUserForm(true);
            }}
            onDelete={(u) => setShowUserDeleteConfirm(u)}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            ordersTotal={ordersTotal}
            ordersPage={ordersPage}
            setOrdersPage={setOrdersPage}
            ordersPageSize={ordersPageSize}
            setOrdersPageSize={setOrdersPageSize}
            ordersTotalPages={ordersTotalPages}
            orderSearch={orderSearch}
            setOrderSearch={setOrderSearch}
            orderSort={orderSort}
            setOrderSort={setOrderSort}
            loadOrders={loadOrders}
            loadDashboard={loadDashboard}
            activeTab={activeTab}
          />
        )}

        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "gamekeys" && <GameKeysTab />}
        {activeTab === "staffroles" && <StaffRolesTab />}
      </div>

      {showGameForm && (
        <GameFormModal
          game={editingGame}
          genres={genres}
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
      {showUserForm && (
        <UserFormModal
          user={editingUser}
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
          onSave={async (formData) => {
            try {
              if (editingUser)
                await adminAPI.updateUser(editingUser.id, formData);
              toast.success("Cập nhật người dùng thành công!");
              setShowUserForm(false);
              setEditingUser(null);
              loadUsers();
            } catch (e) {
              toast.error(e.response?.data?.message || e.message);
            }
          }}
        />
      )}
      {showUserDeleteConfirm && (
        <DeleteUserModal
          user={showUserDeleteConfirm}
          onClose={() => setShowUserDeleteConfirm(null)}
          onConfirm={() => {
            setShowUserDeleteConfirm(null);
            loadUsers();
            loadDashboard();
          }}
        />
      )}
    </div>
  );
}
