import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await client.get("/Profile/me");
        setUser(res.data);
      } catch (err) {
        console.error("Greška pri učitavanju profila:", err);
        setUser(null);
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    const res = await client.post("/Auth/login", { email, password });
    const newToken = res.data.token;
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const profileRes = await client.get("/Profile/me", {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
    setUser(profileRes.data);
  };

  const register = async (data) => {
    await client.post("/Auth/register", data);
    await login(data.email, data.password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const updateProfile = async (data) => {
    const res = await client.put("/Profile", data);
    setUser(res.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
