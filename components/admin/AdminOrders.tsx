"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { Chip } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Clock, User, Package, DollarSign, X } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
};

type Order = {
  id: string;
  customerName: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: string;
  total: number;
  items: OrderItem[];
};

const statusColors = {
  pending: "warning",
  processing: "secondary",
  delivered: "success",
  cancelled: "danger",
} as const;

const statusLabels = {
  pending: "Pendente",
  processing: "Processando",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

interface AdminOrdersProps {
  selectedTab: string;
}

export default function AdminOrders({ selectedTab }: AdminOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setOrders(
        orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const getFilteredOrders = () => {
    switch (selectedTab) {
      case "todos":
        return orders;
      case "pendentes":
        return orders.filter((order) => order.status === "pending");
      case "preparando":
        return orders.filter((order) => order.status === "processing");
      case "prontos":
        return orders.filter((order) => order.status === "delivered");
      default:
        return orders;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Pedido #{order.id.slice(-6)}</span>
              </div>
              <Chip color={statusColors[order.status]} size="sm" variant="flat">
                {statusLabels[order.status]}
              </Chip>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">R$ {order.total.toFixed(2)}</span>
                </div>
                <button
                  className="text-sm text-primary hover:underline cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  {order.items.length} itens • Ver detalhes
                </button>
              </div>
            </CardBody>
            <CardFooter>
              <Select
                className="w-full"
                selectedKeys={[order.status]}
                size="sm"
                onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
              >
                <SelectItem key="pending">Pendente</SelectItem>
                <SelectItem key="processing">Processando</SelectItem>
                <SelectItem key="delivered">Entregue</SelectItem>
                <SelectItem key="cancelled">Cancelado</SelectItem>
              </Select>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!selectedOrder} size="lg" onClose={() => setSelectedOrder(null)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <div>Detalhes do Pedido #{selectedOrder?.id.slice(-6)}</div>
                  </div>
                  <Button isIconOnly variant="light" onPress={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedOrder && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Cliente</p>
                        <p className="font-medium">{selectedOrder.customerName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Status</p>
                        <Chip color={statusColors[selectedOrder.status]} size="sm" variant="flat">
                          {statusLabels[selectedOrder.status]}
                        </Chip>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">R$ {selectedOrder.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Itens do Pedido</p>
                      <div className="border rounded-lg divide-y">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="p-4 flex justify-between items-center">
                            <div className="space-y-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.quantity} x R$ {item.price.toFixed(2)}
                              </p>
                              {item.notes && (
                                <p className="text-sm text-gray-500 italic">Obs: {item.notes}</p>
                              )}
                            </div>
                            <p className="font-medium">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Fechar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
