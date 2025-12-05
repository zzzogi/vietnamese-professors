import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { emailNotifications, marketingEmails } = body;

    // Store notification preferences
    // You'll need to add these fields to your User schema
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        // emailNotifications,
        // marketingEmails,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
