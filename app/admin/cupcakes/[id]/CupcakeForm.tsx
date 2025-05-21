"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";

const cupcakeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.string().min(1, "Preço é obrigatório"),
  image: z.string().url("URL da imagem inválida"),
  featured: z.boolean(),
  new: z.boolean(),
  rating: z.string().min(1, "Avaliação é obrigatória"),
});

type CupcakeFormData = z.infer<typeof cupcakeSchema>;

type CupcakeSubmitData = {
  name: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  new: boolean;
  rating: number;
};

interface CupcakeFormProps {
  initialData?: {
    name: string;
    description: string;
    price: number;
    image: string;
    featured: boolean;
    new: boolean;
    rating: number;
  };
  id: string;
}

export default function CupcakeForm({ initialData, id }: CupcakeFormProps) {
  const router = useRouter();
  const isNew = id === "new";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CupcakeFormData>({
    resolver: zodResolver(cupcakeSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: initialData.price.toString(),
          rating: initialData.rating.toString(),
        }
      : {
          name: "",
          description: "",
          price: "0",
          image: "",
          featured: false,
          new: false,
          rating: "0",
        },
  });

  const onSubmit: SubmitHandler<CupcakeFormData> = async (data) => {
    try {
      const submitData: CupcakeSubmitData = {
        ...data,
        price: parseFloat(data.price),
        rating: parseFloat(data.rating),
      };

      const response = await fetch(`/api/cupcakes${isNew ? "" : `/${id}`}`, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error("Failed to save cupcake");

      toast.success(`Cupcake ${isNew ? "criado" : "atualizado"} com sucesso`);
      router.push("/admin/cupcakes");
    } catch (error) {
      console.error("Error saving cupcake:", error);
      toast.error(`Erro ao ${isNew ? "criar" : "atualizar"} cupcake`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button
          className="mb-8 flex items-center gap-2"
          variant="ghost"
          onPress={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <h1 className="text-3xl font-bold mb-8">{isNew ? "Novo Cupcake" : "Editar Cupcake"}</h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Nome"
              {...register("name")}
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name}
            />
          </div>

          <div>
            <Input
              label="Descrição"
              {...register("description")}
              errorMessage={errors.description?.message}
              isInvalid={!!errors.description}
            />
          </div>

          <div>
            <Input
              label="Preço"
              step="0.01"
              type="number"
              {...register("price")}
              errorMessage={errors.price?.message}
              isInvalid={!!errors.price}
            />
          </div>

          <div>
            <Input
              label="URL da Imagem"
              {...register("image")}
              errorMessage={errors.image?.message}
              isInvalid={!!errors.image}
            />
          </div>

          <div>
            <Input
              label="Avaliação"
              max="5"
              min="0"
              step="0.1"
              type="number"
              {...register("rating")}
              errorMessage={errors.rating?.message}
              isInvalid={!!errors.rating}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Switch {...register("featured")} />
              <span>Destaque</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch {...register("new")} />
              <span>Novo</span>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button isLoading={isSubmitting} type="submit">
              {isNew ? "Criar" : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
