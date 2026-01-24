import { createContext, useContext, useState, ReactNode } from "react";
import { endpoints } from "@/config/api";

interface User {
  id: string;
  name: string;
  role: 'admin' | 'user' | 'receptionist';
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    role?: "user" | "admin"
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("vividstream_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(endpoints.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data.message);
        return { success: false, error: data.message || "Login failed" };
      }

      const userData: User = {
        id: data.user.id,
        name: data.user.fullName,
        email: data.user.email,
        isAdmin: data.user.role === "admin",
        role: data.user.role,
      };

      setUser(userData);
      localStorage.setItem("vividstream_user", JSON.stringify(userData));
      localStorage.setItem("token", data.token || "");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "user" | "admin" = "user"
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(endpoints.auth.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          confirmPassword: password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup failed:", data.message);
        return { success: false, error: data.message || "Registration failed" };
      }

      const userData: User = {
        id: data.user.id,
        name: data.user.fullName,
        email: data.user.email,
        isAdmin: false,
        role: data.user.role,
      };

      setUser(userData);
      localStorage.setItem("vividstream_user", JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  };

  const logout = async () => {
    try {
      // Optional: Call backend logout endpoint if you implement token invalidation
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(endpoints.auth.logout, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state and storage
      setUser(null);
      localStorage.removeItem("vividstream_user");
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
