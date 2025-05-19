"use client";

import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { createOrder } from "@/services/api";

interface OrderItem {
  id: number;
  quantity: number;
  notes?: string;
  price: number;
}

interface DeliveryData {
  name: string;
  email: string;
  address: string;
  deliveryDate: string;
}

interface PaymentData {
  method: string;
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv: string;
}

interface OrderContextType {
  order: {
    products: OrderItem[];
    total: number;
    status?: string;
    deliveryData?: DeliveryData;
    paymentData?: PaymentData;
  };
  setOrder: (order: any) => void;
  addOrder: (order: any) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState<OrderContextType["order"]>({
    products: [],
    total: 0,
  });
  const { data: session } = useSession();
  const router = useRouter();

  const addOrder = async (orderData: OrderContextType["order"]) => {
    try {
      if (!session?.user?.id) {
        toast.error("Você precisa estar logado para finalizar o pedido");
        router.push("/login");

        return;
      }

      const orderItems = orderData.products.map((item) => ({
        cupcakeId: item.id,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes,
      }));

      await createOrder({
        userId: session.user.id,
        items: orderItems,
        total: orderData.total,
        deliveryDate: orderData.deliveryData?.deliveryDate || new Date().toISOString(),
        paymentMethod: orderData.paymentData?.method || "CREDIT",
      });

      toast.success("Pedido realizado com sucesso!");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Erro ao criar pedido");
    }
  };

  return (
    <OrderContext.Provider value={{ order, setOrder, addOrder }}>{children}</OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }

  return context;
}
