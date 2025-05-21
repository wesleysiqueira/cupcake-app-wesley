import { Metadata } from "next";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard | Cupcake App",
  description: "Gerencie pedidos e atualize status",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link className="text-xl font-bold text-gray-900" href="/admin">
                Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link className="text-gray-600 hover:text-gray-900" href="/admin/cupcakes">
                Cupcakes
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
