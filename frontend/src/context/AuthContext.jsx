import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../services/apiClient';
import { loginUser, registerUser } from '../services/authService';

export const AuthContext = createContext(null);

function getStoredSession() {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!token || !rawUser) {
      return { token: null, user: null };
    }
    return { token, user: JSON.parse(rawUser) };
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredSession().token);
  const [user, setUser] = useState(() => getStoredSession().user);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [token, user]);

  const login = useCallback(async (credentials) => {
    const response = await loginUser(credentials);
    setToken(response.token);
    setUser(response.user);
    return response;
  }, []);

  const register = useCallback(async (userData) => {
    return registerUser(userData);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.rol === 'admin',
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
