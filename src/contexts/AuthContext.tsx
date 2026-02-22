import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch, isServerAvailable } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (fallback when server is unavailable)
const mockUsers: (User & { password: string })[] = [
  { id: "admin-1", name: "Admin User", email: "admin@musicstore.com", password: "admin123", isAdmin: true },
  { id: "user-1", name: "John Doe", email: "john@example.com", password: "password123", isAdmin: false },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveAuth = (newToken: string, newUser: User) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const serverUp = await isServerAvailable();

    if (serverUp) {
      try {
        const res = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        saveAuth(data.token, data.user);
        return true;
      } catch {
        // Fall through to mock
      }
    }

    // Mock fallback
    const found = mockUsers.find((u) => u.email === email && u.password === password);
    if (!found) return false;
    const fakeToken = btoa(`${found.id}:${Date.now()}`);
    const { password: _, ...userWithoutPassword } = found;
    saveAuth(fakeToken, userWithoutPassword);
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const serverUp = await isServerAvailable();

    if (serverUp) {
      try {
        const res = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        saveAuth(data.token, data.user);
        return true;
      } catch {
        // Fall through to mock
      }
    }

    // Mock fallback
    if (mockUsers.find((u) => u.email === email)) return false;
    const newUser = { id: `user-${Date.now()}`, name, email, password, isAdmin: false };
    mockUsers.push(newUser);
    const fakeToken = btoa(`${newUser.id}:${Date.now()}`);
    const { password: _, ...userWithoutPassword } = newUser;
    saveAuth(fakeToken, userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.isAdmin ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
