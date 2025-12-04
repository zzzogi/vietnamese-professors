import { Star, Mail } from "lucide-react";
import { LeaderboardCard } from "./leaderboard-card";
import { Professor } from "@prisma/client";

interface LeaderboardSectionProps {
  title: string;
  type: "rating" | "contact";
  data: Array<{
    professor: Professor;
    averageRating?: number;
    ratingCount?: number;
    contactCount?: number;
  }>;
}

export function LeaderboardSection({
  title,
  type,
  data,
}: LeaderboardSectionProps) {
  const Icon = type === "rating" ? Star : Mail;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No data available for selected filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <LeaderboardCard
              key={item.professor.id}
              professor={item.professor}
              rank={index + 1}
              type={type}
              metric={{
                averageRating: item.averageRating,
                ratingCount: item.ratingCount,
                contactCount: item.contactCount,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
