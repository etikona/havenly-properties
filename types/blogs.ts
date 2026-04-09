export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string; // Rich text / HTML from TipTap
  coverImage: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogCard = Pick<
  BlogPost,
  "_id" | "title" | "slug" | "coverImage" | "tags" | "createdAt"
>;
