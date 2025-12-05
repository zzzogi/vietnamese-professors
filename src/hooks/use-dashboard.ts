import { useQuery } from "@tanstack/react-query";
import { Professor } from "@prisma/client";

interface DashboardData {
  bookmarks: Array<{
    id: string;
    professorId: string;
    createdAt: string;
    professor: Professor;
  }>;
  recentEmails: Array<{
    id: string;
    professorId: string;
    subject: string;
    content: string;
    language: string;
    createdAt: string;
    professor: {
      id: string;
      name: string;
      email: string;
      university: string;
      imageUrl: string | null;
    };
  }>;
  suggestions: Array<{
    professor: Professor;
    reason: string;
    score: number;
  }>;
  stats: {
    totalBookmarks: number;
    totalEmails: number;
    totalRatings: number;
  };
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard");
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
