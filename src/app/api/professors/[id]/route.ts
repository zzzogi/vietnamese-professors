import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/access-control";
import { UserRole } from "@/lib/constants/roles";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userRole = getUserRole(session?.user as any);

    const professor = await prisma.professor.findUnique({
      where: { id: params.id },
    });

    if (!professor) {
      return NextResponse.json(
        { error: "Professor not found" },
        { status: 404 }
      );
    }

    // Check if user can access PRO professor
    if (professor.isPro && userRole !== UserRole.PRO) {
      return NextResponse.json(
        { error: "This professor is available for PRO members only" },
        { status: 403 }
      );
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error("Professor detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch professor" },
      { status: 500 }
    );
  }
}
