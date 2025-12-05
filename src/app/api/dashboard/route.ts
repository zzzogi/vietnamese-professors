import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateSuggestions } from "@/lib/utils/suggestion-engine";

/**
 * GET /api/dashboard - Fetch user dashboard data
 */
export async function GET() {
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

    // Fetch bookmarks
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        professor: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Fetch recent emails
    const recentEmails = await prisma.savedEmail.findMany({
      where: { userId: user.id },
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Fetch user stats
    const [totalBookmarks, totalEmails, totalRatings] = await Promise.all([
      prisma.bookmark.count({ where: { userId: user.id } }),
      prisma.savedEmail.count({ where: { userId: user.id } }),
      prisma.professorRating.count({ where: { userId: user.id } }),
    ]);

    // Generate suggestions
    const bookmarkedProfessors = bookmarks.map((b) => b.professor);
    const emailedProfessorIds = [
      ...new Set(recentEmails.map((e) => e.professorId)),
    ];

    const savedEmailProfessors = await prisma.professor.findMany({
      where: { id: { in: emailedProfessorIds } },
    });

    const allProfessors = await prisma.professor.findMany({
      take: 100, // Limit for performance
    });

    const suggestions = generateSuggestions({
      bookmarkedProfessors,
      savedEmailProfessors,
      allProfessors,
    });

    return NextResponse.json({
      bookmarks,
      recentEmails,
      suggestions,
      stats: {
        totalBookmarks,
        totalEmails,
        totalRatings,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
