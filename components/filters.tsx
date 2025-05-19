type FilterType = "all" | "new" | "featured";

interface FiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function Filters({ currentFilter, onFilterChange }: FiltersProps) {
  return (
    <div className="mb-4 xs-max:mb-8 flex justify-around gap-2 text-sm font-semibold xs-max:flex-col">
      <button
        onClick={() => onFilterChange("all")}
        className={`rounded-full px-4 py-1 ${
          currentFilter === "all"
            ? "bg-orange-400 text-white"
            : "border border-orange-400 text-orange-400"
        }`}
      >
        Tudo
      </button>
      <button
        onClick={() => onFilterChange("new")}
        className={`rounded-full px-4 py-1 ${
          currentFilter === "new"
            ? "bg-orange-400 text-white"
            : "border border-orange-400 text-orange-400"
        }`}
      >
        Novidades
      </button>
      <button
        onClick={() => onFilterChange("featured")}
        className={`rounded-full px-4 py-1 ${
          currentFilter === "featured"
            ? "bg-orange-400 text-white"
            : "border border-orange-400 text-orange-400"
        }`}
      >
        Populares
      </button>
    </div>
  );
}
