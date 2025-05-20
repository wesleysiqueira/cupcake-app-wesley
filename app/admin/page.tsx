"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Tabs, Tab, Chip } from "@heroui/react";
import { Clock, Package, CheckCircle, Truck } from "lucide-react";

import AdminOrders from "@/components/admin/AdminOrders";

type Stats = {
  todayOrders: number;
  processingOrders: number;
  readyOrders: number;
  deliveredOrders: number;
};

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("todos");
  const [stats, setStats] = useState<Stats>({
    todayOrders: 0,
    processingOrders: 0,
    readyOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/orders/stats");
      const data = await response.json();

      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="mt-2 text-gray-600">Gerencie pedidos e atualize status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Pedidos Hoje</span>
                <span className="text-2xl font-bold">{stats.todayOrders}</span>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-white">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Em Preparo</span>
                <span className="text-2xl font-bold">{stats.processingOrders}</span>
              </div>
              <Package className="h-8 w-8 text-secondary" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-white">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Prontos</span>
                <span className="text-2xl font-bold">{stats.readyOrders}</span>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-white">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Entregues</span>
                <span className="text-2xl font-bold">{stats.deliveredOrders}</span>
              </div>
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            aria-label="Filtros de pedidos"
            color="primary"
            selectedKey={selectedTab}
            variant="underlined"
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            <Tab key="todos" title="Todos">
              <Chip color="primary" variant="flat">
                Todos
              </Chip>
            </Tab>
            <Tab key="pendentes" title="Pendentes">
              <Chip color="warning" variant="flat">
                Pendentes
              </Chip>
            </Tab>
            <Tab key="preparando" title="Preparando">
              <Chip color="secondary" variant="flat">
                Preparando
              </Chip>
            </Tab>
            <Tab key="prontos" title="Prontos">
              <Chip color="success" variant="flat">
                Prontos
              </Chip>
            </Tab>
          </Tabs>
        </CardHeader>

        <CardBody>
          <AdminOrders selectedTab={selectedTab} />
        </CardBody>
      </Card>
    </main>
  );
}
