"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRateProfessor } from "@/hooks/use-rate-professor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface RatingInputProps {
  professorId: string;
  currentRating: number | null;
}

export function RatingInput({ professorId, currentRating }: RatingInputProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [hoveredStar, setHoveredStar] = useState(0);
  const { mutate, isPending } = useRateProfessor(professorId);

  const handleRate = (rating: number) => {
    if (!session) {
      router.push("/login");
      return;
    }
    mutate(rating);
  };

  const displayRating = hoveredStar || currentRating || 0;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-700">
        {currentRating ? "Your rating:" : "Rate this professor:"}
      </p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isPending}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => handleRate(star)}
            className="transition-transform hover:scale-110 disabled:opacity-50"
          >
            <Star
              className={cn(
                "h-6 w-6",
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        ))}
        {currentRating && (
          <span className="ml-2 text-sm text-gray-600">{currentRating}/5</span>
        )}
      </div>
    </div>
  );
}
