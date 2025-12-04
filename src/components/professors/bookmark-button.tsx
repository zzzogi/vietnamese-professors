"use client";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useBookmarkProfessor,
  useIsBookmarked,
} from "@/hooks/use-bookmark-professor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  professorId: string;
}

export function BookmarkButton({ professorId }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const isBookmarked = useIsBookmarked(professorId);
  const { mutate, isPending } = useBookmarkProfessor();

  const handleToggle = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    mutate({ professorId, isBookmarked });
  };

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "w-full transition-colors",
        isBookmarked &&
          "bg-yellow-50 border-yellow-500 text-yellow-700 hover:bg-yellow-100"
      )}
    >
      <Bookmark
        className={cn("mr-2 h-4 w-4", isBookmarked && "fill-current")}
      />
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
