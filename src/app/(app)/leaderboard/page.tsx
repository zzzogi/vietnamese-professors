"use client";

import { useQuery } from "@tanstack/react-query";
import { LeaderboardCard } from "@/components/leaderboard/leaderboard-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserRole } from "@/hooks/use-user-role";
import { AlertCircle, Trophy, Crown } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  const { role, isGuest } = useUserRole();

  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to Load Leaderboard
        </h2>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">
            Professor Leaderboard
          </h1>
        </div>
        <p className="text-gray-600">
          Top-rated professors based on student reviews and ratings
        </p>
      </div>

      {/* Guest Notice */}
      {isGuest && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900 mb-1">
                Limited Preview
              </p>
              <p className="text-sm text-purple-700 mb-3">
                You're viewing the top 5 professors. Sign in to see the full
                leaderboard.
              </p>
              <Link href="/signup">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : data?.leaderboard.length > 0 ? (
        <div className="space-y-4">
          {data.leaderboard.map((professor: any, index: number) => {
            const rank = index + 1;
            const isLocked = isGuest && rank > (data.viewLimit as number);

            return (
              <LeaderboardCard
                key={professor.id}
                professor={professor}
                rank={rank}
                isLocked={isLocked}
              />
            );
          })}

          {/* Upgrade CTA for locked items */}
          {isGuest && data.leaderboard.length >= data.viewLimit && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                See Full Rankings
              </h3>
              <p className="text-gray-600 mb-4">
                Sign in to view all professors in the leaderboard
              </p>
              <Link href="/signup">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No ratings available yet</p>
        </div>
      )}
    </div>
  );
}
