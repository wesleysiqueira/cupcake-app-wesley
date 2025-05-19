import { notFound } from "next/navigation";

import CupcakeDetailsClient from "./CupcakeDetailsClient";

import { prisma } from "@/lib/prisma";

export default async function CupcakeDetailsPage({ params }: any) {
  const cupcake = await prisma.cupcake.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  if (!cupcake) {
    notFound();
  }

  return <CupcakeDetailsClient cupcake={cupcake} />;
}
