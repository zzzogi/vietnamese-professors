import { Professor } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SuggestedProfessorCardProps {
  professor: Professor;
  reason: string;
  score: number;
}

export function SuggestedProfessorCard({
  professor,
  reason,
}: SuggestedProfessorCardProps) {
  return (
    <Link href={`/professors/${professor.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {professor.imageUrl ? (
              <Image
                src={professor.imageUrl}
                alt={professor.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                {professor.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {professor.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {professor.university}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-purple-600">
              <Lightbulb className="w-3 h-3" />
              <span className="truncate">{reason}</span>
            </div>
          </div>
        </div>

        {professor.researchInterests &&
          professor.researchInterests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {professor.researchInterests.slice(0, 2).map((interest, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
      </Card>
    </Link>
  );
}
