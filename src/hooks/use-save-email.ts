import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface SaveEmailParams {
  professorId: string;
  subject: string;
  content: string;
  language: string;
}

interface SavedEmail {
  id: string;
  userId: string;
  professorId: string;
  subject: string;
  content: string;
  language: string;
  createdAt: string;
  professor: {
    id: string;
    name: string;
    email: string;
    university: string;
    imageUrl: string | null;
  };
}

/**
 * Hook to fetch user's saved emails
 */
export function useSavedEmails() {
  return useQuery<{ emails: SavedEmail[] }>({
    queryKey: ["saved-emails"],
    queryFn: async () => {
      const response = await fetch("/api/emails");
      if (!response.ok) throw new Error("Failed to fetch saved emails");
      return response.json();
    },
  });
}

/**
 * Hook to save email draft
 */
export function useSaveEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SaveEmailParams) => {
      const response = await fetch("/api/emails/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save email");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Email draft saved!");
      queryClient.invalidateQueries({ queryKey: ["saved-emails"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save email");
    },
  });
}
