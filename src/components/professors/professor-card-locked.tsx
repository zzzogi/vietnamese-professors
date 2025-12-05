import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Professor } from "@prisma/client";
import { Lock } from "lucide-react";
import Link from "next/link";

interface ProfessorCardLockedProps {
  professor: Partial<Professor>;
  reason?: "guest" | "pro";
}

export function ProfessorCardLocked({
  reason = "guest",
}: ProfessorCardLockedProps) {
  const message =
    reason === "guest"
      ? "Sign in to view this profile"
      : "Upgrade to PRO to access this professor";

  const ctaText = reason === "guest" ? "Sign In" : "Upgrade to PRO";
  const ctaLink = reason === "guest" ? "/login" : "/pricing";

  return (
    <Card className="relative overflow-hidden h-full">
      {/* Blurred content */}
      <div className="blur-sm grayscale p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-900 mb-4 text-center">
          {message}
        </p>
        <Link href={ctaLink}>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            {ctaText}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
