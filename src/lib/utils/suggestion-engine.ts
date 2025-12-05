import { Professor } from "@prisma/client";

interface UserContext {
  bookmarkedProfessors: Professor[];
  savedEmailProfessors: Professor[];
  allProfessors: Professor[];
}

interface SuggestionResult {
  professor: Professor;
  reason: string;
  score: number;
}

/**
 * Rule-based suggestion engine
 * Suggests professors based on user's bookmarks and email history
 */
export function generateSuggestions(context: UserContext): SuggestionResult[] {
  const { bookmarkedProfessors, savedEmailProfessors, allProfessors } = context;

  // Extract user interests
  const bookmarkedIds = new Set(bookmarkedProfessors.map((p) => p.id));
  const emailedIds = new Set(savedEmailProfessors.map((p) => p.id));

  const userMajors = new Set(bookmarkedProfessors.map((p) => p.major));
  const userLocations = new Set(bookmarkedProfessors.map((p) => p.location));

  const userInterests = new Set<string>();
  bookmarkedProfessors.forEach((p) => {
    p.researchInterests.forEach((interest) => userInterests.add(interest));
  });
  savedEmailProfessors.forEach((p) => {
    p.researchInterests.forEach((interest) => userInterests.add(interest));
  });

  // Score each professor
  const scored: SuggestionResult[] = [];

  for (const professor of allProfessors) {
    // Skip already bookmarked
    if (bookmarkedIds.has(professor.id)) continue;

    let score = 0;
    const reasons: string[] = [];

    // Same major as bookmarked professors
    if (userMajors.has(professor.major)) {
      score += 30;
      reasons.push(`Expert in ${professor.major}`);
    }

    // Overlapping research interests
    const matchingInterests = professor.researchInterests.filter((interest) =>
      userInterests.has(interest)
    );
    if (matchingInterests.length > 0) {
      score += matchingInterests.length * 20;
      reasons.push(`Researches ${matchingInterests.slice(0, 2).join(", ")}`);
    }

    // Same location (proximity)
    if (userLocations.has(professor.location)) {
      score += 10;
      reasons.push(`Based in ${professor.location}`);
    }

    // Already contacted (warm lead)
    if (emailedIds.has(professor.id)) {
      score += 15;
      reasons.push("You've contacted them before");
    }

    // Only suggest if there's some relevance
    if (score > 0) {
      scored.push({
        professor,
        reason: reasons.join(" • "),
        score,
      });
    }
  }

  // Sort by score and return top 6
  return scored.sort((a, b) => b.score - a.score).slice(0, 6);
}
