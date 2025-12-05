"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, Infinity as InfinityIcon, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function QuotaBadge() {
  const { data: session } = useSession();

  const { data: quota, isLoading } = useQuery({
    queryKey: ["quota", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/user/quota");
      if (!response.ok) throw new Error("Failed to fetch quota");
      return response.json();
    },
    enabled: !!session?.user?.id,
    refetchInterval: 30000, // Refresh every 30s
  });

  if (!session) return null;
  if (isLoading) return <Skeleton className="h-6 w-20" />;
  if (!quota) return null;

  const isUnlimited = quota.total === -1;
  const isLow = !isUnlimited && quota.remaining <= 2;
  const isEmpty = !isUnlimited && quota.remaining === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={isEmpty ? "destructive" : isLow ? "secondary" : "outline"}
            className="gap-1.5 cursor-help"
          >
            <Mail className="w-3 h-3" />
            {isUnlimited ? (
              <>
                <InfinityIcon className="w-3 h-3" />
                <span className="text-xs">Unlimited</span>
              </>
            ) : (
              <>
                <span className="font-semibold">{quota.remaining}</span>
                <span className="text-xs">/ {quota.total}</span>
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm space-y-1">
            {isUnlimited ? (
              <p className="font-medium">Unlimited email generation</p>
            ) : (
              <>
                <p className="font-medium">
                  Email Quota: {quota.remaining} remaining
                </p>
                <p className="text-gray-400">
                  Used {quota.used} of {quota.total}
                </p>
                {quota.resetAt && (
                  <p className="text-gray-400 text-xs">
                    Resets: {new Date(quota.resetAt).toLocaleDateString()}
                  </p>
                )}
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
