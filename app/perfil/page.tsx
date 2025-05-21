"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Person, Favorite, History, Edit, Logout, Save, Close } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Title } from "@/components/text/Title";
import { Text } from "@/components/text/Text";
import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";
import { getFavorites, getOrders, updateUser } from "@/services/api";
import { FavoriteWithCupcake, OrderWithItems } from "@/services/api";

type TabType = "info" | "favorites" | "orders";
type EditableField = "name" | "email" | "address" | null;

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [favorites, setFavorites] = useState<FavoriteWithCupcake[]>([]);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const { order } = useOrder();
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const tabs = [
    { id: "info", label: "Informações", icon: Person },
    { id: "favorites", label: "Favoritos", icon: Favorite },
    { id: "orders", label: "Pedidos", icon: History },
  ] as const;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");

      return;
    }

    if (status === "authenticated" && session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        address: session.user.address || "",
      });
      loadData();
    }
  }, [status, session, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (!session?.user?.id) return;

      const [favoritesData, ordersData] = await Promise.all([
        getFavorites(session.user.id),
        getOrders(session.user.id),
      ]);

      setFavorites(favoritesData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading profile data:", error);
      toast.error("Erro ao carregar dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: EditableField) => {
    setEditingField(field);
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      address: session?.user?.address || "",
    });
  };

  const handleSave = async () => {
    if (!editingField) return;

    try {
      const updatedUser = await updateUser({
        [editingField]: formData[editingField],
      });

      toast.success("Perfil atualizado com sucesso!");
      setEditingField(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar perfil");
    }
  };

  const handleInputChange = (field: EditableField, value: string) => {
    if (!field) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logout realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Erro ao realizar logout");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Text>Carregando...</Text>
      </div>
    );
  }

  if (!session) {
    return null; // This will be handled by the useEffect redirect
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="Meu Perfil" />

      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <Person className="w-10 h-10 text-orange-500" />
          </div>
          <div>
            <Title variant="h2">Olá, {session?.user?.name || "Usuário"}</Title>
            <Text className="!mb-0">{session?.user?.email || "email@exemplo.com"}</Text>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
                transition-colors duration-200
                ${
                  activeTab === id
                    ? "bg-orange-500 text-white"
                    : "bg-orange-50 text-orange-500 hover:bg-orange-100"
                }
              `}
              onClick={() => setActiveTab(id)}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <Text className="!mb-0 font-medium">Nome Completo</Text>
                  <div className="flex items-center gap-2">
                    {editingField === "name" ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="px-2 py-1 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                        <button
                          className="text-green-500 hover:text-green-600"
                          onClick={handleSave}
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-600" onClick={handleCancel}>
                          <Close className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Text className="!mb-0">{formData.name || "-"}</Text>
                        <button
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => handleEdit("name")}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="!mb-0 font-medium">Email</Text>
                  <div className="flex items-center gap-2">
                    {editingField === "email" ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="px-2 py-1 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                        <button
                          className="text-green-500 hover:text-green-600"
                          onClick={handleSave}
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-600" onClick={handleCancel}>
                          <Close className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Text className="!mb-0">{formData.email || "-"}</Text>
                        <button
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => handleEdit("email")}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="!mb-0 font-medium">Endereço</Text>
                  <div className="flex items-center gap-2">
                    {editingField === "address" ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="px-2 py-1 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                        />
                        <button
                          className="text-green-500 hover:text-green-600"
                          onClick={handleSave}
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-600" onClick={handleCancel}>
                          <Close className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Text className="!mb-0">{formData.address || "-"}</Text>
                        <button
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => handleEdit("address")}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 py-3 px-4 rounded-lg border border-red-200 hover:border-red-300 transition-colors duration-200"
                onClick={handleLogout}
              >
                <Logout className="w-5 h-5" />
                Sair da Conta
              </button>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <Text>Carregando favoritos...</Text>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Text>Você ainda não tem cupcakes favoritos.</Text>
                  <Link
                    className="inline-block mt-4 text-orange-500 hover:text-orange-600"
                    href="/"
                  >
                    Explorar Cupcakes
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map((favorite) => (
                    <Link
                      key={favorite.id}
                      className="flex gap-4 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                      href={`/cupcake/${favorite.cupcake.id}`}
                    >
                      <img
                        alt={favorite.cupcake.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        src={favorite.cupcake.image}
                      />
                      <div>
                        <Title className="!mb-1" variant="h3">
                          {favorite.cupcake.name}
                        </Title>
                        <Text className="!mb-0 text-orange-500 font-bold">
                          R$ {favorite.cupcake.price.toFixed(2)}
                        </Text>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <Text>Carregando pedidos...</Text>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Text>Você ainda não tem pedidos.</Text>
                  <Link
                    className="inline-block mt-4 text-orange-500 hover:text-orange-600"
                    href="/"
                  >
                    Fazer um Pedido
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-orange-50 rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <Text className="!mb-0 font-medium">Número do Pedido:</Text>
                        <Text className="!mb-0 text-orange-500 font-bold">
                          #{order.id.slice(0, 6)}
                        </Text>
                      </div>

                      <div className="flex justify-between items-center">
                        <Text className="!mb-0 font-medium">Data de Entrega:</Text>
                        <Text className="!mb-0">
                          {order.deliveryDate
                            ? new Date(order.deliveryDate).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "Data não definida"}
                        </Text>
                      </div>

                      <div className="flex justify-between items-center">
                        <Text className="!mb-0 font-medium">Status:</Text>
                        <Text className="!mb-0 text-orange-500 font-bold">
                          {order.status === "PENDING"
                            ? "Em Processamento"
                            : order.status === "DELIVERED"
                              ? "Entregue"
                              : order.status}
                        </Text>
                      </div>

                      <div className="flex justify-between items-center">
                        <Text className="!mb-0 font-medium">Total:</Text>
                        <Text className="!mb-0 text-orange-500 font-bold">
                          R$ {order.total.toFixed(2)}
                        </Text>
                      </div>

                      <div className="mt-4 pt-4 border-t border-orange-200">
                        <Text className="!mb-2 font-medium">Itens do Pedido:</Text>
                        <div className="space-y-2">
                          {order.items.map((item) => {
                            return (
                              <div key={item.id} className="flex justify-between items-center">
                                <Text className="!mb-0">
                                  {item.quantity}x {item.name || "Cupcake"}
                                </Text>
                                <Text className="!mb-0 text-orange-500">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </Text>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
