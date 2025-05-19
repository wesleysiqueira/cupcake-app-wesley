import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        cupcake: true,
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);

    return NextResponse.json({ error: "Error fetching favorites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, cupcakeId } = await request.json();

    if (!userId || !cupcakeId) {
      return NextResponse.json({ error: "User ID and Cupcake ID are required" }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        cupcakeId: Number(cupcakeId),
      },
      include: {
        cupcake: true,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error creating favorite:", error);

    return NextResponse.json({ error: "Error creating favorite" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const cupcakeId = searchParams.get("cupcakeId");

    if (!userId || !cupcakeId) {
      return NextResponse.json({ error: "User ID and Cupcake ID are required" }, { status: 400 });
    }

    await prisma.favorite.delete({
      where: {
        userId_cupcakeId: {
          userId,
          cupcakeId: Number(cupcakeId),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting favorite:", error);

    return NextResponse.json({ error: "Error deleting favorite" }, { status: 500 });
  }
}
