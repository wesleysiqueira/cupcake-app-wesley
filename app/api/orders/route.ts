import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            cupcake: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);

    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
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
