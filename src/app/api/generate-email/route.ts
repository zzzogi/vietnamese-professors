import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
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

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(prompt);
    const generatedEmail = result.response.text();

    return NextResponse.json({
      email: generatedEmail,
      metadata: {
        professorName,
        professorEmail,
        language,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Email generation error:", error);

    if (error.message?.includes("API key")) {
      return NextResponse.json(
        { error: "API key not configured. Please add GEMINI_API_KEY to .env" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate email. Please try again." },
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
