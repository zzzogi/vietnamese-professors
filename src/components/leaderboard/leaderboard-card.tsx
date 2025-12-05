import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Crown, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LeaderboardCardProps {
  professor: {
    id: string;
    name: string;
    university: string;
    major: string;
    imageUrl: string | null;
    avgRating: number;
    totalRatings: number;
    isPro: boolean;
  };
  rank: number;
  isLocked?: boolean;
}

export function LeaderboardCard({
  professor,
  rank,
  isLocked = false,
}: LeaderboardCardProps) {
  const content = (
    <Card
      className={`p-6 ${
        isLocked ? "blur-sm opacity-60 cursor-not-allowed" : "hover:shadow-lg"
      } transition-all border-gray-200`}
    >
      <div className="flex items-center gap-4">
        {/* Rank Badge */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
            rank === 1
              ? "bg-yellow-400 text-gray-900"
              : rank === 2
              ? "bg-gray-300 text-gray-900"
              : rank === 3
              ? "bg-orange-400 text-gray-900"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {rank}
        </div>

        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {professor.imageUrl ? (
            <Image
              src={professor.imageUrl}
              alt={professor.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
              {professor.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {professor.name}
            </h3>
            {professor.isPro && (
              <Crown className="w-4 h-4 text-purple-600 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-600 truncate mb-2">
            {professor.university}
          </p>
          <Badge variant="secondary" className="text-xs">
            {professor.major}
          </Badge>
        </div>

        {/* Rating */}
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-lg font-bold text-gray-900">
              {professor.avgRating.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {professor.totalRatings} reviews
          </p>
        </div>
      </div>
    </Card>
  );

  if (isLocked) {
    return <div className="relative">{content}</div>;
  }

  return <Link href={`/professors/${professor.id}`}>{content}</Link>;
}
