import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logUsage } from "@/lib/access-control";

export async function POST(request: Request) {
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

    const body = await request.json();
    const { professorId, subject, content, language } = body;

    const savedEmail = await prisma.savedEmail.create({
      data: {
        userId: user.id,
        professorId,
        subject,
        content,
        language,
      },
    });

    await logUsage(user.id, "email_saved", { professorId });

    return NextResponse.json(savedEmail);
  } catch (error) {
    console.error("Save email error:", error);
    return NextResponse.json(
      { error: "Failed to save email" },
      { status: 500 }
    );
  }
}
