import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Lấy query parameters
    const search = searchParams.get("search") || "";
    const university = searchParams.get("university") || "";
    const major = searchParams.get("major") || "";
    const location = searchParams.get("location") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Tính skip cho pagination
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    // Search filter (search trong name, university, major)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { university: { contains: search, mode: "insensitive" } },
        { major: { contains: search, mode: "insensitive" } },
      ];
    }

    // Additional filters
    if (university) {
      where.university = { contains: university, mode: "insensitive" };
    }
    if (major) {
      where.major = { contains: major, mode: "insensitive" };
    }
    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    // Fetch professors với pagination
    const [professors, total] = await Promise.all([
      prisma.professor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.professor.count({ where }),
    ]);

    // Tính toán metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      data: professors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch professors" },
      { status: 500 }
    );
  }
}
