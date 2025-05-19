import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, address } = await request.json();

    // Validate input
    if (!name && !email && !address) {
      return NextResponse.json({ error: "At least one field must be provided" }, { status: 400 });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: session.user.id,
          },
        },
      });

      if (existingUser) {
        return NextResponse.json({ error: "Este email já está em uso" }, { status: 400 });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(address && { address }),
      },
    });

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);

    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}
