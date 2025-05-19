"use client";

import { useState } from "react";
import Link from "next/link";
import { Delete, Edit, Add } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useCart } from "@/context/CartContext";
import { Title } from "@/components/text/Title";
import { Text } from "@/components/text/Text";
import NotesModal from "@/components/NotesModal";
import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";

export default function CartPage() {
  const { order, setOrder } = useOrder();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleQuantityChange = (id: number, delta: number) => {
    const item = items.find((item) => item.id === id);

    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);

      updateQuantity(id, newQuantity);
    }
  };

  const handleOpenNotesModal = (id: number) => {
    setSelectedItemId(id);
    setIsNotesModalOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header backHref="/" title="Carrinho" />
        <div className="max-w-4xl mx-auto text-center">
          <Title className="my-4" variant="h2">
            Seu carrinho está vazio
          </Title>
          <Link className="text-orange-500 hover:text-orange-600" href="/">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  const nextStep = () => {
    if (!session?.user) {
      toast.error("Você precisa estar logado para finalizar o pedido");
      router.push("/login");

      return;
    }

    setOrder({
      ...order,
      products: items,
      total: totalPrice,
    });
    router.push("/confirmacao");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header backHref="/" title="Carrinho" />
      {/* Cart Items */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border border-orange-200 rounded-lg overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                <img
                  alt={item.name}
                  className="w-full sm:w-24 h-auto sm:h-24 object-cover rounded-lg"
                  src={item.image}
                />
                <div className="flex-1">
                  <Title className="text-lg sm:text-xl" variant="h3">
                    {item.name}
                  </Title>
                  <Text
                    className="text-orange-500 font-bold !mb-0 text-base sm:text-lg"
                    variant="large"
                  >
                    R$ {item.price.toFixed(2)}
                  </Text>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-200 active:bg-orange-300"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      -
                    </button>
                    <Text className="!mb-0 text-base sm:text-sm" variant="default">
                      {item.quantity}
                    </Text>
                    <button
                      className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-200 active:bg-orange-300"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:gap-2">
                  <button
                    className="text-red-500 hover:text-red-600 p-2"
                    onClick={() => removeItem(item.id)}
                  >
                    <Delete className="w-6 h-6 sm:w-5 sm:h-5" />
                  </button>
                  {!item.notes && (
                    <button
                      className="text-orange-500 hover:text-orange-600 flex items-center gap-2 p-2"
                      onClick={() => handleOpenNotesModal(item.id)}
                    >
                      <span className="text-sm sm:text-base">Notas</span>
                      <Add className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notes Section - Full Width */}
              {item.notes && (
                <div className="border-t border-orange-100 bg-orange-50 p-4">
                  <div className="flex justify-between items-start">
                    <Text className="!mb-0 text-sm sm:text-base" variant="small">
                      {item.notes}
                    </Text>
                    <button
                      className="text-orange-500 hover:text-orange-600 p-2"
                      onClick={() => handleOpenNotesModal(item.id)}
                    >
                      <Edit className="h-5 w-5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total and Actions */}
        <div className="mt-6 sm:mt-8 border-t border-orange-200 pt-4 sm:pt-6 pb-20 sm:pb-16">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <Title className="text-xl sm:text-2xl" variant="h2">
              Total
            </Title>
            <Title className="text-xl sm:text-2xl text-orange-500" variant="h2">
              R$ {totalPrice.toFixed(2)}
            </Title>
          </div>
          <button
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-center block text-base sm:text-lg"
            onClick={nextStep}
          >
            Finalizar
          </button>
        </div>
      </div>

      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesModalOpen}
        itemId={selectedItemId}
        onClose={() => setIsNotesModalOpen(false)}
      />
    </div>
  );
}
