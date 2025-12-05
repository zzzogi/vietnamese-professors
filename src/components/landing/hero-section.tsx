import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-400 opacity-10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700">
            🎓 For Students & Researchers
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Find the Right Professor in Vietnam{" "}
            <span className="text-purple-600">— Faster</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-gray-600 sm:text-xl">
            Search verified professors, generate professional outreach emails
            with AI, and track your academic connections.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-base px-8 h-12 min-w-[160px]"
              >
                Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/professors">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 min-w-[160px] border-gray-300"
              >
                Browse Professors
              </Button>
            </Link>
          </div>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <span>5 free profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <span>AI-powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
