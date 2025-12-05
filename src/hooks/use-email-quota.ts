"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface EmailQuotaData {
  remaining: number | "unlimited";
  total: number;
  used: number;
  resetDate: string;
}

export function useEmailQuota() {
  const { data: session } = useSession();

  return useQuery<EmailQuotaData>({
    queryKey: ["email-quota", session?.user?.email],
    queryFn: async () => {
      const response = await fetch("/api/user/quota");
      if (!response.ok) throw new Error("Failed to fetch quota");
      return response.json();
    },
    enabled: !!session,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
