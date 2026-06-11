// app/projects/page.tsx
import { Metadata } from "next";
// import ProjectsClient from "./ProjectsClient";
import { api } from "@/services/api";
import ProjectsClient from "./ProjectClient";

export const metadata: Metadata = {
  title: "Our Projects | RealEstateBD",
  description:
    "Explore our premium residential and commercial projects across Bangladesh. Find your dream home in Dhaka, Chattogram, Sylhet, and more.",
  keywords:
    "real estate projects Bangladesh, apartments for sale, residential projects Dhaka, ongoing projects",
};

export default async function ProjectsPage() {
  const projects = await api.project.getAll();

  return <ProjectsClient initialProjects={projects} />;
}
