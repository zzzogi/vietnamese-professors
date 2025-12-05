"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, AlertCircle, Crown } from "lucide-react";
import { EmailForm } from "./email-form";
import { GeneratedEmailDisplay } from "./generated-email-display";
import { useGenerateEmail } from "@/hooks/use-generate-email";
import { QuotaExceededModal } from "@/components/quota-exceeded-modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface GenerateEmailModalProps {
  professorId: string;
  professorName: string;
  professorEmail: string;
  professorUniversity: string;
  professorMajor: string;
  researchInterests: string[];
}

export function GenerateEmailModal({
  professorId,
  professorName,
  professorEmail,
  professorUniversity,
  professorMajor,
  researchInterests,
}: GenerateEmailModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [userBackground, setUserBackground] = useState("");
  const [intention, setIntention] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("semiformal");
  const [language, setLanguage] = useState<"en" | "vi">("en");
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  const { mutate, data, isPending, isSuccess, reset } = useGenerateEmail();

  // ✅ Fetch current quota
  const { data: quota, isLoading: quotaLoading } = useQuery({
    queryKey: ["quota", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/user/quota");
      if (!response.ok) throw new Error("Failed to fetch quota");
      return response.json();
    },
    enabled: !!session?.user?.id && isOpen,
    refetchInterval: 30000, // Refresh every 30s
  });

  const isUnlimited = quota?.total === -1;
  const isLowQuota = !isUnlimited && quota && quota.remaining <= 2;
  const hasNoQuota = quota && quota.remaining === 0;

  const handleGenerate = () => {
    // ✅ Check authentication
    if (!session) {
      toast.error("Please login to generate emails");
      router.push("/login");
      return;
    }

    // ✅ Check quota before attempting
    if (hasNoQuota) {
      setShowQuotaModal(true);
      return;
    }

    // Generate email
    mutate(
      {
        professorName,
        professorEmail,
        professorUniversity,
        professorMajor,
        researchInterests,
        userBackground,
        intention,
        topic,
        tone,
        language,
      },
      {
        onSuccess: (data) => {
          // ✅ Refresh quota after successful generation
          queryClient.invalidateQueries({ queryKey: ["quota"] });

          // ✅ Show quota notification
          const { quota } = data;
          if (quota.total === -1) {
            toast.success("Email generated successfully!");
          } else if (quota.remaining > 0) {
            toast.success(
              `Email generated! ${quota.remaining} of ${quota.total} emails remaining`
            );
          } else {
            toast.success(
              "Email generated! This was your last free email this month",
              { duration: 5000 }
            );
          }
        },
        onError: (error: any) => {
          // ✅ Handle quota exceeded error
          if (error.response?.status === 403) {
            setShowQuotaModal(true);
          } else if (error.response?.status === 429) {
            toast.error(
              "Too many requests. Please wait a moment and try again."
            );
          } else {
            toast.error(error.message || "Failed to generate email");
          }
        },
      }
    );
  };

  const handleRegenerate = () => {
    reset();
    handleGenerate();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (!newOpen) {
      // Reset when closing
      reset();
      setUserBackground("");
      setIntention("");
      setTopic("");
      setTone("semiformal");
      setLanguage("en");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="bg-purple-600 hover:bg-purple-700 w-full">
            <Mail className="mr-2 h-4 w-4" />
            Generate Email
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Email to {professorName}</DialogTitle>
            <DialogDescription>
              Customize your email preferences and let AI generate a
              professional email for you
            </DialogDescription>
          </DialogHeader>

          {/* ✅ Quota Display & Warning */}
          {session && !quotaLoading && quota && (
            <div className="mb-4">
              {isUnlimited ? (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900">
                      PRO Member
                    </p>
                    <p className="text-xs text-purple-700">
                      Unlimited email generation
                    </p>
                  </div>
                </div>
              ) : hasNoQuota ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      Quota exceeded
                    </p>
                    <p className="text-xs text-red-700 mb-2">
                      You&apos;ve used all {quota.total} emails this month
                    </p>
                    <Link href="/pricing">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 h-7 text-xs"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Upgrade to PRO
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : isLowQuota ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">
                      Low quota warning
                    </p>
                    <p className="text-xs text-yellow-700">
                      Only {quota.remaining} of {quota.total} emails remaining
                      this month
                    </p>
                    {quota.resetAt && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Resets on {new Date(quota.resetAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Link href="/pricing">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    >
                      Upgrade
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      {quota.remaining} of {quota.total} emails remaining
                    </p>
                    {quota.resetAt && (
                      <p className="text-xs text-blue-700">
                        Resets on {new Date(quota.resetAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="py-4">
            {!isSuccess ? (
              <>
                <EmailForm
                  userBackground={userBackground}
                  setUserBackground={setUserBackground}
                  intention={intention}
                  setIntention={setIntention}
                  topic={topic}
                  setTopic={setTopic}
                  tone={tone}
                  setTone={setTone}
                  language={language}
                  setLanguage={setLanguage}
                />

                <Button
                  onClick={handleGenerate}
                  disabled={isPending || hasNoQuota || quotaLoading}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : hasNoQuota ? (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Generate
                    </>
                  ) : (
                    <>
                      Generate Email
                      {!isUnlimited && quota && (
                        <span className="ml-2 text-xs opacity-75">
                          ({quota.remaining} left)
                        </span>
                      )}
                    </>
                  )}
                </Button>

                {/* ✅ Upgrade CTA for users near limit */}
                {!isUnlimited && !hasNoQuota && isLowQuota && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600 mb-2">
                      Running low on emails?
                    </p>
                    <Link href="/pricing">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-purple-600 border-purple-300 hover:bg-purple-50"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Get Unlimited with PRO
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <GeneratedEmailDisplay
                email={data?.email || ""}
                professorId={professorId}
                professorEmail={professorEmail}
                language={language}
                onRegenerate={handleRegenerate}
                isRegenerating={isPending}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Quota Exceeded Modal */}
      {quota && (
        <QuotaExceededModal
          isOpen={showQuotaModal}
          onClose={() => setShowQuotaModal(false)}
          quotaInfo={quota}
        />
      )}
    </>
  );
}
