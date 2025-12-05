"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Sparkles, Star, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const { data: session } = useSession();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const isPro = session?.user?.isPro || false;

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for getting started",
      features: [
        { text: "Search all professors", included: true },
        { text: "Basic profile information", included: true },
        { text: "10 AI emails per month", included: true },
        { text: "Bookmark professors", included: true },
        { text: "Rate and review", included: true },
        { text: "Email reminders", included: false },
        { text: "PRO-only professors", included: false },
        { text: "Unlimited AI emails", included: false },
        { text: "Export to PDF/CSV", included: false },
        { text: "Priority support", included: false },
      ],
      cta: session ? "Current Plan" : "Get Started",
      href: session ? null : "/register",
      popular: false,
      disabled: !!session,
    },
    {
      name: "PRO",
      price: { monthly: 9.99, yearly: 99.99 },
      description: "For serious researchers",
      features: [
        { text: "Everything in Free", included: true },
        { text: "Unlimited AI email generation", included: true },
        { text: "Access PRO-only professors", included: true },
        { text: "Advanced search filters", included: true },
        { text: "Export data (PDF/CSV)", included: true },
        { text: "Email reminders & tracking", included: true },
        { text: "Priority email support", included: true },
        { text: "Early access to new features", included: true },
        { text: "Remove watermarks", included: true },
        { text: "Custom email templates", included: true },
      ],
      cta: isPro ? "Current Plan" : "Upgrade to PRO",
      href: isPro ? null : "/checkout",
      popular: true,
      disabled: isPro,
    },
  ];

  const monthlyPrice = plans[1].price.monthly;
  const yearlyPrice = plans[1].price.yearly;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
  const savings = ((1 - yearlyPrice / (monthlyPrice * 12)) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade anytime. No hidden fees, cancel whenever you
            want.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-6 py-2 rounded-full font-medium transition-all",
              billingCycle === "monthly"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-6 py-2 rounded-full font-medium transition-all relative",
              billingCycle === "yearly"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save {savings}%
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                plan.popular
                  ? "border-2 border-purple-600 shadow-2xl scale-105"
                  : "border-gray-200 hover:shadow-lg"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 text-sm font-semibold">
                  <Star className="w-3 h-3 inline mr-1" />
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-gray-900">
                      $
                      {billingCycle === "monthly"
                        ? plan.price.monthly
                        : yearlyMonthly}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  {billingCycle === "yearly" && plan.price.yearly > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      ${plan.price.yearly} billed annually (save ${savings}%)
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                {plan.href ? (
                  <Link href={plan.href}>
                    <Button
                      className={cn(
                        "w-full mb-8 h-12 text-base font-semibold",
                        plan.popular
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-gray-900 hover:bg-gray-800"
                      )}
                    >
                      {plan.cta}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full mb-8 h-12 text-base font-semibold"
                  >
                    {plan.cta}
                  </Button>
                )}

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          feature.included
                            ? "text-gray-900"
                            : "text-gray-500 line-through"
                        )}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You&apos;ll
                keep access to PRO features until the end of your billing
                period.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American
                Express) through our secure payment processor Stripe.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Our Free plan lets you try core features with 10 AI emails per
                month. Upgrade anytime to unlock unlimited access.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if I downgrade?
              </h3>
              <p className="text-gray-600">
                If you downgrade from PRO to Free, you&apos;ll keep PRO features
                until the end of your billing period, then revert to Free plan
                limits.
              </p>
            </Card>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-600 mb-4">Trusted by 500+ students</p>
          <div className="flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm">Money-back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
