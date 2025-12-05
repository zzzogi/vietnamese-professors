import { Professor } from "@prisma/client";
import { ProfessorCard } from "./professor-card";
import { ProfessorCardLocked } from "./professor-card-locked";
import { UserRole } from "@/lib/constants/roles";
import { FEATURE_LIMITS } from "@/lib/constants/limits";

interface ProfessorGridProps {
  professors: Professor[];
  userRole: UserRole;
  showLockedCards?: boolean;
}

export function ProfessorGrid({
  professors,
  userRole,
  showLockedCards = true,
}: ProfessorGridProps) {
  const viewLimit = FEATURE_LIMITS[userRole].professorViews;
  const canViewAll = viewLimit === Infinity;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {professors.map((professor, index) => {
        const isLocked = !canViewAll && index >= viewLimit;
        const isProLocked = professor.isPro && userRole !== UserRole.PRO;

        if (isLocked && showLockedCards) {
          return (
            <ProfessorCardLocked
              key={professor.id}
              professor={professor}
              reason="guest"
            />
          );
        }

        if (isProLocked) {
          return (
            <ProfessorCardLocked
              key={professor.id}
              professor={professor}
              reason="pro"
            />
          );
        }

        return <ProfessorCard key={professor.id} professor={professor} />;
      })}
    </div>
  );
}
