"use server";

import prisma from "@/lib/prisma";
import { Professor } from "@prisma/client";

/**
 * Fetch professor by ID
 * @param id - Professor ID
 * @returns Professor object or null if not found
 */
export async function getProfessorById(id: string): Promise<Professor | null> {
  try {
    const professor = await prisma.professor.findUnique({
      where: { id },
    });

    return professor;
  } catch (error) {
    console.error("Error fetching professor:", error);
    return null;
  }
}
