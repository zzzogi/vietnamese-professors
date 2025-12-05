import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserRole } from "@/lib/access-control";
import { UserRole } from "@/lib/constants/roles";
import { FEATURE_LIMITS } from "@/lib/constants/limits";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userRole = getUserRole(session?.user as any);

    const searchParams = request.nextUrl.searchParams;
    const sortBy = searchParams.get("sortBy") || "rating";
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get leaderboard limit for user role
    const viewLimit = FEATURE_LIMITS[userRole].leaderboardView;
    const actualLimit =
      viewLimit === Infinity ? limit : Math.min(limit, viewLimit);

    // Fetch professors with ratings
    const professors = await prisma.professor.findMany({
      include: {
        ratings: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      take: actualLimit,
    });

    // Calculate average ratings
    const leaderboard = professors.map((professor) => {
      const totalRatings = professor.ratings.length;
      const avgRating =
        totalRatings > 0
          ? professor.ratings.reduce((sum, r) => sum + r.rating, 0) /
            totalRatings
          : 0;

      return {
        id: professor.id,
        name: professor.name,
        university: professor.university,
        major: professor.major,
        imageUrl: professor.imageUrl,
        avgRating: Math.round(avgRating * 10) / 10,
        totalRatings,
        isPro: professor.isPro,
      };
    });

    // Sort by rating
    leaderboard.sort((a, b) => b.avgRating - a.avgRating);

    return NextResponse.json({
      leaderboard,
      userRole,
      viewLimit,
      total: professors.length,
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
