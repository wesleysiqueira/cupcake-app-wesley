"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";

import { useOrder } from "@/context/OrderContext";
import Input from "@/components/form/Input";
import Header from "@/components/Header";
import { formatDateToUS, formatDateInput } from "@/utils/date";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  dataEntrega: z
    .string()
    .min(10, "Data inválida")
    .refine(
      (date) => {
        const [day, month, year] = date.split("/");
        const dateObj = new Date(`${year}-${month}-${day}`);

        return !isNaN(dateObj.getTime());
      },
      {
        message: "Data inválida",
      }
    )
    .refine(
      (date) => {
        const [day, month, year] = date.split("/");
        const dateObj = new Date(`${year}-${month}-${day}`);

        return dateObj > new Date();
      },
      {
        message: "A data deve ser futura",
      }
    ),
});

type FormData = z.infer<typeof formSchema>;

export default function ConfirmacaoPage() {
  const { order, setOrder } = useOrder();
  const router = useRouter();
  const { data: session } = useSession();

  console.log("🚀 ~ ConfirmacaoPage ~ session:", session);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: session?.user?.name || order.deliveryData?.name || "",
      email: session?.user?.email || order.deliveryData?.email || "",
      endereco: session?.user?.address || order.deliveryData?.address || "",
      dataEntrega: order.deliveryData?.deliveryDate
        ? new Date(order.deliveryData.deliveryDate).toLocaleDateString("pt-BR")
        : "",
    },
  });

  const onSubmit = (data: FormData) => {
    setOrder({
      ...order,
      deliveryData: {
        address: data.endereco,
        deliveryDate: formatDateToUS(data.dataEntrega),
        name: data.nome,
        email: data.email,
      },
    });

    router.push("/pagamento");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header backHref="/carrinho" title="Dados para Entrega" />
      <div className="max-w-4xl mx-auto p-6">
        <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("nome")}
            error={errors.nome?.message}
            id="nome"
            label="Nome Completo"
          />

          <Input
            {...register("email")}
            error={errors.email?.message}
            id="email"
            label="Email"
            type="email"
          />

          <Input
            {...register("endereco")}
            error={errors.endereco?.message}
            id="endereco"
            label="Endereço Completo"
          />

          <Input
            {...register("dataEntrega")}
            error={errors.dataEntrega?.message}
            format={formatDateInput}
            id="dataEntrega"
            label="Data de Entrega"
            maxLength={10}
            placeholder="DD/MM/AAAA"
          />

          <button
            className={`
              w-full bg-orange-500 text-white py-3 px-4 rounded-lg
              hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Processando..." : "Realizar Pagamento"}
          </button>
        </form>
      </div>
    </div>
  );
}
