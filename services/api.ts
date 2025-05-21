import { Cupcake, Order, Favorite } from "@prisma/client";

// Types
export type OrderWithItems = Order & {
  items: Array<
    {
      id: string;
      quantity: number;
      price: number;
      notes?: string;
    } & Cupcake
  >;
};

export type FavoriteWithCupcake = Favorite & {
  cupcake: Cupcake;
};

// Cupcakes
export async function getCupcakes(userId?: string): Promise<(Cupcake & { isFavorite: boolean })[]> {
  const url = userId ? `/api/cupcakes?userId=${userId}` : "/api/cupcakes";
  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch cupcakes");

  return response.json();
}

// Favorites
export async function getFavorites(userId: string): Promise<FavoriteWithCupcake[]> {
  const response = await fetch(`/api/favorites?userId=${userId}`);

  if (!response.ok) throw new Error("Failed to fetch favorites");

  return response.json();
}

export async function addFavorite(userId: string, cupcakeId: number): Promise<FavoriteWithCupcake> {
  const response = await fetch("/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, cupcakeId }),
  });

  if (!response.ok) throw new Error("Failed to add favorite");

  return response.json();
}

export async function removeFavorite(userId: string, cupcakeId: number): Promise<void> {
  const response = await fetch(`/api/favorites?userId=${userId}&cupcakeId=${cupcakeId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to remove favorite");
}

// Orders
export async function getOrders(userId: string): Promise<OrderWithItems[]> {
  const response = await fetch(`/api/orders?userId=${userId}`);

  if (!response.ok) throw new Error("Failed to fetch orders");

  return response.json();
}

export async function createOrder(data: {
  userId: string;
  items: Array<{
    cupcakeId: number;
    quantity: number;
    price: number;
    notes?: string;
  }>;
  total: number;
  deliveryDate: string;
  paymentMethod: string;
}): Promise<OrderWithItems> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create order");

  return response.json();
}

// User Profile
export async function updateUser(data: { name?: string; email?: string; address?: string }) {
  const response = await fetch("/api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || "Failed to update profile");
  }

  return response.json();
}
