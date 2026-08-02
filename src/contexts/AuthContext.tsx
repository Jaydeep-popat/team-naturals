'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { auth, ApiError } from '../lib/api';
import type { User } from '../types/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phoneNo?: string;
  }) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // start true for initial check

  // Silently restore session on app load (uses silent401 so no redirect happens)
  useEffect(() => {
    auth
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await auth.me();
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }, []);

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    const res = await auth.login({ emailOrUsername, password });
    setUser(res.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch {
      // Even if the API call fails, clear local state
    } finally {
      setUser(null);
    }
  }, []);

  const register = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
      phoneNo?: string;
    }) => {
      await auth.register(data);
      // Backend does NOT issue a token on register; user must verify email then login
      // So we do NOT set user here
    },
    []
  );

  const verifyEmail = useCallback(async (email: string, otp: string) => {
    await auth.verifyEmail({ email, otp });
    // Backend verifies but still does not issue tokens; user must login after
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      verifyEmail,
      refreshUser,
    }),
    [user, isLoading, login, logout, register, verifyEmail, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
