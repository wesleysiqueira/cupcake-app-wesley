"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Cupcake } from "@/types/cupcake";

export interface CartItem extends Cupcake {
  quantity: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (cupcake: Cupcake, quantity: number) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  updateNotes: (itemId: number, notes: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (cupcake: Cupcake, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === cupcake.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === cupcake.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...cupcake, quantity }];
    });
  };

  const removeItem = (itemId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const updateNotes = (itemId: number, notes: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, notes } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
