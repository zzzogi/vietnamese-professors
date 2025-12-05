import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Connect with Top Professors?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join hundreds of students finding their ideal research supervisors
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 text-base px-8 h-12 min-w-[160px]"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/professors">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-base px-8 h-12 min-w-[160px]"
              >
                Browse Professors
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            No credit card required • 5 free profiles • Start in seconds
          </p>
        </div>
      </div>
    </section>
  );
}
