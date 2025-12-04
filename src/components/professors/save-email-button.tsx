"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useSaveEmail } from "@/hooks/use-save-email";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SaveEmailButtonProps {
  professorId: string;
  subject: string;
  content: string;
  language: string;
}

export function SaveEmailButton({
  professorId,
  subject,
  content,
  language,
}: SaveEmailButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { mutate, isPending } = useSaveEmail();

  const handleSave = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    mutate({ professorId, subject, content, language });
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isPending}
      variant="outline"
      size="sm"
    >
      <Save className="mr-2 h-4 w-4" />
      {isPending ? "Saving..." : "Save Draft"}
    </Button>
  );
}
