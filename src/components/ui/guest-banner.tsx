import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

export function GuestBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5" />
          <span className="text-sm">
            <strong>Guest Mode:</strong> You're viewing limited content. Sign up
            to unlock all features!
          </span>
        </div>
        <Link href="/signup">
          <Button
            size="sm"
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Start Free
          </Button>
        </Link>
      </div>
    </div>
  );
}
