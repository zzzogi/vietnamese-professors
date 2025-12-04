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
import { Mail } from "lucide-react";

interface GenerateEmailModalProps {
  professorName: string;
  professorEmail: string;
}

export function GenerateEmailModal({
  professorName,
  professorEmail,
}: GenerateEmailModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Mail className="mr-2 h-4 w-4" />
          Generate Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Email to {professorName}</DialogTitle>
          <DialogDescription>
            AI-powered email generator (Coming soon)
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>To:</strong> {professorEmail}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Subject:</strong> [AI will generate this]
            </p>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600 italic">
              This feature will use AI to generate a personalized email based
              on:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mt-2">
              <li>Professor's research interests</li>
              <li>Your profile and background</li>
              <li>Your research goals</li>
              <li>Appropriate academic tone</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
