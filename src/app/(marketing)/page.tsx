import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { DemoPreview } from "@/components/landing/demo-preview";
import { PricingComparison } from "@/components/landing/pricing-comparison";
import { TrustSection } from "@/components/landing/trust-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaBanner } from "@/components/landing/cta-banner";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <DemoPreview />
      <TrustSection />
      <PricingComparison />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
