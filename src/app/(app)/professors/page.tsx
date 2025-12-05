"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ProfessorFilters,
  FilterState,
} from "@/components/professors/professor-filters";
import { ProfessorGrid } from "@/components/professors/professor-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserRole } from "@/hooks/use-user-role";
import { AlertCircle } from "lucide-react";

export default function ProfessorsPage() {
  const { role } = useUserRole();
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
      <div className="mb-8">
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

      {/* Results Count */}
      {data && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {data.professors.length} of {data.pagination.total}{" "}
            professors
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
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      ) : data?.professors.length > 0 ? (
        <>
          <ProfessorGrid professors={data.professors} userRole={role} />

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">No professors found</p>
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
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
