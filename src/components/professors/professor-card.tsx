"use client";

import { Professor } from "@/hooks/use-professors";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Building2, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RatingDisplay } from "./rating-display";
import { useProfessorRating } from "@/hooks/use-rate-professor";

interface ProfessorCardProps {
  professor: Professor;
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
  const { data: ratingData } = useProfessorRating(professor.id);

  return (
    <Link href={`/professors/${professor.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
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
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {professor.name}
            </h3>

            {/* Rating */}
            {ratingData && ratingData.totalRatings > 0 && (
              <div className="mt-1">
                <RatingDisplay
                  rating={ratingData.averageRating}
                  totalRatings={ratingData.totalRatings}
                  size="sm"
                />
              </div>
            )}

            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{professor.university}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{professor.major}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{professor.location}</span>
              </div>
            </div>

            {professor.bio && (
              <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                {professor.bio}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
