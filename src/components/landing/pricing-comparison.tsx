import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      { text: "5 professor profiles", included: true },
      { text: "Basic search filters", included: true },
      { text: "Limited AI email preview", included: true },
      { text: "View top 5 leaderboard", included: true },
      { text: "PRO-only professors", included: false },
      { text: "Unlimited AI emails", included: false },
      { text: "Export CSV/PDF", included: false },
      { text: "Advanced analytics", included: false },
    ],
    cta: "Start Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "PRO",
    price: "$9.99",
    period: "/month",
    description: "For serious researchers",
    features: [
      { text: "Unlimited professor profiles", included: true },
      { text: "Advanced search & filters", included: true },
      { text: "Unlimited AI email generation", included: true },
      { text: "Full leaderboard access", included: true },
      { text: "Exclusive PRO-only professors", included: true },
      { text: "Email templates & personalization", included: true },
      { text: "Export CSV/PDF reports", included: true },
      { text: "Response tracking & analytics", included: true },
    ],
    cta: "Coming Soon",
    href: "#",
    highlighted: true,
  },
];

export function PricingComparison() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 relative ${
                plan.highlighted
                  ? "border-2 border-purple-600 shadow-lg"
                  : "border border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
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
                      className={`text-sm ${
                        feature.included ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  disabled={plan.href === "#"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
