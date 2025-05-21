import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Validation schema for cupcake
const cupcakeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(0, "Preço deve ser maior que zero"),
  image: z.string().url("URL da imagem inválida"),
  featured: z.boolean().optional(),
  new: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
});

// GET /api/cupcakes
export async function GET() {
  try {
    const cupcakes = await prisma.cupcake.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cupcakes);
  } catch (error) {
    console.error("Error fetching cupcakes:", error);

    return NextResponse.json({ error: "Error fetching cupcakes" }, { status: 500 });
  }
}

// POST /api/cupcakes
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = cupcakeSchema.parse(body);

    const cupcake = await prisma.cupcake.create({
      data: validatedData,
    });

    return NextResponse.json(cupcake, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating cupcake:", error);

    return NextResponse.json({ error: "Error creating cupcake" }, { status: 500 });
  }
}

// PUT /api/cupcakes/:id
export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = cupcakeSchema.parse(body);

    const cupcake = await prisma.cupcake.update({
      where: { id: parseInt(params.id) },
      data: validatedData,
    });

    return NextResponse.json(cupcake);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating cupcake:", error);

    return NextResponse.json({ error: "Error updating cupcake" }, { status: 500 });
  }
}

// DELETE /api/cupcakes/:id
export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.cupcake.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Cupcake deleted successfully" });
  } catch (error) {
    console.error("Error deleting cupcake:", error);

    return NextResponse.json({ error: "Error deleting cupcake" }, { status: 500 });
  }
}
