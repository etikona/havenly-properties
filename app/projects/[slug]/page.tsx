// app/projects/[slug]/page.tsx
import { Metadata } from "next";
import { api } from "@/services/api";
import ProjectDetailClient from "./ProjectDetailClient";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await api.project.getBySlug(slug);
    return {
      title: `${project.title} | RealEstateBD Projects`,
      description: project.summary,
      keywords: `${project.title}, ${project.location}, real estate project`,
    };
  } catch {
    return {
      title: "Project Not Found | RealEstateBD",
    };
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const project = await api.project.getBySlug(slug);
  return <ProjectDetailClient project={project} />;
}
