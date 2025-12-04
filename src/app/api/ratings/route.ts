import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/ratings?professorId=xxx - Get professor's ratings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const professorId = searchParams.get("professorId");

    if (!professorId) {
      return NextResponse.json(
        { error: "professorId is required" },
        { status: 400 }
      );
    }

    // Get average rating
    const avgRating = await prisma.professorRating.aggregate({
      where: { professorId },
      _avg: { rating: true },
      _count: true,
    });

    // Get user's rating if authenticated
    const session = await auth();
    let userRating = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        const rating = await prisma.professorRating.findUnique({
          where: {
            userId_professorId: {
              userId: user.id,
              professorId,
            },
          },
        });
        userRating = rating?.rating || null;
      }
    }

    return NextResponse.json({
      averageRating: avgRating._avg.rating || 0,
      totalRatings: avgRating._count,
      userRating,
    });
  } catch (error) {
    console.error("GET ratings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ratings - Rate professor
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

    const { professorId, rating } = await request.json();

    if (!professorId || rating === undefined) {
      return NextResponse.json(
        { error: "professorId and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Upsert (update if exists, create if not)
    const professorRating = await prisma.professorRating.upsert({
      where: {
        userId_professorId: {
          userId: user.id,
          professorId,
        },
      },
      update: {
        rating,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        professorId,
        rating,
      },
    });

    return NextResponse.json({ rating: professorRating });
  } catch (error) {
    console.error("POST rating error:", error);
    return NextResponse.json(
      { error: "Failed to save rating" },
      { status: 500 }
    );
  }
}
