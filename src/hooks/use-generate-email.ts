import { useMutation } from "@tanstack/react-query";

interface GenerateEmailParams {
  professorName: string;
  professorEmail: string;
  professorUniversity: string;
  professorMajor: string;
  researchInterests: string[];
  userBackground: string;
  intention: string;
  topic: string;
  tone: string;
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
  quota: {
    remaining: number;
    total: number;
    used: number;
    resetAt: Date | null;
  };
}

export function useGenerateEmail() {
  return useMutation<GenerateEmailResponse, Error, GenerateEmailParams>({
    mutationFn: async (params: GenerateEmailParams) => {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        // ✅ Create error with response data
        const error: any = new Error(
          data.message || data.error || "Failed to generate email"
        );
        error.response = { status: response.status, data };
        throw error;
      }

      return data;
    },
    onError: (error: any) => {
      // Don't show toast here - let the component handle it
      console.error("Email generation error:", error);
    },
  });
}
