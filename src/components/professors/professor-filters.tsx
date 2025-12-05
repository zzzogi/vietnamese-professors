"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfessorFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  search: string;
  university: string;
  major: string;
  location: string;
}

export function ProfessorFilters({
  onFilterChange,
  initialFilters = { search: "", university: "", major: "", location: "" },
}: ProfessorFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search);

  // Fetch dynamic filter options
  const { data: filterOptions, isLoading } = useQuery({
    queryKey: ["professor-filters"],
    queryFn: async () => {
      const response = await fetch("/api/professors/filters");
      if (!response.ok) throw new Error("Failed to fetch filters");
      return response.json();
    },
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        const newFilters = { ...filters, search: searchInput };
        setFilters(newFilters);
        onFilterChange(newFilters);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [filters, searchInput, onFilterChange]);

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    const actualValue = value === "all" ? "" : value;
    const newFilters = { ...filters, [key]: actualValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      search: "",
      university: "",
      major: "",
      location: "",
    };
    setFilters(clearedFilters);
    setSearchInput("");
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search || filters.university || filters.major || filters.location;

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filter Professors</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="ml-auto text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search - Full Width on Mobile, 2 Cols on Desktop */}
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Name, email, or research topic..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>

        {/* University */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">
            University
          </label>
          <Select
            value={filters.university || "all"}
            onValueChange={(value) => handleSelectChange("university", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Universities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {filterOptions?.universities.map((uni: string) => (
                <SelectItem key={uni} value={uni}>
                  {uni}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Major */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">
            Major
          </label>
          <Select
            value={filters.major || "all"}
            onValueChange={(value) => handleSelectChange("major", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Majors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Majors</SelectItem>
              {filterOptions?.majors.map((major: string) => (
                <SelectItem key={major} value={major}>
                  {major}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location - Full Width on Tablet */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">
            Location
          </label>
          <Select
            value={filters.location || "all"}
            onValueChange={(value) => handleSelectChange("location", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {filterOptions?.locations.map((loc: string) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-600">
            Active filters:
          </span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md">
              Search: &quot;{filters.search}&quot;
              <button
                onClick={() => {
                  setSearchInput("");
                  handleSelectChange("search", "");
                }}
                className="hover:bg-purple-100 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.university && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
              {filters.university}
              <button
                onClick={() => handleSelectChange("university", "all")}
                className="hover:bg-blue-100 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.major && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
              {filters.major}
              <button
                onClick={() => handleSelectChange("major", "all")}
                className="hover:bg-green-100 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md">
              {filters.location}
              <button
                onClick={() => handleSelectChange("location", "all")}
                className="hover:bg-orange-100 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
