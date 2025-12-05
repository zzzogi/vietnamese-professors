"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Crown } from "lucide-react";
import Link from "next/link";

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
  total: number;
}

export function QuotaExceededModal({
  isOpen,
  onClose,
  remaining,
  total,
}: QuotaExceededModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Email Quota Reached
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;ve used {total - remaining} of {total} free emails this
            month
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 my-4">
          <p className="text-sm text-gray-700 text-center">
            Your quota will reset on the 1st of next month, or upgrade to PRO
            for unlimited email generation.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/pricing">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to PRO
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
