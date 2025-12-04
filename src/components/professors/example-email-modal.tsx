"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ExampleEmailModalProps {
  professorName: string;
}

export function ExampleEmailModal({ professorName }: ExampleEmailModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Example Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Example Email Template</DialogTitle>
          <DialogDescription>
            Sample email you can customize and send to {professorName}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Subject:
              </p>
              <p className="text-sm text-gray-900">
                Inquiry About Research Opportunities in [Research Area]
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-900 whitespace-pre-line">
                {`Dear Professor ${professorName.split(" ")[0]},

I hope this email finds you well. My name is [Your Name], and I am a [your current position/degree] at [Your Institution]. I am writing to express my strong interest in your research on [specific research topic].

I have been following your recent work on [mention specific paper/project], and I am particularly fascinated by [specific aspect that interests you]. Your approach to [mention methodology or concept] aligns closely with my academic interests and career goals.

Currently, I am working on [brief description of your current work/interests], and I believe that working under your guidance would provide invaluable insights and experience. I am especially interested in [specific research area mentioned in their profile].

I would be grateful for the opportunity to discuss potential research opportunities in your lab, whether as a [visiting researcher/graduate student/research assistant]. I have attached my CV for your review.

Thank you for considering my request. I look forward to hearing from you.

Best regards,
[Your Name]
[Your Email]
[Your Phone Number]`}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
