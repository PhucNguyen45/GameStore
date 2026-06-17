// GameStore.WebClient/src/services/api.js
// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      });
      return searchParams.toString();
    },
  },
});

api.interceptors.request.use((c) => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(e);
  },
);

export const authAPI = {
  login: (d) => api.post("/auth/login", d),
  register: (d) => api.post("/auth/register", d),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),
};
export const gameAPI = {
  getFeatured: (n = 12) => api.get("/games/featured", { params: { count: n } }),
  getAll: (p) => api.get("/games", { params: p }),
  getById: (id) => api.get(`/games/${id}`),
  create: (d) => api.post("/admin/games", d), // Admin CRUD
  update: (id, d) => api.put(`/admin/games/${id}`, d),
  delete: (id) => api.delete(`/admin/games/${id}`),
  checkStock: (gameIds) =>
    api.get("/games/stock", { params: { gameIds: gameIds.join(",") } }),
};
export const genreAPI = { getAll: () => api.get("/genres") };
export const orderAPI = {
  create: (d) => api.post("/orders", d),
  getAll: () => api.get("/orders"),
  getHistory: () => api.get("/orders/history"),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};
export const userAPI = {
  getWallet: () => api.get("/users/wallet"),
  topUp: (amount) => api.post("/users/wallet/topup", { amount }),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
};
export const libraryAPI = {
  getMyLibrary: () => api.get("/library"),
  checkOwned: (gameId) => api.get(`/library/check/${gameId}`),
  getGameKeys: (gameId) => api.get(`/library/${gameId}/keys`),
};
export const wishlistAPI = {
  get: () => api.get("/wishlist"),
  add: (gameId) => api.post(`/wishlist/${gameId}`),
  remove: (gameId) => api.delete(`/wishlist/${gameId}`),
  check: (gameId) => api.get(`/wishlist/check/${gameId}`),
};

export const reviewAPI = {
  getByGame: (gameId, page = 1) =>
    api.get(`/reviews/game/${gameId}`, { params: { page, pageSize: 10 } }),
  create: (data) => api.post("/reviews", data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  check: (gameId) => api.get(`/reviews/check/${gameId}`),
};

export const notificationAPI = {
  get: (unread = false) => api.get("/notifications", { params: { unread } }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  // Users
  getUsers: (p) => api.get("/admin/users", { params: p }),
  updateUser: (id, d) => api.put(`/admin/users/${id}`, d),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // Games (admin endpoints, thường dùng chung gameAPI)
  // Categories
  getCategories: (p) => api.get("/admin/categories", { params: p }),
  createCategory: (d) => api.post("/admin/categories", d),
  updateCategory: (id, d) => api.put(`/admin/categories/${id}`, d),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  // Game Keys
  getGameKeys: (p) => api.get("/admin/gamekeys", { params: p }),
  createGameKey: (d) => api.post("/admin/gamekeys", d),
  createBatchGameKeys: (d) => api.post("/admin/gamekeys/batch", d),
  updateGameKey: (id, d) => api.put(`/admin/gamekeys/${id}`, d),
  deleteGameKey: (id) => api.delete(`/admin/gamekeys/${id}`),
  // Orders
  getOrders: (p) => api.get("/admin/orders", { params: p }),
  updateOrderStatus: (id, d) => api.put(`/admin/orders/${id}/status`, d),
  // Payments
  getPayments: (p) => api.get("/admin/payments", { params: p }),
  getOrderPayments: (id) => api.get(`/admin/payments/order/${id}`),
  refundPayment: (id, d) => api.post(`/admin/payments/refund/${id}`, d),
  // Roles
  getRoles: (p) => api.get("/admin/roles", { params: p }),
  createRole: (d) => api.post("/admin/roles", d),
  updateRole: (id, d) => api.put(`/admin/roles/${id}`, d),
  deleteRole: (id) => api.delete(`/admin/roles/${id}`),
  // Staff
  getStaff: (p) => api.get("/admin/staff", { params: p }),
  assignRole: (d) => api.post("/admin/staff/assign", d),
  revokeRole: (d) => api.post("/admin/staff/revoke", d),
  // Revenue
  getRevenue: (p) => api.get("/admin/revenue", { params: p }),
  // Permissions
  getPermissions: () => api.get("/admin/permissions"),
};
export default api;
