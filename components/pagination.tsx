import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    onPageChange(Math.max(0, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages - 1, currentPage + 1));
  };

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-500 disabled:opacity-50"
      >
        <IoChevronBack className="h-4 w-4" />
        Anterior
      </button>

      <div className="flex space-x-1">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentPage ? "bg-orange-500" : "bg-orange-200"
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-500 disabled:opacity-50"
      >
        Próximo
        <IoChevronForward className="h-4 w-4" />
      </button>
    </div>
  );
}
