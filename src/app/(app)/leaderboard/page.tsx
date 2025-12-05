"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { FilterBar } from "@/components/leaderboard/filter-bar";
import { LeaderboardSection } from "@/components/leaderboard/leaderboard-section";
import { LeaderboardSkeleton } from "@/components/leaderboard/leaderboard-skeleton";
import { Button } from "@/components/ui/button";
import { Trophy, LogIn, Lock } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/leaderboard");
    }
  }, [status, router]);

  // ✅ Show loading during auth check
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Show login prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-purple-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Sign In Required
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
              Please sign in to view the professor leaderboard and discover
              top-rated professors
            </p>

            {/* Preview Cards (Blurred) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-2xl">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-6 shadow-sm filter blur-sm pointer-events-none"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-400" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link href="/login?callbackUrl=/leaderboard">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register?callbackUrl=/leaderboard">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Benefits */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-3">Sign in to access:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Full rankings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Advanced filters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Professor details</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Authenticated - show full leaderboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
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
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 text-lg font-semibold mb-2">
              Failed to load leaderboard
            </p>
            <p className="text-gray-600">Please try again later</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Data */}
        {!isLoading && !isError && data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LeaderboardSection
              title="Top Rated Professors"
              type="rating"
              data={data.topRated}
            />
            <LeaderboardSection
              title="Most Contacted"
              type="contact"
              data={data.mostContacted}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          !isError &&
          data &&
          data.topRated.length === 0 &&
          data.mostContacted.length === 0 && (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more professors
              </p>
              <Button
                onClick={() => {
                  setLocation("");
                  setMajor("");
                  setMinRatings(3);
                  setTimeRange("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}
