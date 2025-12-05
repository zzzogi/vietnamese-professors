import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/lib/constants/roles";
import { Professor } from "@prisma/client";
import { Bookmark, Building2, Crown, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProfessorCardProps {
  professor: Professor & {
    averageRating?: number;
    totalRatings?: number;
    totalBookmarks?: number;
  };
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
  // Check if this is a PRO-only professor
  const { hasRole } = useUserRole();
  const isLocked = professor.isPro && !hasRole(UserRole.PRO);

  if (isLocked) {
    return (
      <Card className="overflow-hidden border-2 border-purple-200 relative">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <Crown className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900 mb-2">PRO Only</p>
            <p className="text-sm text-gray-600 mb-4">
              Upgrade to view this professor
            </p>
            <Link href="/pricing">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Upgrade to PRO
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-6 filter blur-sm pointer-events-none">
          <div className="p-6">
            {/* Header with Avatar */}
            <div className="flex items-start gap-4 mb-4">
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

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {professor.name}
                  </h3>
                  {professor.isPro && (
                    <Crown className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  )}
                </div>

                {/* Rating */}
                {professor.averageRating && professor.totalRatings ? (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {professor.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({professor.totalRatings})
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mb-2">No ratings yet</p>
                )}

                <Badge variant="secondary" className="text-xs">
                  {professor.major}
                </Badge>
              </div>
            </div>

            {/* University & Location */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{professor.university}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{professor.location}</span>
              </div>
            </div>

            {/* Bio Preview */}
            {professor.bio && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {professor.bio}
              </p>
            )}

            {/* Research Interests */}
            {professor.researchInterests &&
              professor.researchInterests.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {professor.researchInterests
                    .slice(0, 2)
                    .map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded"
                      >
                        {interest}
                      </span>
                    ))}
                  {professor.researchInterests.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      +{professor.researchInterests.length - 2} more
                    </span>
                  )}
                </div>
              )}

            {/* Actions */}
            <div className="flex gap-2">
              <Link href={`/professors/${professor.id}`} className="flex-1">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  View Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border-gray-200">
      <div className="p-6">
        {/* Header with Avatar */}
        <div className="flex items-start gap-4 mb-4">
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

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {professor.name}
              </h3>
              {professor.isPro && (
                <Crown className="w-4 h-4 text-purple-600 flex-shrink-0" />
              )}
            </div>

            {/* Rating */}
            {professor.averageRating && professor.totalRatings ? (
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-900">
                  {professor.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">
                  ({professor.totalRatings})
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mb-2">No ratings yet</p>
            )}

            <Badge variant="secondary" className="text-xs">
              {professor.major}
            </Badge>
          </div>
        </div>

        {/* University & Location */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{professor.university}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{professor.location}</span>
          </div>
        </div>

        {/* Bio Preview */}
        {professor.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {professor.bio}
          </p>
        )}

        {/* Research Interests */}
        {professor.researchInterests &&
          professor.researchInterests.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {professor.researchInterests.slice(0, 2).map((interest, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded"
                >
                  {interest}
                </span>
              ))}
              {professor.researchInterests.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  +{professor.researchInterests.length - 2} more
                </span>
              )}
            </div>
          )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/professors/${professor.id}`} className="flex-1">
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              View Profile
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
