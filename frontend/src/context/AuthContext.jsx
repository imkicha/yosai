import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("yosai_token");
    if (token) fetchMe();
    else setLoading(false);
  }, []);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.user);
      setVendor(res.vendor || null);
    } catch {
      localStorage.removeItem("yosai_token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("yosai_token", res.token);
    setUser(res.user);
    setVendor(res.vendor || null);
    return res;
  };

  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    localStorage.setItem("yosai_token", res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("yosai_token");
    setUser(null);
    setVendor(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, vendor, loading, login, register, logout, fetchMe, isAdmin: user?.role === "admin", isVendor: user?.role === "vendor" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
