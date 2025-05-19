import { notFound } from "next/navigation";

import CupcakeDetailsClient from "./CupcakeDetailsClient";

import { prisma } from "@/lib/prisma";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CupcakeDetailsPage({ params }: PageProps) {
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
