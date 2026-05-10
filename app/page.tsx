import type { Metadata } from "next";
import { getFeaturedProjects, getBlogs, getPageContent } from "@/lib/api";

import HeroSection from "../app/components/home/HeroSection";
import StatsSection from "../app/components/home/StatsSection";
import FeaturedProjects from "../app/components/home/FeaturedProjects";
import WhyChooseUs from "../app/components/home/WhyChooseUs";
import CTASection from "../app/components/home/CTASection";
import TestimonialsSection from "../app/components/home/TestimonialsSection";
import BlogHighlights from "../app/components/home/BlogHighlights";
import ContactSection from "../app/components/home/ContactSection";

export const metadata: Metadata = {
  title: "RealEstateBD — Premium Property Developers in Bangladesh",
  description:
    "Discover premium residential projects in Dhaka and across Bangladesh. Trusted by 950+ families for over 20 years.",
};

// ISR — revalidate every hour
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch all data in parallel (server-side)
  const [projectsRes, blogsRes, statsRes] = await Promise.allSettled([
    getFeaturedProjects(),
    getBlogs({ limit: 3 }),
    getPageContent("home-stats"),
  ]);

  const projects =
    projectsRes.status === "fulfilled" ? projectsRes.value.data : [];
  const blogs = blogsRes.status === "fulfilled" ? blogsRes.value.data : [];
  const statsContent =
    statsRes.status === "fulfilled"
      ? (statsRes.value.data.content as Record<string, unknown>)
      : null;

  // Map CMS stats to StatItem format (with fallbacks)
  const stats = statsContent
    ? [
        {
          value: Number(statsContent.yearsExperience) || 20,
          suffix: "+",
          label: "Years Experience",
        },
        {
          value: Number(statsContent.completedProjects) || 35,
          suffix: "+",
          label: "Projects Delivered",
        },
        {
          value: Number(statsContent.totalUnitsDelivered) || 1200,
          suffix: "+",
          label: "Units Handed Over",
        },
        {
          value: Number(statsContent.happyFamilies) || 950,
          suffix: "+",
          label: "Happy Families",
        },
      ]
    : undefined;

  return (
    <>
      {/* 1. Hero — full-screen slider */}
      <HeroSection />

      {/* 2. Key statistics */}
      <StatsSection stats={stats} />

      {/* 3. Featured projects with category filter */}
      <FeaturedProjects projects={projects} />

      {/* 4. Why choose us + value pillars */}
      <WhyChooseUs />

      {/* 5. Buyers & Landowners CTA */}
      <CTASection />

      {/* 6. Testimonials carousel */}
      <TestimonialsSection />

      {/* 7. Latest blog articles */}
      <BlogHighlights blogs={blogs} />

      {/* 8. Contact / inquiry form */}
      <ContactSection />
    </>
  );
}
