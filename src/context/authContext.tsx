'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  FC,
} from 'react';

import {
  getAccessToken,
  getRefreshToken,
  isTokenValid,
  removeTokens,
  saveTokens,
} from '@/lib/jwt';
import api from '@/lib/api/api';

export const AuthContext = createContext<AuthContextType | null>(null);

export type AuthContextType = {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (accessToken: string, refreshToken: string) => {
      saveTokens(accessToken, refreshToken);
      setIsAuthenticated(true);
    },
    [],
  );

  const logout = useCallback(async () => {
    removeTokens();
    setIsAuthenticated(false);
  }, []);

  const verify = useCallback(async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    const isAuth = isTokenValid(accessToken) && isTokenValid(refreshToken);

    if (!isAuth) {
      await logout();
      return false;
    }

    try {
      const response = await api.get(`/auth/verify`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setIsAuthenticated(response.data.success);
      return response.data.success;
    } catch (e) {
      console.error(e);
      await logout();
      return false;
    }
  }, [logout]);

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
