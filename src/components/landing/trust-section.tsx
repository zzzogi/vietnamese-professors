"use client";

import { Users, Mail, Star, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Verified Professors",
  },
  {
    icon: Star,
    value: "1,000+",
    label: "Ratings & Reviews",
  },
  {
    icon: Mail,
    value: "2,500+",
    label: "Emails Generated",
  },
  {
    icon: TrendingUp,
    value: "85%",
    label: "Response Rate",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Students Across Vietnam
          </h2>
          <p className="text-lg text-gray-400">
            Join thousands of researchers making meaningful connections
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-white/10 flex items-center justify-center">
                <stat.icon className="w-7 h-7 text-purple-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 rounded-lg px-6 py-4 border border-white/10">
            <div className="text-2xl">💡</div>
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">Did you know?</span>{" "}
              90% of cold emails are ignored. Our AI templates increase response
              rates by up to 85%.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
