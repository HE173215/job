import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra phiên đăng nhập ban đầu từ cookie
  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getMe();
      if (res && res.success && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // 401 hoặc lỗi mạng ban đầu: xem như chưa đăng nhập
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    // Nếu backend trả kèm user data thì dùng, hoặc gọi getMe()
    if (res?.data?.user) {
      setUser(res.data.user);
      setIsAuthenticated(true);
    } else {
      await refreshUser();
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Lỗi khi gọi logout API:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
