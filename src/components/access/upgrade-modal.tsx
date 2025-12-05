"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const PRO_FEATURES = [
  "Unlimited professor profiles",
  "Access PRO-only professors",
  "Unlimited AI email generation",
  "Export to CSV/PDF",
  "Advanced analytics",
  "Priority support",
];

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-purple-600" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Upgrade to PRO
          </DialogTitle>
          <DialogDescription className="text-center">
            {feature
              ? `${feature} is available for PRO members only`
              : "Unlock all premium features"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-6">
          {PRO_FEATURES.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link href="/pricing">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              View PRO Plans
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Maybe Later
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          PRO access coming soon! Join the waitlist on our pricing page.
        </p>
      </DialogContent>
    </Dialog>
  );
}
