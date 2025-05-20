import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const { orderId } = params;
    const { status } = await request.json();

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);

    return NextResponse.json({ error: "Erro ao atualizar status do pedido" }, { status: 500 });
  }
}
