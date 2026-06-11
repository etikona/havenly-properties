// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/services/api";
import BlogDetailClient from "./BlogDetailClient";
// import BlogDetailClient from './BlogDetailClient';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await api.blog.getBySlug(slug);
    return {
      title: `${post.title} | RealEstateBD Blog`,
      description: post.excerpt,
      keywords: post.tags.join(", "),
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [post.coverImage],
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [post.coverImage],
      },
    };
  } catch {
    return {
      title: "Blog Post Not Found | RealEstateBD",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const post = await api.blog.getBySlug(slug);
  return <BlogDetailClient post={post} />;
}
