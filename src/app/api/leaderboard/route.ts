import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters
    const timeRange = searchParams.get("timeRange") || "all"; // all, 30d, 90d, year
    const location = searchParams.get("location") || "";
    const major = searchParams.get("major") || "";
    const minRatings = parseInt(searchParams.get("minRatings") || "3");

    // Calculate date filter
    let dateFilter: Date | undefined;
    const now = new Date();

    switch (timeRange) {
      case "30d":
        dateFilter = new Date(now.setDate(now.getDate() - 30));
        break;
      case "90d":
        dateFilter = new Date(now.setDate(now.getDate() - 90));
        break;
      case "year":
        dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        dateFilter = undefined;
    }

    // Build professor filter
    const professorFilter: any = {};
    if (location) {
      professorFilter.location = location;
    }
    if (major) {
      professorFilter.major = major;
    }

    // Fetch Top Rated Professors
    const ratingAggregates = await prisma.professorRating.groupBy({
      by: ["professorId"],
      _avg: { rating: true },
      _count: { rating: true },
      where: dateFilter ? { createdAt: { gte: dateFilter } } : undefined,
      having: {
        rating: {
          _count: { gte: minRatings },
        },
      },
      orderBy: {
        _avg: {
          rating: "desc",
        },
      },
      take: 10,
    });

    const topRatedIds = ratingAggregates.map((r) => r.professorId);

    const topRatedProfessors = await prisma.professor.findMany({
      where: {
        id: { in: topRatedIds },
        ...professorFilter,
      },
    });

    // Map professors with their ratings
    const topRated = ratingAggregates
      .map((rating) => {
        const professor = topRatedProfessors.find(
          (p) => p.id === rating.professorId
        );
        if (!professor) return null;

        return {
          professor,
          averageRating: rating._avg.rating || 0,
          ratingCount: rating._count.rating,
        };
      })
      .filter(Boolean);

    // Fetch Most Contacted Professors
    const contactAggregates = await prisma.savedEmail.groupBy({
      by: ["professorId"],
      _count: { id: true },
      where: dateFilter ? { createdAt: { gte: dateFilter } } : undefined,
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    });

    const mostContactedIds = contactAggregates.map((c) => c.professorId);

    const mostContactedProfessors = await prisma.professor.findMany({
      where: {
        id: { in: mostContactedIds },
        ...professorFilter,
      },
    });

    const mostContacted = contactAggregates
      .map((contact) => {
        const professor = mostContactedProfessors.find(
          (p) => p.id === contact.professorId
        );
        if (!professor) return null;

        return {
          professor,
          contactCount: contact._count.id,
        };
      })
      .filter(Boolean);

    // Fetch available filter options
    const [locations, majors] = await Promise.all([
      prisma.professor.findMany({
        select: { location: true },
        distinct: ["location"],
      }),
      prisma.professor.findMany({
        select: { major: true },
        distinct: ["major"],
      }),
    ]);

    return NextResponse.json({
      topRated,
      mostContacted,
      filters: {
        locations: locations.map((l) => l.location).sort(),
        majors: majors.map((m) => m.major).sort(),
      },
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
