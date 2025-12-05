"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Check } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Upgrade to PRO
          </DialogTitle>
          <DialogDescription className="text-center">
            {feature
              ? `${feature} is available for PRO members only`
              : "This feature is available for PRO members only"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {[
            "Unlimited professor profiles",
            "Unlimited AI emails",
            "Export CSV/PDF",
            "Advanced analytics",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            PRO access coming soon! Join the waitlist:
          </p>
          <Link href="/pricing">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Learn More About PRO
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
