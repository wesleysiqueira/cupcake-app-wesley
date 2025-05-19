export interface Cupcake {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  new: boolean;
  rating: number;
  favorite?: boolean;
  ingredients?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type FilterType = "all" | "new" | "featured";
