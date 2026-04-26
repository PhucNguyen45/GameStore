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
};
export const genreAPI = { getAll: () => api.get("/genres") };
export const orderAPI = {
  create: (d) => api.post("/orders", d),
  getAll: () => api.get("/orders"),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};
export const userAPI = {
  getWallet: () => api.get("/users/wallet"),
  topUp: (a) => api.post("/users/wallet/topup", { amount: a }),
};
export const libraryAPI = {
  getMyLibrary: () => api.get("/library"),
};
export default api;
