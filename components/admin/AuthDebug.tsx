"use client";

import { useAuth } from "@/context/AuthContext";

export default function AuthDebug() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">Debug Auth:</h3>
      <pre className="text-xs">{JSON.stringify({ user, loading }, null, 2)}</pre>
    </div>
  );
}
