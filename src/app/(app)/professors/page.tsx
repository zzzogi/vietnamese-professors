"use client";

import { useState } from "react";
import { useProfessors } from "@/hooks/use-professors";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchBar } from "@/components/professors/search-bar";
import { ProfessorCard } from "@/components/professors/professor-card";
import { Pagination } from "@/components/professors/pagination";
import { Loader2 } from "lucide-react";

export default function ProfessorsPage() {
  // State cho search và filters
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search input (chỉ gọi API sau 400ms user ngừng gõ)
  const debouncedSearch = useDebounce(searchInput, 400);

  // Fetch data với React Query
  const { data, isLoading, isError, error } = useProfessors({
    search: debouncedSearch,
    page,
    limit: 12,
  });

  // Reset về page 1 khi search thay đổi
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Professors Directory
          </h1>
          <p className="text-gray-600">
            Browse and search through our database of{" "}
            {data?.pagination.total || 0} professors
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search by name, university, or major..."
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error?.message || "Failed to load professors"}
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && data && (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {data.data.length} of {data.pagination.total} results
              {debouncedSearch && ` for "${debouncedSearch}"`}
            </div>

            {/* Professor Grid */}
            {data.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {data.data.map((professor) => (
                  <ProfessorCard key={professor.id} professor={professor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No professors found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search terms
                </p>
              </div>
            )}

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
