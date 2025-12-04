import { Professor } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Mail, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LeaderboardCardProps {
  professor: Professor;
  rank: number;
  type: "rating" | "contact";
  metric?: {
    averageRating?: number;
    ratingCount?: number;
    contactCount?: number;
  };
}

export function LeaderboardCard({
  professor,
  rank,
  type,
  metric,
}: LeaderboardCardProps) {
  // Special styling for top 3
  const isTop3 = rank <= 3;
  const rankColors = {
    1: "bg-yellow-500 text-white",
    2: "bg-gray-400 text-white",
    3: "bg-orange-600 text-white",
  };

  return (
    <Link href={`/professors/${professor.id}`}>
      <Card
        className={cn(
          "p-4 hover:shadow-lg transition-all cursor-pointer",
          isTop3 && "border-2 border-purple-300 bg-purple-50/30"
        )}
      >
        <div className="flex items-center gap-4">
          {/* Rank Badge */}
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
              isTop3 && rank <= 3
                ? rankColors[rank as keyof typeof rankColors]
                : "bg-gray-200 text-gray-700"
            )}
          >
            {isTop3 && rank === 1 ? <Trophy className="w-5 h-5" /> : rank}
          </div>

          {/* Avatar */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {professor.imageUrl ? (
              <Image
                src={professor.imageUrl}
                alt={professor.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                {professor.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {professor.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {professor.university}
            </p>
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                {professor.major}
              </Badge>
            </div>
          </div>

          {/* Metric */}
          <div className="flex-shrink-0 text-right">
            {type === "rating" && metric?.averageRating !== undefined && (
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg text-gray-900">
                    {metric.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {metric.ratingCount} ratings
                </p>
              </div>
            )}

            {type === "contact" && metric?.contactCount !== undefined && (
              <div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-lg text-gray-900">
                    {metric.contactCount}
                  </span>
                </div>
                <p className="text-xs text-gray-500">contacts</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
