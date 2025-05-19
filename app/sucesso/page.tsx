"use client";

import Link from "next/link";
import { CheckCircle } from "@mui/icons-material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Title } from "@/components/text/Title";
import { Text } from "@/components/text/Text";
import Header from "@/components/Header";
import { useOrder } from "@/context/OrderContext";

export default function SuccessPage() {
  const { order } = useOrder();
  const router = useRouter();

  useEffect(() => {
    if (!order?.status) {
      router.push("/");
    }
  }, [order, router]);

  return (
    <div className="min-h-screen bg-white">
      <Header title="Pedido Confirmado" />

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-orange-500" />
          </div>

          <Title variant="h2">Pedido Realizado com Sucesso!</Title>

          <Text className="max-w-md">
            Seu pedido foi confirmado e está sendo processado. Você receberá um email com os
            detalhes da sua compra.
          </Text>

          <div className="w-full max-w-md bg-orange-50 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Text className="!mb-0 font-medium">Número do Pedido:</Text>
              <Text className="!mb-0 text-orange-500 font-bold">
                #
                {Math.floor(Math.random() * 1000000)
                  .toString()
                  .padStart(6, "0")}
              </Text>
            </div>

            <div className="flex justify-between items-center">
              <Text className="!mb-0 font-medium">Data de Entrega:</Text>
              <Text className="!mb-0">
                {order?.deliveryData?.deliveryDate
                  ? new Date(order.deliveryData.deliveryDate).toLocaleDateString("pt-BR")
                  : "-"}
              </Text>
            </div>

            <div className="flex justify-between items-center">
              <Text className="!mb-0 font-medium">Total:</Text>
              <Text className="!mb-0 text-orange-500 font-bold">
                R$ {order?.total?.toFixed(2) || "0.00"}
              </Text>
            </div>
          </div>

          <Link
            className="w-full max-w-md bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-center block"
            href="/"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
