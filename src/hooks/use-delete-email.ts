import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailId: string) => {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete email");
      }

      return response.json();
    },
    onMutate: async (emailId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });
      await queryClient.cancelQueries({ queryKey: ["saved-emails"] });

      // Snapshot previous values
      const previousDashboard = queryClient.getQueryData(["dashboard"]);
      const previousEmails = queryClient.getQueryData(["saved-emails"]);

      // Optimistically update dashboard
      queryClient.setQueryData(["dashboard"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          recentEmails: old.recentEmails.filter((e: any) => e.id !== emailId),
          stats: {
            ...old.stats,
            totalEmails: old.stats.totalEmails - 1,
          },
        };
      });

      // Optimistically update emails page
      queryClient.setQueryData(["saved-emails"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          emails: old.emails.filter((e: any) => e.id !== emailId),
        };
      });

      return { previousDashboard, previousEmails };
    },
    onError: (err, variables, context) => {
      // Revert on error
      queryClient.setQueryData(["dashboard"], context?.previousDashboard);
      queryClient.setQueryData(["saved-emails"], context?.previousEmails);
      toast.error("Failed to delete email");
    },
    onSuccess: () => {
      toast.success("Email deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["saved-emails"] });
    },
  });
}
