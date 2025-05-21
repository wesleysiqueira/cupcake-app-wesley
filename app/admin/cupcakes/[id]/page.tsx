import { Suspense } from "react";

import CupcakeForm from "./CupcakeForm";

import { prisma } from "@/lib/prisma";

interface PageProps {
  params: {
    id: string;
  };
}

async function getCupcake(id: string) {
  if (id === "new") return null;

  const cupcake = await prisma.cupcake.findUnique({
    where: { id: parseInt(id) },
  });

  if (!cupcake) {
    throw new Error("Cupcake not found");
  }

  return cupcake;
}

export default async function EditCupcakePage({ params }: { params: any }) {
  const cupcake = await getCupcake(params.id);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
        </div>
      }
    >
      <CupcakeForm id={params.id} initialData={cupcake || undefined} />
    </Suspense>
  );
}
