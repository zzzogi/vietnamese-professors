import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface BookmarkResponse {
  bookmarks: Array<{
    id: string;
    professorId: string;
    createdAt: string;
    professor: any;
  }>;
}

/**
 * Hook to fetch user's bookmarks
 */
export function useBookmarks() {
  return useQuery<BookmarkResponse>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const response = await fetch("/api/bookmarks");
      if (!response.ok) throw new Error("Failed to fetch bookmarks");
      return response.json();
    },
  });
}

/**
 * Hook to check if professor is bookmarked
 */
export function useIsBookmarked(professorId: string) {
  const { data } = useBookmarks();
  return data?.bookmarks.some((b) => b.professorId === professorId) || false;
}

/**
 * Hook to toggle bookmark
 */
export function useBookmarkProfessor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      professorId,
      isBookmarked,
    }: {
      professorId: string;
      isBookmarked: boolean;
    }) => {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(
          `/api/bookmarks?professorId=${professorId}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to remove bookmark");
        return response.json();
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ professorId }),
        });
        if (!response.ok) throw new Error("Failed to add bookmark");
        return response.json();
      }
    },
    onMutate: async ({ professorId, isBookmarked }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });

      // Snapshot previous value
      const previousBookmarks = queryClient.getQueryData(["bookmarks"]);

      // Optimistically update
      queryClient.setQueryData(["bookmarks"], (old: any) => {
        if (!old) return old;

        if (isBookmarked) {
          // Remove
          return {
            ...old,
            bookmarks: old.bookmarks.filter(
              (b: any) => b.professorId !== professorId
            ),
          };
        } else {
          // Add (simplified, real data comes from server)
          return {
            ...old,
            bookmarks: [
              { id: "temp", professorId, createdAt: new Date().toISOString() },
              ...old.bookmarks,
            ],
          };
        }
      });

      return { previousBookmarks };
    },
    onError: (err, variables, context) => {
      // Revert on error
      queryClient.setQueryData(["bookmarks"], context?.previousBookmarks);
      toast.error("Failed to update bookmark");
    },
    onSuccess: (data, { isBookmarked }) => {
      toast.success(isBookmarked ? "Bookmark removed" : "Bookmark added");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}
