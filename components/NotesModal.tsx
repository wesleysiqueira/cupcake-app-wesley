"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

import { useCart } from "@/context/CartContext";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
}

export default function NotesModal({ isOpen, onClose, itemId }: NotesModalProps) {
  const { items, updateNotes } = useCart();
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (itemId) {
      const item = items.find((item) => item.id === itemId);

      setNotes(item?.notes || "");
    }
  }, [itemId, items]);

  const handleSave = () => {
    if (itemId) {
      const trimmedNotes = notes.trim();

      if (trimmedNotes) {
        setError("");
        updateNotes(itemId, trimmedNotes);
        onClose();
      } else {
        setError("Por favor, adicione uma observação válida");
      }
    }
  };

  const handleRemove = () => {
    if (itemId) {
      setError("");
      updateNotes(itemId, "");
      onClose();
    }
  };

  return (
    <Dialog className="relative z-50" open={isOpen} onClose={onClose}>
      <div aria-hidden="true" className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">Adicionar Notas</Dialog.Title>

          <textarea
            className="w-full h-32 p-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Digite suas observações aqui..."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setError("");
            }}
          />

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          <div className="mt-4 flex gap-2">
            <button
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
              onClick={handleSave}
            >
              Salvar
            </button>
            {notes && (
              <button
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                onClick={handleRemove}
              >
                Remover
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
