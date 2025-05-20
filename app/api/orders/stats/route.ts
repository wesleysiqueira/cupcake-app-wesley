import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get today's date at midnight
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date at midnight
    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count orders for today
    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Count orders by status
    const [processingOrders, readyOrders, deliveredOrders] = await Promise.all([
      prisma.order.count({
        where: {
          status: "processing",
        },
      }),
      prisma.order.count({
        where: {
          status: "pending",
        },
      }),
      prisma.order.count({
        where: {
          status: "delivered",
        },
      }),
    ]);

    return NextResponse.json({
      todayOrders,
      processingOrders,
      readyOrders,
      deliveredOrders,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);

    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
