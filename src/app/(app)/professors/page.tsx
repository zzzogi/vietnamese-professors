"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ProfessorFilters,
  FilterState,
} from "@/components/professors/professor-filters";
import { ProfessorCard } from "@/components/professors/professor-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProfessorsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    university: "",
    major: "",
    location: "",
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["professors", filters, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: "12",
      });

      const response = await fetch(`/api/professors?${params}`);
      if (!response.ok) throw new Error("Failed to fetch professors");
      return response.json();
    },
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to Load Professors
        </h2>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Browse Professors
        </h1>
        <p className="text-gray-600">
          Discover and connect with verified professors across Vietnam
        </p>
      </div>

      {/* Filters */}
      <ProfessorFilters
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* Results Info */}
      {data && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {data.pagination.total > 0 ? (
              <>
                Showing {(page - 1) * 12 + 1}-
                {Math.min(page * 12, data.pagination.total)} of{" "}
                {data.pagination.total} professors
              </>
            ) : (
              "No professors found"
            )}
          </p>
          {data.userRole === "GUEST" && (
            <p className="text-sm text-purple-600 font-medium">
              Sign in to view all professors
            </p>
          )}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : data?.professors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.professors.map((professor: any) => (
              <ProfessorCard key={professor.id} professor={professor} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: data.pagination.totalPages }).map(
                  (_, i) => {
                    const pageNum = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      pageNum === 1 ||
                      pageNum === data.pagination.totalPages ||
                      Math.abs(pageNum - page) <= 1
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className={
                            page === pageNum
                              ? "bg-purple-600 hover:bg-purple-700"
                              : ""
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4 text-lg">No professors found</p>
          <p className="text-sm text-gray-500 mb-4">
            Try adjusting your filters to see more results
          </p>
          <Button
            variant="outline"
            onClick={() =>
              handleFilterChange({
                search: "",
                university: "",
                major: "",
                location: "",
              })
            }
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
