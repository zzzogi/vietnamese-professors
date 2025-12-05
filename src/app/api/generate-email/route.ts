import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  hasEmailQuota,
  incrementEmailUsage,
  logUsage,
  getRemainingQuota,
} from "@/lib/access-control";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    // ✅ 1. Check Authentication
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Please login to generate emails" },
        { status: 401 }
      );
    }

    // ✅ 2. Get User from Database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,
        emailQuota: true,
        emailsUsed: true,
        quotaResetAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // After user fetch
    const rateLimit = checkRateLimit(user.id, 10, 60000); // 10 requests per minute
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Please wait a moment before generating another email",
        },
        { status: 429 }
      );
    }

    // ✅ 3. Check Quota BEFORE Generating
    const hasQuota = await hasEmailQuota(user.id);
    if (!hasQuota) {
      const quotaInfo = await getRemainingQuota(user.id);
      return NextResponse.json(
        {
          error: "Email quota exceeded",
          message: `You've used all ${quotaInfo.total} emails this month. Upgrade to PRO for unlimited access.`,
          quotaInfo,
        },
        { status: 403 }
      );
    }

    // ✅ 4. Parse Request Body
    const body = await request.json();
    const {
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
    } = body;

    if (!professorName || !professorEmail) {
      return NextResponse.json(
        { error: "Professor information is required" },
        { status: 400 }
      );
    }

    // ✅ 5. Build Prompt
    const prompt = buildPrompt({
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

    // ✅ 6. Generate Email with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const generatedEmail = result.response.text();

    // ✅ 7. Increment Usage Count (AFTER successful generation)
    await incrementEmailUsage(user.id);

    // ✅ 8. Log Usage for Analytics
    await logUsage(user.id, "email_generated", {
      professorName,
      professorEmail,
      language,
      tone,
      intention: intention || "general",
    });

    // ✅ 9. Get Updated Quota
    const updatedQuota = await getRemainingQuota(user.id);

    // ✅ 10. Return Success Response with Quota Info
    return NextResponse.json({
      email: generatedEmail,
      metadata: {
        professorName,
        professorEmail,
        language,
        generatedAt: new Date().toISOString(),
      },
      quota: {
        remaining: updatedQuota.remaining,
        total: updatedQuota.total,
        used: updatedQuota.used,
        resetAt: updatedQuota.resetAt,
      },
    });
  } catch (error: any) {
    console.error("Email generation error:", error);

    // Handle specific errors
    if (error.message?.includes("API key")) {
      return NextResponse.json(
        {
          error: "API configuration error",
          message:
            "AI service is temporarily unavailable. Please try again later.",
        },
        { status: 500 }
      );
    }

    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate email",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

function buildPrompt(params: {
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
}) {
  const {
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
  } = params;

  const toneMapping = {
    formal:
      language === "en"
        ? "very formal and professional"
        : "trang trọng và chuyên nghiệp",
    semiformal:
      language === "en"
        ? "semi-formal and respectful"
        : "trang trọng vừa phải và lịch sự",
    friendly:
      language === "en"
        ? "friendly but still professional"
        : "thân thiện nhưng vẫn chuyên nghiệp",
  };

  const selectedTone =
    toneMapping[tone as keyof typeof toneMapping] || toneMapping.semiformal;

  if (language === "vi") {
    return `
Bạn là một chuyên gia viết email học thuật. Hãy viết một email ngắn gọn (tối đa 500 ký tự) bằng tiếng Việt để liên hệ với giáo sư.

Thông tin giáo sư:
- Tên: ${professorName}
- Email: ${professorEmail}
- Trường: ${professorUniversity}
- Chuyên ngành: ${professorMajor}
- Lĩnh vực nghiên cứu: ${researchInterests.join(", ")}

Thông tin người gửi:
${userBackground ? `- Bối cảnh: ${userBackground}` : ""}
${intention ? `- Mục đích: ${intention}` : ""}
${topic ? `- Chủ đề quan tâm: ${topic}` : ""}

Yêu cầu:
- Giọng điệu: ${selectedTone}
- Độ dài: Tối đa 500 ký tự (bao gồm cả subject)
- Format: 
  Subject: [Tiêu đề ngắn gọn]
  
  [Nội dung email]

- Ngắn gọn, súc tích, đi thẳng vào vấn đề
- Không cần phần giới thiệu dài dòng
- Thể hiện sự tôn trọng và quan tâm đến nghiên cứu của giáo sư

Hãy viết email ngay bây giờ:
`;
  } else {
    return `
You are an expert academic email writer. Write a concise email (maximum 500 characters) to contact a professor.

Professor Information:
- Name: ${professorName}
- Email: ${professorEmail}
- University: ${professorUniversity}
- Major: ${professorMajor}
- Research Interests: ${researchInterests.join(", ")}

Sender Information:
${userBackground ? `- Background: ${userBackground}` : ""}
${intention ? `- Intention: ${intention}` : ""}
${topic ? `- Topic of Interest: ${topic}` : ""}

Requirements:
- Tone: ${selectedTone}
- Length: Maximum 500 characters (including subject line)
- Format:
  Subject: [Brief subject line]
  
  [Email body]

- Be concise and direct
- No lengthy introductions
- Show respect and genuine interest in their research

Write the email now:
`;
  }
}
