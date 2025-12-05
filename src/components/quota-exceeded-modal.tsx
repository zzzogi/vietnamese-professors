"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Crown, Mail } from "lucide-react";
import Link from "next/link";

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotaInfo: {
    used: number;
    total: number;
    remaining: number;
    resetAt: Date | null;
  };
}

export function QuotaExceededModal({
  isOpen,
  onClose,
  quotaInfo,
}: QuotaExceededModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">
            Email Quota Exceeded
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;ve reached your monthly limit of {quotaInfo.total}{" "}
            AI-generated emails.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Usage */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {quotaInfo.used} / {quotaInfo.total}
            </div>
            <p className="text-sm text-gray-600">Emails used this month</p>
            {quotaInfo.resetAt && (
              <p className="text-xs text-gray-500 mt-2">
                Quota resets on{" "}
                {new Date(quotaInfo.resetAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Upgrade CTA */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Upgrade to PRO</h3>
            </div>
            <ul className="space-y-1 mb-4 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                <span>Unlimited AI email generation</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-600" />
                <span>Access to PRO-only professors</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                <span>Export to PDF/CSV</span>
              </li>
            </ul>
            <Link href="/pricing">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now - $9.99/month
              </Button>
            </Link>
          </div>

          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
