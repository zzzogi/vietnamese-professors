"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { Button } from "@/components/ui/button";
import { Lock, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function GuestBanner() {
  const { isGuest, isLoading } = useUserRole();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || !isGuest || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Lock className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium truncate">
              <span className="font-bold">Guest Mode:</span> Sign up to unlock
              all features!
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Start Free
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
              onClick={() => setDismissed(true)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
