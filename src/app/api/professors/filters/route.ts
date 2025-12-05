import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get distinct values from database
    const [universities, majors, locations] = await Promise.all([
      prisma.professor.findMany({
        select: { university: true },
        distinct: ["university"],
        orderBy: { university: "asc" },
      }),
      prisma.professor.findMany({
        select: { major: true },
        distinct: ["major"],
        orderBy: { major: "asc" },
      }),
      prisma.professor.findMany({
        select: { location: true },
        distinct: ["location"],
        orderBy: { location: "asc" },
      }),
    ]);

    return NextResponse.json({
      universities: universities.map((u) => u.university),
      majors: majors.map((m) => m.major),
      locations: locations.map((l) => l.location),
    });
  } catch (error) {
    console.error("Filters API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}
