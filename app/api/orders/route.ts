import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const orders = await prisma.order.findMany({
      where: userId
        ? {
            userId: userId,
          }
        : undefined,
      include: {
        items: {
          include: {
            cupcake: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      customerName: order.user.name || "Cliente",
      status: order.status.toLowerCase(),
      createdAt: order.createdAt,
      deliveryDate: order.deliveryDate,
      total: order.total,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.cupcake.name,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes,
      })),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);

    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, items, total, deliveryDate, paymentMethod } = await request.json();

    if (!userId || !items || !total || !deliveryDate || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        deliveryDate: new Date(deliveryDate),
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            cupcakeId: item.cupcakeId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes,
          })),
        },
      },
      include: {
        items: {
          include: {
            cupcake: true,
          },
        },
      },
    });

    console.log("🚀 ~ POST ~ order:", order);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);

    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
