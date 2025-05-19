"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useOrder } from "@/context/OrderContext";
import Input from "@/components/form/Input";
import Header from "@/components/Header";

export default function PagamentoPage() {
  const { addOrder, order, setOrder } = useOrder();
  const [orderData, setOrderData] = useState({
    method: "credit",
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof orderData, string>>>({});
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof typeof orderData, string>> = {};

    if (!orderData.cardHolder) newErrors.cardHolder = "Nome completo é obrigatório";
    if (!orderData.cardNumber) newErrors.cardNumber = "Número do cartão é obrigatório";
    if (!orderData.cardExpiry) newErrors.cardExpiry = "Data de expiração é obrigatória";
    if (!orderData.cardCvv) newErrors.cardCvv = "CVV é obrigatório";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    setOrder({
      ...order,
      status: "pending",
      paymentData: {
        method: "credit",
        cardNumber: orderData.cardNumber.replace(/\s/g, ""),
        cardHolder: orderData.cardHolder,
        cardExpiry: orderData.cardExpiry,
        cardCvv: orderData.cardCvv,
      },
    });

    addOrder(order);

    router.push("/sucesso");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setOrderData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof orderData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Format with spaces every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})/g, "$1 ").trim();

    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);

    setOrderData((prev) => ({ ...prev, cardNumber: formattedValue }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setOrderData((prev) => ({ ...prev, cardExpiry: value }));
    if (errors.cardExpiry) {
      setErrors((prev) => ({ ...prev, cardExpiry: undefined }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    setOrderData((prev) => ({ ...prev, cardCvv: value }));
    if (errors.cardCvv) {
      setErrors((prev) => ({ ...prev, cardCvv: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header backHref="/confirmacao" title="Pagamento" />
      {/* Form */}
      <div className="max-w-4xl mx-auto p-6">
        <form className="space-y-4 max-w-md mx-auto" onSubmit={handleSubmit}>
          <Input
            error={errors.cardHolder}
            id="cardHolder"
            label="Nome Completo no Cartão"
            name="cardHolder"
            value={orderData.cardHolder}
            onChange={handleChange}
          />

          <Input
            error={errors.cardNumber}
            id="cardNumber"
            label="Número do Cartão"
            maxLength={19}
            name="cardNumber"
            value={orderData.cardNumber}
            onChange={handleCardNumberChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              error={errors.cardExpiry}
              id="cardExpiry"
              label="Data de Expiração"
              maxLength={5}
              name="cardExpiry"
              placeholder="MM/AA"
              value={orderData.cardExpiry}
              onChange={handleExpirationDateChange}
            />

            <Input
              error={errors.cardCvv}
              id="cardCvv"
              label="CVV"
              maxLength={3}
              name="cardCvv"
              value={orderData.cardCvv}
              onChange={handleCvvChange}
            />
          </div>

          <button
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            type="submit"
            onClick={handleSubmit}
          >
            Confirmar Pagamento
          </button>
        </form>
      </div>
    </div>
  );
}
