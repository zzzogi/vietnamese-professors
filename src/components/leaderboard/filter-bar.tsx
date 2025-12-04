"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface FilterBarProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  major: string;
  setMajor: (value: string) => void;
  minRatings: number;
  setMinRatings: (value: number) => void;
  availableLocations: string[];
  availableMajors: string[];
}

export function FilterBar({
  timeRange,
  setTimeRange,
  location,
  setLocation,
  major,
  setMajor,
  minRatings,
  setMinRatings,
  availableLocations,
  availableMajors,
}: FilterBarProps) {
  return (
    <Card className="p-4 mb-6 sticky top-0 z-10 bg-white shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Time Range */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Time Range
          </label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location - ✅ FIX: Use "all" instead of "" */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Location
          </label>
          <Select
            value={location || "all"}
            onValueChange={(val) => setLocation(val === "all" ? "" : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {availableLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Major - ✅ FIX: Use "all" instead of "" */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Major/Field
          </label>
          <Select
            value={major || "all"}
            onValueChange={(val) => setMajor(val === "all" ? "" : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Majors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Majors</SelectItem>
              {availableMajors.map((maj) => (
                <SelectItem key={maj} value={maj}>
                  {maj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Ratings */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Minimum Ratings
          </label>
          <Select
            value={minRatings.toString()}
            onValueChange={(val) => setMinRatings(parseInt(val))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">At least 3</SelectItem>
              <SelectItem value="5">At least 5</SelectItem>
              <SelectItem value="10">At least 10</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
