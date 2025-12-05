"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

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

const universities = [
  "All Universities",
  "Vietnam National University",
  "Hanoi University of Science and Technology",
  "University of Economics Ho Chi Minh City",
  "Can Tho University",
  "Hue University",
];

const majors = [
  "All Majors",
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Medicine",
  "Economics",
  "Biology",
];

const locations = [
  "All Locations",
  "Hanoi",
  "Ho Chi Minh City",
  "Da Nang",
  "Can Tho",
  "Hue",
];

export function ProfessorFilters({
  onFilterChange,
  initialFilters = { search: "", university: "", major: "", location: "" },
}: ProfessorFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    const actualValue = value.startsWith("All") ? "" : value;
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
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search || filters.university || filters.major || filters.location;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or topic..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* University */}
        <Select
          value={filters.university || "All Universities"}
          onValueChange={(value) => handleSelectChange("university", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="University" />
          </SelectTrigger>
          <SelectContent>
            {universities.map((uni) => (
              <SelectItem key={uni} value={uni}>
                {uni}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Major */}
        <Select
          value={filters.major || "All Majors"}
          onValueChange={(value) => handleSelectChange("major", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Major" />
          </SelectTrigger>
          <SelectContent>
            {majors.map((major) => (
              <SelectItem key={major} value={major}>
                {major}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select
          value={filters.location || "All Locations"}
          onValueChange={(value) => handleSelectChange("location", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="lg:col-span-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
