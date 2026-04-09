// Project status enum
export type ProjectStatus = "ongoing" | "upcoming" | "completed";

export interface ProjectImage {
  _id: string;
  imageUrl: string;
  caption?: string;
}

export interface ConstructionUpdate {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: Date;
}

export interface Amenity {
  _id: string;
  name: string;
  icon?: string;
}

export interface FloorPlan {
  _id: string;
  label: string; // e.g. "3 BHK Type A"
  imageUrl: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: ProjectStatus;
  description: string;
  location: string;
  mapEmbedUrl: string;
  bannerImageUrl: string;
  brochureUrl?: string;
  images: ProjectImage[];
  amenities: Amenity[];
  floorPlans: FloorPlan[];
  constructionUpdates: ConstructionUpdate[];
  createdAt: Date;
  updatedAt: Date;
}

// For ISR/listing pages (lightweight)
export type ProjectCard = Pick<
  Project,
  "_id" | "title" | "slug" | "category" | "location" | "bannerImageUrl"
>;
