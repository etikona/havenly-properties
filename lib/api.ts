// lib/api.ts - Complete updated file

const API_BASE_URL = "https://heavenly-backend-6y7j.onrender.com/api/v1";

// Types
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
  content?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: "ongoing" | "upcoming" | "completed";
  summary: string;
  location: string;
  completionDate: string;
  isFeatured: boolean;
  bannerImage?: string;
  createdAt?: string;
  description?: string;
  features?: string[];
  price?: string;
  area?: string;
}

export interface PageContent {
  _id: string;
  key: string;
  content: Record<string, any>;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  admin: User;
}

// Cookie management utilities
const CookieManager = {
  set(name: string, value: string, days: number = 7) {
    if (typeof document === "undefined") return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },

  get(name: string): string | null {
    if (typeof document === "undefined") return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  remove(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },
};

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // Try to get token from cookie first, then localStorage as fallback
      this.token =
        CookieManager.get("adminToken") || localStorage.getItem("adminToken");

      // If token exists in localStorage but not in cookie, migrate it
      if (
        !CookieManager.get("adminToken") &&
        localStorage.getItem("adminToken")
      ) {
        this.setToken(localStorage.getItem("adminToken")!);
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token =
      this.token ||
      localStorage.getItem("adminToken") ||
      CookieManager.get("adminToken");

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  setToken(token: string, rememberMe: boolean = true) {
    this.token = token;
    if (typeof window !== "undefined") {
      // Store in both cookie and localStorage for redundancy
      const days = rememberMe ? 7 : 1; // 7 days or 1 day
      CookieManager.set("adminToken", token, days);
      localStorage.setItem("adminToken", token);

      // Also store token expiry info
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);
      localStorage.setItem("tokenExpiry", expiryDate.toISOString());
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      CookieManager.remove("adminToken");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("adminUser");
    }
  }

  isTokenExpired(): boolean {
    if (typeof window === "undefined") return true;

    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) return false;

    return new Date(expiry) < new Date();
  }

  async login(
    credentials: LoginCredentials & { rememberMe?: boolean },
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Login failed" }));
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    console.log("LOGIN API RESPONSE", data);

    // Store the token
    if (data.token) {
      this.setToken(data.token, credentials.rememberMe);

      // Store user data
      if (typeof window !== "undefined" && data.admin) {
        localStorage.setItem("adminUser", JSON.stringify(data.admin));
      }
    }

    return data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Registration failed" }));
      throw new Error(error.message || "Registration failed");
    }

    return await response.json();
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      this.removeToken();
    }
  }

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });

    const data = await response.json();

    console.log("GETME API RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    return data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      this.removeToken();
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to change password" }));
      throw new Error(error.message || "Failed to change password");
    }

    return await response.json();
  }

  // Generic methods for future API calls
  async get(endpoint: string) {
    if (this.isTokenExpired()) {
      this.removeToken();
      throw new Error("Token expired");
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: this.getHeaders(),
    });

    if (response.status === 401) {
      this.removeToken();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `GET ${endpoint} failed`);
    }

    return await response.json();
  }

  async post(endpoint: string, data: any) {
    if (this.isTokenExpired()) {
      this.removeToken();
      throw new Error("Token expired");
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      this.removeToken();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `POST ${endpoint} failed`);
    }

    return await response.json();
  }

  async put(endpoint: string, data: any) {
    if (this.isTokenExpired()) {
      this.removeToken();
      throw new Error("Token expired");
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      this.removeToken();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `PUT ${endpoint} failed`);
    }

    return await response.json();
  }

  async patch(endpoint: string, data: any) {
    if (this.isTokenExpired()) {
      this.removeToken();
      throw new Error("Token expired");
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      this.removeToken();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `PATCH ${endpoint} failed`);
    }

    return await response.json();
  }

  async delete(endpoint: string) {
    if (this.isTokenExpired()) {
      this.removeToken();
      throw new Error("Token expired");
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (response.status === 401) {
      this.removeToken();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `DELETE ${endpoint} failed`);
    }

    return await response.json();
  }
}

export const api = new ApiService();

// ============================================
// PUBLIC API FUNCTIONS FOR HOME PAGE
// ============================================

/**
 * Get featured projects for home page
 * Returns projects sorted by creation date, with featured ones first
 */
export async function getFeaturedProjects(
  limit: number = 6,
): Promise<{ data: Project[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/project`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("API returned unsuccessful response");
    }

    let projects = result.data || [];

    // Sort: featured projects first, then by creation date
    projects = projects.sort((a: Project, b: Project) => {
      if (a.isFeatured === b.isFeatured) {
        // If both have same featured status, sort by date (newer first)
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      // Featured projects come first
      return a.isFeatured ? -1 : 1;
    });

    // Apply limit
    if (limit) {
      projects = projects.slice(0, limit);
    }

    return { data: projects };
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return { data: [] };
  }
}

/**
 * Get blogs with pagination and filtering
 */
export async function getBlogs(
  options: {
    limit?: number;
    category?: string;
    tag?: string;
    page?: number;
  } = {},
): Promise<{ data: BlogPost[]; total?: number; pages?: number }> {
  try {
    const { limit = 10, category, tag, page = 1 } = options;

    let url = `${API_BASE_URL}/blog?page=${page}&limit=${limit}`;

    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("API returned unsuccessful response");
    }

    return {
      data: result.data || [],
      total: result.total,
      pages: result.pages,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { data: [] };
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/slug/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch blog: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/project/slug/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch project: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
}

/**
 * Get all projects with optional filtering
 */
export async function getAllProjects(
  options: {
    category?: string;
    featured?: boolean;
    limit?: number;
  } = {},
): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/project`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("API returned unsuccessful response");
    }

    let projects = result.data || [];

    // Apply filters
    if (options.category) {
      projects = projects.filter(
        (p: Project) => p.category === options.category,
      );
    }

    if (options.featured) {
      projects = projects.filter((p: Project) => p.isFeatured === true);
    }

    // Apply limit
    if (options.limit) {
      projects = projects.slice(0, options.limit);
    }

    return projects;
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return [];
  }
}

/**
 * Get all blog posts with optional filtering
 */
export async function getAllBlogs(
  options: {
    category?: string;
    tag?: string;
    limit?: number;
  } = {},
): Promise<BlogPost[]> {
  try {
    let url = `${API_BASE_URL}/blog`;

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("API returned unsuccessful response");
    }

    let blogs = result.data || [];

    // Apply filters
    if (options.category) {
      blogs = blogs.filter((b: BlogPost) => b.category === options.category);
    }

    if (options.tag) {
      blogs = blogs.filter((b: BlogPost) => b.tags.includes(options.tag!));
    }

    // Apply limit
    if (options.limit) {
      blogs = blogs.slice(0, options.limit);
    }

    return blogs;
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return [];
  }
}

/**
 * Get page content by key (for CMS-like content)
 */
export async function getPageContent(
  key: string,
): Promise<{ data: PageContent } | null> {
  try {
    // For now, return default stats since the endpoint might not exist
    // You can replace this with actual API call when the endpoint is available

    // Default stats for the home page
    const defaultStats: Record<string, any> = {
      "home-stats": {
        yearsExperience: 20,
        completedProjects: 35,
        totalUnitsDelivered: 1200,
        happyFamilies: 950,
      },
    };

    if (defaultStats[key]) {
      return {
        data: {
          _id: key,
          key: key,
          content: defaultStats[key],
        },
      };
    }

    // If you have an actual API endpoint for page content, use this:
    /*
    const response = await fetch(`${API_BASE_URL}/content/${key}`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch page content: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    */

    return null;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return null;
  }
}

/**
 * Get blog tags
 */
export async function getBlogTags(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/tags`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    return [];
  }
}

/**
 * Submit contact form data
 */
export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // For Google Sheets integration
    const GOOGLE_SHEETS_WEBHOOK = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (GOOGLE_SHEETS_WEBHOOK) {
      await fetch(GOOGLE_SHEETS_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: formData.source || "Website Contact Form",
        }),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Failed to submit form" };
  }
}
