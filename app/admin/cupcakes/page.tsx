"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";

type Cupcake = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  new: boolean;
  rating: number;
};

export default function CupcakesPage() {
  const router = useRouter();
  const [cupcakes, setCupcakes] = useState<Cupcake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCupcakes();
  }, []);

  const fetchCupcakes = async () => {
    try {
      const response = await fetch("/api/cupcakes");

      if (!response.ok) throw new Error("Failed to fetch cupcakes");
      const data = await response.json();

      setCupcakes(data);
    } catch (error) {
      console.error("Error fetching cupcakes:", error);
      toast.error("Erro ao carregar cupcakes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este cupcake?")) return;

    try {
      const response = await fetch(`/api/cupcakes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete cupcake");

      toast.success("Cupcake excluído com sucesso");
      fetchCupcakes();
    } catch (error) {
      console.error("Error deleting cupcake:", error);
      toast.error("Erro ao excluir cupcake");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Cupcakes</h1>
        <Button
          className="flex items-center gap-2"
          onPress={() => router.push("/admin/cupcakes/new")}
        >
          <Plus className="w-5 h-5" />
          Novo Cupcake
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
        {cupcakes.map((cupcake) => (
          <Card key={cupcake.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image fill alt={cupcake.name} className="object-cover" src={cupcake.image} />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{cupcake.name}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">{cupcake.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">R$ {cupcake.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  {cupcake.featured && (
                    <span className="px-2 py-1 bg-primary text-white text-sm rounded">
                      Destaque
                    </span>
                  )}
                  {cupcake.new && (
                    <span className="px-2 py-1 bg-green-500 text-white text-sm rounded">Novo</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  className="flex items-center gap-2"
                  variant="ghost"
                  onPress={() => router.push(`/admin/cupcakes/${cupcake.id}`)}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  className="flex items-center gap-2"
                  color="danger"
                  variant="solid"
                  onPress={() => handleDelete(cupcake.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
