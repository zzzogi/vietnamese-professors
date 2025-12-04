import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/emails/save - Save email draft
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { professorId, subject, content, language } = await request.json();

    if (!professorId || !subject || !content) {
      return NextResponse.json(
        { error: "professorId, subject, and content are required" },
        { status: 400 }
      );
    }

    const savedEmail = await prisma.savedEmail.create({
      data: {
        userId: user.id,
        professorId,
        subject,
        content,
        language: language || "en",
      },
    });

    return NextResponse.json({ savedEmail });
  } catch (error) {
    console.error("Save email error:", error);
    return NextResponse.json(
      { error: "Failed to save email" },
      { status: 500 }
    );
  }
}
