"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  professorId: string;
}

export function BookmarkButton({ professorId }: BookmarkButtonProps) {
  // Dummy state - in production, this would sync with backend
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleToggle = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement API call to save bookmark
    console.log(
      `Bookmark ${isBookmarked ? "removed" : "added"} for professor:`,
      professorId
    );
  };

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      className={cn(
        "transition-colors",
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
