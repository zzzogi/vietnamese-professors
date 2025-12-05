"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { SaveEmailButton } from "./save-email-button";

interface GeneratedEmailDisplayProps {
  email: string;
  professorId: string;
  professorEmail: string;
  language: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function GeneratedEmailDisplay({
  email,
  professorId,
  professorEmail,
  language,
  onRegenerate,
  isRegenerating,
}: GeneratedEmailDisplayProps) {
  const [copied, setCopied] = useState(false);

  const parseEmail = (emailText: string) => {
    const lines = emailText.trim().split("\n");
    let subject = "";
    let body = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.toLowerCase().startsWith("subject:")) {
        subject = line.replace(/^subject:\s*/i, "").trim();
      } else if (line && !line.toLowerCase().includes("subject")) {
        body += line + "\n";
      }
    }

    return { subject: subject || "Research Inquiry", body: body.trim() };
  };

  const { subject, body } = parseEmail(email);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to copy to clipboard.");
    }
  };

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${professorEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="mb-4 pb-4 border-b border-gray-300">
          <p className="text-xs text-gray-500 mb-1">Subject:</p>
          <p className="font-semibold text-gray-900">{subject}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">Body:</p>
          <p className="text-gray-900 whitespace-pre-line leading-relaxed">
            {body}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleCopy} variant="outline" size="sm">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </>
          )}
        </Button>

        <SaveEmailButton
          professorId={professorId}
          subject={subject}
          content={body}
          language={language}
        />

        <Button
          onClick={onRegenerate}
          variant="outline"
          size="sm"
          disabled={isRegenerating}
        >
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </Button>

        <Button
          onClick={handleSendEmail}
          className="bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          <Mail className="mr-2 h-4 w-4" />
          Open in Email Client
        </Button>
      </div>
    </div>
  );
}
