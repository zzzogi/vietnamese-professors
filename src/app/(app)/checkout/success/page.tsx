"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  CheckCircle,
  Crown,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccessPage() {
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#9333EA", "#3B82F6"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#9333EA", "#3B82F6"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Verify payment and refresh session
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/stripe/verify-session?session_id=${sessionId}`
        );

        if (response.ok) {
          // Refresh session to get updated user data
          await update();
        }
      } catch (error) {
        console.error("Verification error:", error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, update]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Welcome to PRO! 🎉
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8">
          Your payment was successful. You now have unlimited access to all PRO
          features!
        </p>

        {/* Features Unlocked */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">
              What&apos;s unlocked for you:
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Unlimited AI emails</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>PRO-only professors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Advanced filters</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Export to PDF/CSV</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Priority support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Early access</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3 mb-6">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700 h-12"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/professors">
            <Button size="lg" variant="outline" className="w-full h-12">
              Browse PRO Professors
            </Button>
          </Link>
        </div>

        {/* Receipt Info */}
        <p className="text-sm text-gray-600">
          A receipt has been sent to{" "}
          <span className="font-medium">{session?.user?.email}</span>
        </p>
      </Card>
    </div>
  );
}
