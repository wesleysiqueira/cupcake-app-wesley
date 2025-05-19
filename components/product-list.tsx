import Product from "./product";

interface ProductListProps {
  products: {
    id: number;
    name: string;
    image: string;
    featured: boolean;
    isFavorite: boolean;
  }[];
  onFavoriteToggle: (id: number) => void;
}

export default function ProductList({ products, onFavoriteToggle }: ProductListProps) {
  return (
    <div className="grid h-full grid-cols-2 xs-max:grid-cols-1 gap-4 mb-2">
      {products.map((product) => (
        <Product key={product.id} {...product} onFavoriteToggle={onFavoriteToggle} />
      ))}
    </div>
  );
}
