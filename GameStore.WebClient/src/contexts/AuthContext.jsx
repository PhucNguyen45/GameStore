import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await authAPI.login({ username, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const register = async (d) => {
    const res = await authAPI.register(d);
    return res.data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
