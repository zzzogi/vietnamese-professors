"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Crown,
  CreditCard,
  Lock,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(session?.user?.email || "");

  // Redirect if already PRO
  useEffect(() => {
    if (session?.user?.isPro) {
      toast.success("You're already a PRO member!");
      router.push("/dashboard");
    }
  }, [session, router]);

  // Get plan from URL params
  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan === "yearly") {
      setBillingCycle("yearly");
    }
  }, [searchParams]);

  const prices = {
    monthly: 9.99,
    yearly: 99.99,
  };

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please login to continue");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    setIsLoading(true);

    try {
      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billingCycle,
          email: session.user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // ✅ Use window.location instead of redirectToCheckout
      window.location.href = data.checkoutUrl;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to start checkout");
      setIsLoading(false);
    }
  };

  const selectedPrice = prices[billingCycle];

  // ✅ Fix savings calculation type
  const savings: number =
    billingCycle === "yearly"
      ? Math.round((1 - prices.yearly / (prices.monthly * 12)) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upgrade to PRO
          </h1>
          <p className="text-gray-600">
            Unlock unlimited features and take your research to the next level
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-3">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Select Plan
              </h2>

              {/* Billing Cycle Selection */}
              <div className="space-y-3 mb-6">
                {/* Monthly */}
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    billingCycle === "monthly"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        Monthly Plan
                      </div>
                      <div className="text-sm text-gray-600">
                        Billed monthly, cancel anytime
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${prices.monthly}
                      </div>
                      <div className="text-sm text-gray-600">/month</div>
                    </div>
                  </div>
                </button>

                {/* Yearly */}
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left relative ${
                    billingCycle === "yearly"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {savings > 0 && (
                    <span className="absolute -top-2 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Save {savings}%
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        Yearly Plan
                      </div>
                      <div className="text-sm text-gray-600">
                        Billed annually, best value
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${(prices.yearly / 12).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">/month</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={!!session}
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Receipt will be sent to this email
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Lock className="w-4 h-4 text-green-600" />
                <span>Secure payment processed by Stripe</span>
              </div>
            </Card>

            {/* Payment Button */}
            <Button
              onClick={handleCheckout}
              disabled={isLoading || !email}
              className="w-full h-14 text-lg font-semibold bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Continue to Payment
                </>
              )}
            </Button>

            <p className="text-center text-xs text-gray-500 mt-4">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* PRO Features Sidebar */}
          <div className="md:col-span-2">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  PRO Features
                </h3>
              </div>

              <ul className="space-y-3">
                {[
                  "Unlimited AI email generation",
                  "Access PRO-only professors",
                  "Advanced search filters",
                  "Export data (PDF/CSV)",
                  "Email reminders & tracking",
                  "Priority support",
                  "Early access to features",
                  "Remove watermarks",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Total */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">
                    {billingCycle === "monthly" ? "Monthly" : "Annual"} Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${selectedPrice}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <p className="text-sm text-green-600 font-medium">
                    You save ${(prices.monthly * 12 - prices.yearly).toFixed(2)}{" "}
                    per year!
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
