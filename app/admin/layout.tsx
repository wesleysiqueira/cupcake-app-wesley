import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Cupcake App",
  description: "Gerencie pedidos e atualize status",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
