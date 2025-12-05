import { Search, Mail, Trophy, Lock, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Smart Professor Search",
    description:
      "Filter by university, major, location, and research topics. Find your ideal supervisor in seconds.",
  },
  {
    icon: Mail,
    title: "AI Email Generator",
    description:
      "Generate professional, personalized outreach emails instantly. Increase your response rates.",
  },
  {
    icon: Trophy,
    title: "Leaderboard & Rankings",
    description:
      "Discover top-rated professors based on reviews, publications, and research impact.",
  },
  {
    icon: Lock,
    title: "Exclusive PRO Profiles",
    description:
      "Access private professor profiles and detailed research history available only to PRO members.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Tracking",
    description:
      "Track outreach efforts, save templates, and monitor response patterns.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Connect
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed for Vietnamese students and researchers
            seeking academic opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-md transition-all bg-white border-gray-200"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
