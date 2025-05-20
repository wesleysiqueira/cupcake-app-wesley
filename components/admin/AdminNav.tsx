"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

export default function AdminNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    console.log("AdminNav Debug:", { user, isAdmin });
  }, [user, isAdmin]);

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Link
        aria-label="Acesso à área administrativa"
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full shadow-lg
          ${
            pathname.startsWith("/admin")
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }
          transition-colors duration-200
          border border-gray-200
        `}
        href="/admin"
      >
        <Shield className="w-5 h-5" />
        <span className="font-medium">Admin</span>
      </Link>
    </div>
  );
}
