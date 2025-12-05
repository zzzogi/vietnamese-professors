"use client";

import { useState } from "react";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { FilterBar } from "@/components/leaderboard/filter-bar";
import { LeaderboardSection } from "@/components/leaderboard/leaderboard-section";
import { LeaderboardSkeleton } from "@/components/leaderboard/leaderboard-skeleton";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState("all");
  const [location, setLocation] = useState("");
  const [major, setMajor] = useState("");
  const [minRatings, setMinRatings] = useState(3);

  const { data, isLoading, isError } = useLeaderboard({
    timeRange,
    location,
    major,
    minRatings,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Professor Leaderboard
          </h1>
          <p className="text-xl text-gray-600">
            Discover the most highly-rated and contacted professors
          </p>
        </div>

        {/* Filters */}
        {data && (
          <FilterBar
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            location={location}
            setLocation={setLocation}
            major={major}
            setMajor={setMajor}
            minRatings={minRatings}
            setMinRatings={setMinRatings}
            availableLocations={data.filters.locations}
            availableMajors={data.filters.majors}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
              <LeaderboardSkeleton />
            </div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
              <LeaderboardSkeleton />
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">
              Failed to load leaderboard. Please try again.
            </p>
          </div>
        )}

        {/* Data */}
        {!isLoading && !isError && data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LeaderboardSection
              title="⭐ Top Rated Professors"
              type="rating"
              data={data.topRated}
            />
            <LeaderboardSection
              title="✉️ Most Contacted"
              type="contact"
              data={data.mostContacted}
            />
          </div>
        )}
      </div>
    </div>
  );
}
