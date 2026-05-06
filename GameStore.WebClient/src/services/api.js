// GameStore.WebClient/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
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
};
export const gameAPI = {
  getFeatured: (n = 12) => api.get("/games/featured", { params: { count: n } }),
  getAll: (p) => api.get("/games", { params: p }),
  getById: (id) => api.get(`/games/${id}`),
  // Admin game CRUD - uses /api/admin/games (no [Authorize] needed)
  create: (d) => api.post("/admin/games", d),
  update: (id, d) => api.put(`/admin/games/${id}`, d),
  delete: (id) => api.delete(`/admin/games/${id}`),
};
export const genreAPI = { getAll: () => api.get("/genres") };
export const orderAPI = {
  create: (d) => api.post("/orders", d),
  getAll: () => api.get("/orders"),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};
export const userAPI = {
  getWallet: () => api.get("/users/wallet"),
  topUp: (amount) => api.post("/users/wallet/topup", { amount }),
};
export const libraryAPI = {
  getMyLibrary: () => api.get("/library"),
  checkOwned: (gameId) => api.get(`/library/check/${gameId}`),
};
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get("/admin/dashboard"),
  // Users
  getUsers: (p) => api.get("/admin/users", { params: p }),
  updateUser: (id, d) => api.put(`/admin/users/${id}`, d),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // Categories
  getCategories: (p) => api.get("/admin/categories", { params: p }),
  createCategory: (d) => api.post("/admin/categories", d),
  updateCategory: (id, d) => api.put(`/admin/categories/${id}`, d),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  // Game Keys
  getGameKeys: (p) => api.get("/admin/gamekeys", { params: p }),
  createGameKey: (d) => api.post("/admin/gamekeys", d),
  createBatchGameKeys: (d) => api.post("/admin/gamekeys/batch", d),
  deleteGameKey: (id) => api.delete(`/admin/gamekeys/${id}`),
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
  revokeRole: (d) => api.delete("/admin/staff/revoke", { data: d }),
  // Permissions
  getPermissions: () => api.get("/admin/permissions"),
};
export default api;
