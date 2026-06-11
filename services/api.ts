// import { BlogPost } from "@/types/blogs";
// import { Project } from "@/types/project";

import { BlogPost, Project } from "@/types";

// services/api.ts
const API_BASE_URL = "https://heavenly-backend-6y7j.onrender.com/api/v1";

export const api = {
  // Blog endpoints
  blog: {
    getAll: async (): Promise<BlogPost[]> => {
      const response = await fetch(`${API_BASE_URL}/blog`);
      const data = await response.json();
      return data.data;
    },
    getById: async (id: string): Promise<BlogPost> => {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`);
      const data = await response.json();
      return data.data;
    },
    getBySlug: async (slug: string): Promise<BlogPost> => {
      const response = await fetch(`${API_BASE_URL}/blog/slug/${slug}`);
      const data = await response.json();
      return data.data;
    },
    getTags: async (): Promise<string[]> => {
      const response = await fetch(`${API_BASE_URL}/blog/tags`);
      const data = await response.json();
      return data.data;
    },
  },

  // Project endpoints
  project: {
    getAll: async (): Promise<Project[]> => {
      const response = await fetch(`${API_BASE_URL}/project`);
      const data = await response.json();
      return data.data;
    },
    getById: async (id: string): Promise<Project> => {
      const response = await fetch(`${API_BASE_URL}/project/${id}`);
      const data = await response.json();
      return data.data;
    },
    getBySlug: async (slug: string): Promise<Project> => {
      const response = await fetch(`${API_BASE_URL}/project/slug/${slug}`);
      const data = await response.json();
      return data.data;
    },
  },
};
