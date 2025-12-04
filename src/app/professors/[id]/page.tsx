import { getProfessorById } from "@/lib/actions/professor.actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Building2,
  GraduationCap,
  ExternalLink,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/professors/bookmark-button";
import { GenerateEmailModal } from "@/components/professors/generate-email-modal";
import { ExampleEmailModal } from "@/components/professors/example-email-modal";

// Cài badge component
// pnpm dlx shadcn@latest add badge

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfessorDetailPage({ params }: PageProps) {
  // Next.js 15: params is now a Promise
  const { id } = await params;

  // Fetch professor data from database
  const professor = await getProfessorById(id);

  // Show 404 if professor not found
  if (!professor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/professors">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Professors
          </Button>
        </Link>

        {/* Main Content Card */}
        <Card className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Avatar & Quick Actions */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                {professor.imageUrl ? (
                  <Image
                    src={professor.imageUrl}
                    alt={professor.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {professor.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Action Buttons - Mobile: Stack, Desktop: Keep as is */}
              <div className="space-y-2">
                <BookmarkButton professorId={professor.id} />
                <GenerateEmailModal
                  professorName={professor.name}
                  professorEmail={professor.email}
                />
                <ExampleEmailModal professorName={professor.name} />
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="flex-1">
              {/* Name & Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {professor.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">{professor.major}</p>

              {/* Basic Info Grid */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">University</p>
                    <p className="text-gray-900">{professor.university}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-900">{professor.department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{professor.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${professor.email}`}
                      className="text-purple-600 hover:underline"
                    >
                      {professor.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {professor.bio && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {professor.bio}
                  </p>
                </div>
              )}

              {/* Research Interests */}
              {professor.researchInterests &&
                professor.researchInterests.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Research Interests
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {professor.researchInterests.map((interest, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* External Links */}
              <div className="space-y-2">
                {professor.googleScholarUrl && (
                  <a
                    href={professor.googleScholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-600 hover:underline"
                  >
                    <BookOpen className="h-4 w-4" />
                    Google Scholar Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                {professor.publicationUrl && (
                  <a
                    href={professor.publicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-600 hover:underline"
                  >
                    <BookOpen className="h-4 w-4" />
                    Publications
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
