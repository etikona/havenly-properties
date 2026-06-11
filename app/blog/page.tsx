// app/blog/page.tsx
import { Metadata } from "next";

import { api } from "@/services/api";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Real Estate Blog | RealEstateBD",
  description:
    "Expert insights on property buying, investment tips, market trends, and real estate news in Bangladesh.",
  keywords:
    "real estate blog Bangladesh, property buying guide, investment tips, Dhaka real estate news",
};

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([
    api.blog.getAll(),
    api.blog.getTags(),
  ]);

  return <BlogClient initialPosts={posts} initialTags={tags} />;
}
