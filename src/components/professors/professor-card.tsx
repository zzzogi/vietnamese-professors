import { Professor } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProfessorCardProps {
  professor: Professor;
  showProBadge?: boolean;
}

export function ProfessorCard({
  professor,
  showProBadge = true,
}: ProfessorCardProps) {
  return (
    <Link href={`/professors/${professor.id}`}>
      <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full border border-gray-200 hover:border-purple-300">
        {/* PRO Badge */}
        {showProBadge && professor.isPro && (
          <div className="mb-3">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <Crown className="w-3 h-3 mr-1" />
              PRO
            </Badge>
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
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
            <h3 className="font-semibold text-gray-900 truncate mb-1">
              {professor.name}
            </h3>
            <p className="text-sm text-gray-600 truncate mb-2">
              {professor.university}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{professor.location}</span>
            </div>
          </div>
        </div>

        {/* Major */}
        <div className="mb-3">
          <Badge variant="secondary" className="text-xs">
            {professor.major}
          </Badge>
        </div>

        {/* Research Interests */}
        {professor.researchInterests &&
          professor.researchInterests.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {professor.researchInterests.slice(0, 2).map((interest, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {interest}
                </span>
              ))}
              {professor.researchInterests.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{professor.researchInterests.length - 2}
                </span>
              )}
            </div>
          )}

        {/* Email */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
          <Mail className="w-3 h-3" />
          <span className="truncate">{professor.email}</span>
        </div>
      </Card>
    </Link>
  );
}
