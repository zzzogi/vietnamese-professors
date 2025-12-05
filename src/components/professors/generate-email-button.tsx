"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { GenerateEmailModal } from "./generate-email-modal";
import { AccessGate } from "@/components/access/access-gate";
import { UserRole } from "@/lib/constants/roles";
import { Professor } from "@prisma/client";

interface GenerateEmailButtonProps {
  professor: Professor;
}

export function GenerateEmailButton({ professor }: GenerateEmailButtonProps) {
  const [, setIsOpen] = useState(false);

  return (
    <AccessGate required={UserRole.USER}>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        <Mail className="w-4 h-4 mr-2" />
        Generate Email
      </Button>
      <GenerateEmailModal
        professorId={professor.id}
        professorName={professor.name}
        professorEmail={professor.email}
        professorUniversity={professor.university}
        professorMajor={professor.major}
        researchInterests={professor.researchInterests || []}
      />
    </AccessGate>
  );
}
