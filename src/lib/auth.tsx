import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { account } from "@/lib/appwrite";
import { useNavigate } from "@tanstack/react-router";
import type { Models } from "appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account
      .get()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    const u = await account.get();
    setUser(u);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    await account.create("unique()", email, password, name);
    await account.createEmailPasswordSession(email, password);
    const u = await account.get();
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await account.deleteSession("current");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
