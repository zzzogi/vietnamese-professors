import { PricingComparison } from "@/components/landing/pricing-comparison";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaBanner } from "@/components/landing/cta-banner";

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600">
          Start free, upgrade when you need more power
        </p>
      </div>
      <PricingComparison />
      <FaqSection />
      <CtaBanner />
    </div>
  );
}
