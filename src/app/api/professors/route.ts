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

    // ✅ Build where clause with proper filtering
    const whereConditions: any[] = [];

    // Search across multiple fields
    if (search) {
      whereConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { bio: { contains: search, mode: "insensitive" } },
          { department: { contains: search, mode: "insensitive" } },
          {
            researchInterests: {
              hasSome: [search],
            },
          },
        ],
      });
    }

    // ✅ Exact match for university (not contains)
    if (university) {
      whereConditions.push({
        university: { equals: university, mode: "insensitive" },
      });
    }

    // ✅ Exact match for major (not contains)
    if (major) {
      whereConditions.push({
        major: { equals: major, mode: "insensitive" },
      });
    }

    // ✅ Exact match for location (not contains)
    if (location) {
      whereConditions.push({
        location: { equals: location, mode: "insensitive" },
      });
    }

    // ✅ Filter PRO professors for non-PRO users
    if (userRole !== UserRole.PRO) {
      whereConditions.push({ isPro: false });
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    // Fetch professors with ratings
    const [professors, total] = await Promise.all([
      prisma.professor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              ratings: true,
              bookmarks: true,
            },
          },
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.professor.count({ where }),
    ]);

    // ✅ Calculate average ratings
    const professorsWithRatings = professors.map((prof) => {
      const totalRatings = prof.ratings.length;
      const avgRating =
        totalRatings > 0
          ? prof.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
          : 0;

      return {
        ...prof,
        averageRating: Math.round(avgRating * 10) / 10,
        totalRatings,
        totalBookmarks: prof._count.bookmarks,
        ratings: undefined, // Remove raw ratings from response
        _count: undefined, // Remove _count from response
      };
    });

    return NextResponse.json({
      professors: professorsWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      userRole,
      filters: {
        search,
        university,
        major,
        location,
      },
    });
  } catch (error) {
    console.error("Professors API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch professors" },
      { status: 500 }
    );
  }
}
