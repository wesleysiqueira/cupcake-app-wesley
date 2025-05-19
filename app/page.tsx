"use client";

import { useState } from "react";

import ProductList from "@/components/product-list";
import SearchBar from "@/components/search-bar";
import Filters from "@/components/filters";
import Pagination from "@/components/pagination";
import { FilterType } from "@/types/cupcake";
import { useCupcake } from "@/context/CupcakeContext";

export default function CupcakePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { cupcakes: cupcakesList, toggleFavorite } = useCupcake();

  const itemsPerPage = 4;

  const filteredCupcakes = cupcakesList
    .filter((cupcake) => {
      const matchesSearch = cupcake.name.toLowerCase().startsWith(searchQuery.toLowerCase());

      switch (currentFilter) {
        case "new":
          return matchesSearch && cupcake.new;
        case "featured":
          return matchesSearch && cupcake.featured;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      return a.name.localeCompare(b.name);
    });

  const totalPages = Math.ceil(filteredCupcakes.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCupcakes = filteredCupcakes.slice(startIndex, endIndex);

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    setCurrentPage(0);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-white px-4 pb-16 pt-6 text-balance font-sans">
      <SearchBar value={searchQuery} onChange={handleSearch} />
      <Filters currentFilter={currentFilter} onFilterChange={handleFilterChange} />
      <div className="flex-1">
        <ProductList products={currentCupcakes} onFavoriteToggle={toggleFavorite} />
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
