import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRemainingEmailQuota } from "@/lib/access-control";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        isPro: true,
        emailQuota: true,
        emailsUsed: true,
        quotaResetAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const remaining = await getRemainingEmailQuota(user.id);

    return NextResponse.json({
      remaining,
      total: user.emailQuota,
      used: user.emailsUsed,
      resetDate: user.quotaResetAt.toISOString(),
    });
  } catch (error) {
    console.error("Quota API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quota" },
      { status: 500 }
    );
  }
}
