import { IoStar, IoStarOutline } from "react-icons/io5";
import Link from "next/link";

interface ProductProps {
  id: number;
  name: string;
  image: string;
  featured: boolean;
  isFavorite: boolean;
  onFavoriteToggle: (id: number) => void;
}

export default function Product({
  id,
  name,
  image,
  featured,
  isFavorite,
  onFavoriteToggle,
}: ProductProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle(id);
  };

  return (
    <Link href={`/cupcake/${id}`}>
      <div
        className={`relative flex h-full flex-col rounded-2xl p-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] ${
          featured ? "bg-orange-100" : "border border-orange-200"
        }`}
      >
        <button
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-orange-500 transition-colors hover:bg-white"
          onClick={handleFavoriteClick}
        >
          {isFavorite ? <IoStar className="h-7 w-7" /> : <IoStarOutline className="h-7 w-7" />}
        </button>
        <div className="relative flex-1 overflow-hidden rounded-xl">
          <img alt={name} className="h-full w-full object-cover" src={image} />
        </div>
        <p className="mt-2 text-center text-sm font-medium">{name}</p>
      </div>
    </Link>
  );
}
