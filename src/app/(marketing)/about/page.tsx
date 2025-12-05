import { Building2, Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Vietnamese Professors
          </h1>
          <p className="text-xl text-gray-600">
            Connecting students with verified professors across Vietnam
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            We believe that finding the right academic mentor shouldn&apos;t be
            difficult. Vietnamese Professors was created to bridge the gap
            between students and professors, making academic connections easier
            and more accessible for everyone.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our platform helps students discover professors based on research
            interests, generate professional outreach emails with AI, and track
            their academic networking efforts—all in one place.
          </p>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">✓</span>
              </div>
              <span>
                Curate and verify professor profiles from universities across
                Vietnam
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">✓</span>
              </div>
              <span>
                Provide AI-powered email generation to help students craft
                professional outreach messages
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">✓</span>
              </div>
              <span>
                Offer advanced search and filtering to match students with
                professors based on research interests
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">✓</span>
              </div>
              <span>
                Enable ratings and reviews to help students make informed
                decisions
              </span>
            </li>
          </ul>
        </div>

        {/* Who We Serve */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Who We Serve</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Students</h3>
              <p className="text-gray-600 text-sm">
                Undergraduate and graduate students seeking research
                opportunities, thesis supervisors, or academic mentorship.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Researchers</h3>
              <p className="text-gray-600 text-sm">
                Early-career researchers looking for collaboration opportunities
                or PhD supervisors in Vietnam.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Accessibility
              </h3>
              <p className="text-gray-600 text-sm">
                Making academic connections accessible to all students,
                regardless of background or resources.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                Maintaining verified, up-to-date information about professors
                and their research.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Using AI and modern technology to streamline the academic
                networking process.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Have questions or feedback?</p>
          <a
            href="mailto:support@vietnameseprofessors.com"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  );
}
