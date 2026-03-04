"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { API_URL } from "@/lib/api";

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
  setToken: (t: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTokenState(typeof window !== "undefined" ? localStorage.getItem("token") : null);
    setIsLoading(false);
  }, []);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  };

  const login = async (email: string, password: string) => {
    const form = new FormData();
    form.append("username", email);
    form.append("password", password);
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(typeof d.detail === "string" ? d.detail : "Login failed");
    }
    const data = await res.json();
    setToken(data.access_token);
  };

  const register = async (email: string, username: string, password: string) => {
    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(typeof d.detail === "string" ? d.detail : "Registration failed");
    }
    const data = await res.json();
    setToken(data.access_token);
  };

  const forgotPassword = async (email: string) => {
    const res = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(typeof d.detail === "string" ? d.detail : "Request failed");
    }
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider
      value={{ token, isLoading, login, register, forgotPassword, logout, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
