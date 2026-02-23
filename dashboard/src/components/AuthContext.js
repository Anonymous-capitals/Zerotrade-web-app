import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_BASE_URL  
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL ;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyUser = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let token = urlParams.get("token") || localStorage.getItem("token");

      if (urlParams.get("token") && !localStorage.getItem("token")) {
        localStorage.setItem("token", token);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (!token) {
        setUser(null);
        setLoading(false);
        setError("No authentication token found");
        return;
      }



      const response = await axios.get(`${API}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.authenticated && response.data.user) {
        setUser(response.data.user);
        setError(null);
      } else {
        setUser(null);
        setError("Authentication failed");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Dashboard: Verification error:", err);

      setUser(null);
      setError(err.response?.data?.message || err.message);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = FRONTEND_URL;
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);