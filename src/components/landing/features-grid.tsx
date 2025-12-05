import { Search, Mail, Trophy, Lock, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Smart Professor Search",
    description:
      "Filter by university, major, location, and research interests. Find the perfect supervisor in seconds.",
  },
  {
    icon: Mail,
    title: "AI Email Generator",
    description:
      "Generate professional, personalized outreach emails instantly. Save time and increase response rates.",
  },
  {
    icon: Trophy,
    title: "Leaderboard & Rankings",
    description:
      "Discover top-rated professors based on student reviews, publications, and research impact.",
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
      "Track your outreach efforts, save email templates, and monitor response patterns.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Connect with Professors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed specifically for Vietnamese students and
            researchers seeking academic opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
