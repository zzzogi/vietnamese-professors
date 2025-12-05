import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-white py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            🎓 For Students & Researchers
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find the Right Professor in Vietnam —{" "}
            <span className="text-purple-600">Faster</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-gray-600 sm:text-xl">
            Search verified professors, generate professional outreach emails
            with AI, and track your academic connections — all in one platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8"
              >
                Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/professors">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Professors (Preview)
              </Button>
            </Link>
          </div>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>5 free professor profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>AI-powered emails</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
