import { IoSearch } from "react-icons/io5";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-white">
        <IoSearch className="h-4 w-4" />
      </div>
      <input
        className="w-full rounded-lg border border-orange-400 bg-orange-400 py-2 pl-10 pr-4 text-sm text-white shadow-sm placeholder:text-orange-200"
        placeholder="Pesquisar"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
