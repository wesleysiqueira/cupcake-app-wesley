"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Cupcake } from "@prisma/client";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

import { getCupcakes, addFavorite, removeFavorite } from "@/services/api";

interface CupcakeContextType {
  cupcakes: (Cupcake & { isFavorite: boolean })[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (id: number) => Promise<void>;
}

const CupcakeContext = createContext<CupcakeContextType | undefined>(undefined);

export function CupcakeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cupcakes, setCupcakes] = useState<(Cupcake & { isFavorite: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCupcakes();
  }, [session?.user?.id]);

  const loadCupcakes = async () => {
    try {
      setLoading(true);
      const userId = session?.user?.id;
      const data = await getCupcakes(userId);

      setCupcakes(data);
      setError(null);
    } catch (err) {
      setError("Failed to load cupcakes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: number) => {
    try {
      const cupcake = cupcakes.find((c) => c.id === id);

      if (!cupcake) return;

      const userId = session?.user?.id;

      if (!userId) {
        toast.error("Você precisa estar logado para favoritar cupcakes");

        return;
      }

      if (cupcake.isFavorite) {
        await removeFavorite(userId, id);
        setCupcakes((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: false } : c)));
        toast.success("Cupcake removido dos favoritos");
      } else {
        await addFavorite(userId, id);
        setCupcakes((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: true } : c)));
        toast.success("Cupcake adicionado aos favoritos");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar favoritos");
    }
  };

  return (
    <CupcakeContext.Provider value={{ cupcakes, loading, error, toggleFavorite }}>
      {children}
    </CupcakeContext.Provider>
  );
}

export function useCupcake() {
  const context = useContext(CupcakeContext);

  if (context === undefined) {
    throw new Error("useCupcake must be used within a CupcakeProvider");
  }

  return context;
}
