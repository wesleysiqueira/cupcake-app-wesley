"use client";

import Link from "next/link";
import { Star, StarOutline, ShoppingBasket, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";
import { Cupcake } from "@prisma/client";

import { useCart } from "@/context/CartContext";
import { useCupcake } from "@/context/CupcakeContext";
import { Title } from "@/components/text/Title";
import { Text } from "@/components/text/Text";
import { Tag } from "@/components/text/Tag";

interface CupcakeDetailsClientProps {
  cupcake: Cupcake;
}

export default function CupcakeDetailsClient({
  cupcake: initialCupcake,
}: CupcakeDetailsClientProps) {
  const { addItem } = useCart();
  const { cupcakes, toggleFavorite } = useCupcake();
  const [quantity, setQuantity] = useState(1);

  const cupcake = cupcakes.find((c) => c.id === initialCupcake.id) || {
    ...initialCupcake,
    isFavorite: false,
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);

    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addItem(cupcake, quantity);
    toast.success(`${quantity} Cupcakes de ${cupcake.name} adicionado ao carrinho!`, {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#fff",
        color: "#000",
        border: "1px solid #f97316",
        borderRadius: "8px",
      },
    });
  };

  return (
    <div className="min-h-screen">
      {/* Orange section */}
      <div className="bg-orange-500 p-6 rounded-b-[25px]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Link className="text-white hover:text-orange-100" href="/">
              <ArrowBack className="text-2xl" />
            </Link>
            <button
              className="text-white hover:text-orange-100"
              onClick={() => toggleFavorite(cupcake.id)}
            >
              {cupcake.isFavorite ? (
                <Star className="text-2xl" />
              ) : (
                <StarOutline className="text-2xl" />
              )}
            </button>
          </div>

          {/* Image and details */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image */}
            <div className="flex-1">
              <img
                alt={cupcake.name}
                className="w-full h-[300px] object-cover rounded-lg"
                src={cupcake.image}
              />
            </div>

            {/* Details */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-4">
                {cupcake.featured && <Tag>Popular</Tag>}
                {cupcake.new && <Tag>Novo</Tag>}
              </div>

              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`text-xl ${
                      i < Math.floor(cupcake.rating) ? "text-yellow-400" : "text-white/50"
                    }`}
                  />
                ))}
                <span className="text-sm">({cupcake.rating})</span>
              </div>

              <Title className="text-white text-3xl mb-4">R$ {cupcake.price.toFixed(2)}</Title>

              <div className="flex items-center gap-4 mb-6 text-xl font-bold">
                <button
                  className="w-8 h-8 rounded-lg bg-white text-orange-500 flex items-center justify-center hover:bg-orange-100"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  className="w-8 h-8 rounded-lg bg-white text-orange-500 flex items-center justify-center hover:bg-orange-100"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>

              <button
                className="w-full bg-white text-orange-500 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-100"
                onClick={handleAddToCart}
              >
                <ShoppingBasket />
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* White section */}
      <div className="max-w-4xl mx-auto p-6 pb-20">
        <Title withDecoration>{cupcake.name}</Title>
        <Text>{cupcake.description}</Text>
      </div>
    </div>
  );
}
