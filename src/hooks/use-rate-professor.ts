import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface RatingData {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}

/**
 * Hook to fetch professor ratings
 */
export function useProfessorRating(professorId: string) {
  return useQuery<RatingData>({
    queryKey: ["rating", professorId],
    queryFn: async () => {
      const response = await fetch(`/api/ratings?professorId=${professorId}`);
      if (!response.ok) throw new Error("Failed to fetch ratings");
      return response.json();
    },
  });
}

/**
 * Hook to rate professor
 */
export function useRateProfessor(professorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rating: number) => {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professorId, rating }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save rating");
      }

      return response.json();
    },
    onMutate: async (newRating) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["rating", professorId] });

      // Snapshot previous value
      const previousRating = queryClient.getQueryData(["rating", professorId]);

      // Optimistically update
      queryClient.setQueryData(["rating", professorId], (old: any) => {
        if (!old) return old;

        const oldUserRating = old.userRating || 0;
        const totalRatings = old.totalRatings;
        const oldAvg = old.averageRating || 0;

        // Calculate new average
        let newAvg;
        let newTotal;

        if (oldUserRating === 0) {
          // User hasn't rated before
          newTotal = totalRatings + 1;
          newAvg = (oldAvg * totalRatings + newRating) / newTotal;
        } else {
          // User updating existing rating
          newTotal = totalRatings;
          newAvg =
            (oldAvg * totalRatings - oldUserRating + newRating) / newTotal;
        }

        return {
          averageRating: newAvg,
          totalRatings: newTotal,
          userRating: newRating,
        };
      });

      return { previousRating };
    },
    onError: (err, variables, context) => {
      // Revert on error
      queryClient.setQueryData(
        ["rating", professorId],
        context?.previousRating
      );
      toast.error("Failed to save rating");
    },
    onSuccess: () => {
      toast.success("Rating saved!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["rating", professorId] });
    },
  });
}
