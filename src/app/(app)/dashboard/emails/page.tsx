"use client";

import { useSavedEmails } from "@/hooks/use-save-email";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SavedEmailsPage() {
  const { data, isLoading } = useSavedEmails();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const emails = data?.emails || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Saved Email Drafts
          </h1>
          <p className="text-gray-600">
            {emails.length} saved {emails.length === 1 ? "draft" : "drafts"}
          </p>
        </div>

        {emails.length === 0 ? (
          <Card className="p-12 text-center">
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved drafts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Generate and save email drafts to access them later
            </p>
            <Link href="/professors">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Browse Professors
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => (
              <Card
                key={email.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Professor Avatar */}
                  <Link href={`/professors/${email.professorId}`}>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 cursor-pointer">
                      {email.professor.imageUrl ? (
                        <Image
                          src={email.professor.imageUrl}
                          alt={email.professor.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                          {email.professor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Email Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link
                          href={`/professors/${email.professorId}`}
                          className="text-lg font-semibold text-gray-900 hover:text-purple-600"
                        >
                          {email.professor.name}
                        </Link>
                        <p className="text-sm text-gray-600">
                          {email.professor.university}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(email.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Subject: {email.subject}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {email.content}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const mailtoLink = `mailto:${
                            email.professor.email
                          }?subject=${encodeURIComponent(
                            email.subject
                          )}&body=${encodeURIComponent(email.content)}`;
                          window.location.href = mailtoLink;
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            `Subject: ${email.subject}\n\n${email.content}`
                          );
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
