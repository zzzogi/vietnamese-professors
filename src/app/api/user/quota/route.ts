import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRemainingQuota } from "@/lib/access-control";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quota = await getRemainingQuota(session.user.id);

    return NextResponse.json(quota);
  } catch (error) {
    console.error("Quota API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quota" },
      { status: 500 }
    );
  }
}
