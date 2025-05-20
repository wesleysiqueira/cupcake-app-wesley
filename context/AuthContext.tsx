"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole } from "@prisma/client";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        console.log("Checking auth status...");
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const userData = await response.json();

          console.log("User data:", userData);
          setUser(userData);
        } else {
          console.log("No user session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Falha no login");
      }

      const userData = await response.json();

      console.log("Login successful:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      console.log("Logout successful");
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
