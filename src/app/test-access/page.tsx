"use client";

import { AccessGate } from "@/components/access/access-gate";
import { ProfessorCardLocked } from "@/components/professors/professor-card-locked";
import { GuestBanner } from "@/components/layout/guest-banner";
import { Button } from "@/components/ui/button";
import { useEmailQuota } from "@/hooks/use-email-quota";

export default function TestAccessPage() {
  const { data: quota } = useEmailQuota();

  return (
    <div className="min-h-screen bg-gray-50">
      <GuestBanner />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold">Access Control Test</h1>

        {/* Test PRO gate */}
        <div>
          <h2 className="text-xl font-semibold mb-4">PRO Feature Test</h2>
          <AccessGate
            required="PRO"
            showUpgradeModal
            featureName="Premium Analytics"
            fallback={
              <Button variant="outline">🔒 Unlock Premium Analytics</Button>
            }
          >
            <div className="p-6 bg-green-100 rounded-lg">
              ✅ You have PRO access!
            </div>
          </AccessGate>
        </div>

        {/* Test locked card */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Locked Card Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfessorCardLocked
              professor={{ name: "Dr. John Doe" }}
              reason="guest"
            />
            <ProfessorCardLocked
              professor={{ name: "Dr. Jane Smith" }}
              reason="pro"
            />
          </div>
        </div>

        {/* Test quota display */}
        {quota && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Email Quota</h2>
            <div className="p-6 bg-blue-50 rounded-lg">
              <p>Remaining: {quota.remaining}</p>
              <p>
                Used: {quota.used} / {quota.total}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
