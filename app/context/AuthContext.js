"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ value: null });
  const [admin, setAdmin] = useState({ value: null });
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    setUser({ value: null });
    router.push("/login");
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    setAdmin({ value: null });
    router.push("/admin-login");
  };

  const checkTokenExpiry = (tokenKey, logoutFn) => {
    const token = localStorage.getItem(tokenKey);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (Date.now() >= decoded.exp * 1000) {
          logoutFn();
        }
      } catch (error) {
        logoutFn();
      }
    }
  };

  useEffect(() => {
    checkTokenExpiry("token", logout);
    checkTokenExpiry("adminToken", adminLogout);

    const userInterval = setInterval(() => checkTokenExpiry("token", logout), 60000);
    const adminInterval = setInterval(() => checkTokenExpiry("adminToken", adminLogout), 60000);

    return () => {
      clearInterval(userInterval);
      clearInterval(adminInterval);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ value: token });
        } else {
          logout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }

    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      try {
        const decoded = jwtDecode(adminToken);
        if (decoded.exp * 1000 > Date.now()) {
          setAdmin({ value: adminToken });
        } else {
          adminLogout();
        }
      } catch (error) {
        console.error("Invalid admin token:", error);
        adminLogout();
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ value: token });

    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();

      if (currentTime < expiryTime) {
        setTimeout(() => {
          logout();
        }, expiryTime - currentTime);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }

    router.push("/");
  };

  const adminLogin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdmin({ value: token });

    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();

      if (currentTime < expiryTime) {
        setTimeout(() => {
          adminLogout();
        }, expiryTime - currentTime);
      }
    } catch (error) {
      console.error("Invalid admin token:", error);
      adminLogout();
    }

    router.push("/adminDashboard");
  };

  return (
    <AuthContext.Provider value={{ login, adminLogin, logout, adminLogout, user, admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
