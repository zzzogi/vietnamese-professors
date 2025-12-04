import { useQuery } from "@tanstack/react-query";
import { Professor } from "@prisma/client";

interface LeaderboardFilters {
  timeRange?: string;
  location?: string;
  major?: string;
  minRatings?: number;
}

interface LeaderboardData {
  topRated: Array<{
    professor: Professor;
    averageRating: number;
    ratingCount: number;
  }>;
  mostContacted: Array<{
    professor: Professor;
    contactCount: number;
  }>;
  filters: {
    locations: string[];
    majors: string[];
  };
}

/**
 * Hook to fetch leaderboard data with filters
 */
export function useLeaderboard(filters: LeaderboardFilters = {}) {
  const {
    timeRange = "all",
    location = "",
    major = "",
    minRatings = 3,
  } = filters;

  return useQuery<LeaderboardData>({
    queryKey: ["leaderboard", { timeRange, location, major, minRatings }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (timeRange) params.set("timeRange", timeRange);
      if (location) params.set("location", location);
      if (major) params.set("major", major);
      params.set("minRatings", minRatings.toString());

      const response = await fetch(`/api/leaderboard?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
