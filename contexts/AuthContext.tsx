// contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  console.log("CHECK AUTH START");
  const checkAuth = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("adminToken="))
          ?.split("=")[1];

      console.log("TOKEN FOUND:", token);

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const storedUser = localStorage.getItem("adminUser");

      if (storedUser && !user) {
        setUser(JSON.parse(storedUser));
      }

      const response = await api.getMe();

      console.log("GETME RESPONSE:", response);

      console.log("CHECK AUTH SUCCESS", response.admin);
      if (response?.admin) {
        setUser(response.admin);

        localStorage.setItem("adminUser", JSON.stringify(response.admin));
      } else {
        throw new Error("Invalid user response");
      }
    } catch (error) {
      console.error("Auth check failed:", error);

      api.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    checkAuth();

    const interval = setInterval(
      () => {
        if (!api.isTokenExpired()) {
          refreshUser().catch(() => {});
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    const response = await api.login({
      email,
      password,
      rememberMe,
    });

    setUser(response.admin);

    localStorage.setItem("adminUser", JSON.stringify(response.admin));

    router.replace("/admin/dashboard");
  };
  const register = async (name: string, email: string, password: string) => {
    try {
      await api.register({ name, email, password });
      // router.push("/admin/login?registered=true");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/admin/login");
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    await api.changePassword({ currentPassword, newPassword });
  };

  const refreshUser = async () => {
    const response = await api.getMe();

    if (response?.admin) {
      setUser(response.admin);

      localStorage.setItem("adminUser", JSON.stringify(response.admin));
    }
  };
  console.log("AuthProvider State", { user, loading });
  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          loading,
          isAuthenticated: !!user,
          login,
          register,
          logout,
          changePassword,
          refreshUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
