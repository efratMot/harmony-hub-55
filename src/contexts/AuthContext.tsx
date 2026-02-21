import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

// Mock users database
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

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = mockUsers.find((u) => u.email === email && u.password === password);
    if (!found) return false;
    const fakeToken = btoa(`${found.id}:${Date.now()}`);
    const { password: _, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
    setToken(fakeToken);
    localStorage.setItem("auth_token", fakeToken);
    localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword));
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (mockUsers.find((u) => u.email === email)) return false;
    const newUser = { id: `user-${Date.now()}`, name, email, password, isAdmin: false };
    mockUsers.push(newUser);
    const fakeToken = btoa(`${newUser.id}:${Date.now()}`);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setToken(fakeToken);
    localStorage.setItem("auth_token", fakeToken);
    localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword));
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
