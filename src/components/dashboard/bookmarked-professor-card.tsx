import { Professor } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useBookmarkProfessor,
  useIsBookmarked,
} from "@/hooks/use-bookmark-professor";

interface BookmarkedProfessorCardProps {
  professor: Professor;
}

export function BookmarkedProfessorCard({
  professor,
}: BookmarkedProfessorCardProps) {
  const isBookmarked = useIsBookmarked(professor.id);
  const { mutate, isPending } = useBookmarkProfessor();

  const handleUnbookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    mutate({ professorId: professor.id, isBookmarked: true });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <Link href={`/professors/${professor.id}`}>
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
            <p className="text-xs text-gray-500 mt-1">{professor.major}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnbookmark}
            disabled={isPending}
            className="flex-shrink-0"
          >
            <Bookmark className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </Button>
        </div>
      </Link>
    </Card>
  );
}
