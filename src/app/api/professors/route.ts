import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserRole } from "@/lib/access-control";
import { UserRole } from "@/lib/constants/roles";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userRole = getUserRole(session?.user as any);

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const university = searchParams.get("university") || "";
    const major = searchParams.get("major") || "";
    const location = searchParams.get("location") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                {
                  researchInterests: {
                    hasSome: [search],
                  },
                },
              ],
            }
          : {},
        university
          ? { university: { contains: university, mode: "insensitive" } }
          : {},
        major ? { major: { contains: major, mode: "insensitive" } } : {},
        location
          ? { location: { contains: location, mode: "insensitive" } }
          : {},
      ],
    };

    // ✅ Filter PRO professors for non-PRO users
    if (userRole !== UserRole.PRO) {
      where.isPro = false;
    }

    // Fetch professors
    const [professors, total] = await Promise.all([
      prisma.professor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.professor.count({ where }),
    ]);

    return NextResponse.json({
      professors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      userRole,
    });
  } catch (error) {
    console.error("Professors API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch professors" },
      { status: 500 }
    );
  }
}
