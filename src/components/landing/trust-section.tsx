"use client";

import { Users, Mail, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  {
    icon: Users,
    value: 500,
    label: "Verified Professors",
    suffix: "+",
  },
  {
    icon: Star,
    value: 1000,
    label: "Ratings & Reviews",
    suffix: "+",
  },
  {
    icon: Mail,
    value: 2500,
    label: "Emails Generated",
    suffix: "+",
  },
  {
    icon: TrendingUp,
    value: 85,
    label: "Higher Response Rate",
    suffix: "%",
  },
];

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
}

export function TrustSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Students Across Vietnam
          </h2>
          <p className="text-lg text-purple-100">
            Join thousands of researchers making meaningful connections
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-2">
                <Counter end={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-purple-100">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="text-lg text-purple-100 mb-4">
            💡 <strong>Did you know?</strong> 90% of cold outreach emails are
            ignored.
          </p>
          <p className="text-xl font-semibold">
            Our AI-powered templates increase response rates by up to 85%
          </p>
        </div>
      </div>
    </section>
  );
}
