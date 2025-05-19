import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const cupcakes = await prisma.cupcake.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        favorites: userId
          ? {
              where: {
                userId: userId,
              },
            }
          : false,
      },
    });

    // Transform the data to include isFavorite property
    const cupcakesWithFavorites = cupcakes.map((cupcake) => ({
      ...cupcake,
      isFavorite: userId ? cupcake.favorites.length > 0 : false,
      favorites: undefined, // Remove the favorites array from the response
    }));

    return NextResponse.json(cupcakesWithFavorites);
  } catch (error) {
    console.error("Error fetching cupcakes:", error);

    return NextResponse.json({ error: "Error fetching cupcakes" }, { status: 500 });
  }
}
