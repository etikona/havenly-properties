// types/index.ts
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  category: string;
  author: string;
  publishedAt: string;
  views: number;
  content?: string; // For detail page
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: "ongoing" | "upcoming" | "completed";
  summary?: string;
  location: string;
  completionDate: string;
  isFeatured: boolean;
  bannerImage?: string;
  createdAt?: string;
  description?: string; // For detail page
  features?: string[];
  totalArea?: string;
  totalUnits?: string;
}
