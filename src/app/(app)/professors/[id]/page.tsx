import { getProfessorById } from "@/lib/actions/professor.actions";
import { notFound } from "next/navigation";
import { ProfessorDetailClient } from "./professor-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfessorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const professor = await getProfessorById(id);

  if (!professor) {
    notFound();
  }

  return <ProfessorDetailClient professor={professor} />;
}
