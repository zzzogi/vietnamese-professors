"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { EmailForm } from "./email-form";
import { GeneratedEmailDisplay } from "./generated-email-display";
import { useGenerateEmail } from "@/hooks/use-generate-email";

interface GenerateEmailModalProps {
  professorName: string;
  professorEmail: string;
  professorUniversity: string;
  professorMajor: string;
  researchInterests: string[];
}

export function GenerateEmailModal({
  professorName,
  professorEmail,
  professorUniversity,
  professorMajor,
  researchInterests,
}: GenerateEmailModalProps) {
  const [open, setOpen] = useState(false);
  const [userBackground, setUserBackground] = useState("");
  const [intention, setIntention] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("semiformal");
  const [language, setLanguage] = useState<"en" | "vi">("en");

  const { mutate, data, isPending, isSuccess, reset } = useGenerateEmail();

  const handleGenerate = () => {
    mutate({
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
    });
  };

  const handleRegenerate = () => {
    reset();
    handleGenerate();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset when closing
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            Customize your email preferences and let AI generate a professional
            email for you
          </DialogDescription>
        </DialogHeader>

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
                disabled={isPending}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Email"
                )}
              </Button>
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
  );
}
