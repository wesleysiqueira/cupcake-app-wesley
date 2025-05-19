"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { Title } from "@/components/text/Title";
import { Text } from "@/components/text/Text";
import Header from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);

        return;
      }

      toast.success("Login realizado com sucesso!");
      router.push("/perfil");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Login" />

      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <Title variant="h2">Bem-vindo de volta!</Title>
          <Text>Entre com sua conta para continuar</Text>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              id="email"
              name="email"
              placeholder="seu@email.com"
              type="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Senha
            </label>
            <input
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
            />
          </div>

          <button
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            type="submit"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Text className="!mb-0">
            Não tem uma conta?{" "}
            <Link className="text-orange-500 hover:text-orange-600" href="/cadastro">
              Cadastre-se
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}
