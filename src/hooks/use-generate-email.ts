import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface GenerateEmailParams {
  professorName: string;
  professorEmail: string;
  professorUniversity: string;
  professorMajor: string;
  researchInterests: string[];
  userBackground?: string;
  intention?: string;
  topic?: string;
  tone?: string;
  language: "en" | "vi";
}

interface GenerateEmailResponse {
  email: string;
  metadata: {
    professorName: string;
    professorEmail: string;
    language: string;
    generatedAt: string;
  };
}

/**
 * React Query mutation hook for generating emails
 */
export function useGenerateEmail() {
  return useMutation<GenerateEmailResponse, Error, GenerateEmailParams>({
    mutationFn: async (params) => {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate email");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Email generated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate email");
    },
  });
}
