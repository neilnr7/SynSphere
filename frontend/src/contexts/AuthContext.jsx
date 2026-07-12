import { createContext, useEffect, useState } from "react";
import authService from "@/services/authService";
import tokenStorage from "@/utils/tokenStorage";

const AuthContext = createContext(null);

const getUserFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      email: payload.sub,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    tokenStorage.removeToken();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const storedToken = tokenStorage.getToken();

    if (storedToken) {
      const storedUser = getUserFromToken(storedToken);

      if (storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        tokenStorage.removeToken();
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);

    tokenStorage.setToken(response.token);

    setToken(response.token);
    setUser(getUserFromToken(response.token));

    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);

    tokenStorage.setToken(response.token);

    setToken(response.token);
    setUser(getUserFromToken(response.token));

    return response;
  };

  const logout = () => {
    clearAuth();
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;