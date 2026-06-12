// lib/api.ts - Complete updated file

const API_BASE_URL = "https://heavenly-backend-6y7j.onrender.com/api/v1";

// ============================================
// TYPES
// ============================================

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
  totalArea?: string;
  totalUnits?: string;
}

export interface PageContent {
  _id: string;
  key: string;
  content: Record<string, any>;
}

export interface LeadData {
  type: "buyer" | "landowner" | "contact";

  name: string;
  email: string;
  phone: string;

  message?: string;

  projectId?: string;
  projectName?: string;

  source?: string;

  preferredContactMethod?: "email" | "phone" | "whatsapp";
  preferredTime?: string;

  // Buyer specific
  projectInterest?: string;
  budget?: string;
  unitType?: string;

  // Landowner specific
  landLocation?: string;
  landSize?: string;
  landDocumentType?: string;
}
export interface LeadResponse {
  success: boolean;
  data?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
    projectId?: string;
    status: "new" | "contacted" | "qualified" | "lost";
    createdAt: string;
  };
  message?: string;
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

// ============================================
// COOKIE MANAGEMENT UTILITIES
// ============================================

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

// ============================================
// API SERVICE CLASS (AUTHENTICATED REQUESTS)
// ============================================

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token =
        CookieManager.get("adminToken") || localStorage.getItem("adminToken");

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
      const days = rememberMe ? 7 : 1;
      CookieManager.set("adminToken", token, days);
      localStorage.setItem("adminToken", token);

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

    if (data.token) {
      this.setToken(data.token, credentials.rememberMe);

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
// PUBLIC API FUNCTIONS
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

    projects = projects.sort((a: Project, b: Project) => {
      if (a.isFeatured === b.isFeatured) {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      return a.isFeatured ? -1 : 1;
    });

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
      next: { revalidate: 3600 },
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

    if (options.category) {
      projects = projects.filter(
        (p: Project) => p.category === options.category,
      );
    }

    if (options.featured) {
      projects = projects.filter((p: Project) => p.isFeatured === true);
    }

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
    const response = await fetch(`${API_BASE_URL}/blog`, {
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

    if (options.category) {
      blogs = blogs.filter((b: BlogPost) => b.category === options.category);
    }

    if (options.tag) {
      blogs = blogs.filter((b: BlogPost) => b.tags.includes(options.tag!));
    }

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

// ============================================
// LEAD MANAGEMENT FUNCTIONS
// ============================================

/**
 * Submit a lead to the backend
 * Creates a new lead entry in the database
 */
export async function submitLead(leadData: LeadData): Promise<LeadResponse> {
  try {
    // Validate required fields
    if (!leadData.name || !leadData.email || !leadData.phone) {
      throw new Error("Name, email, and phone are required fields");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      throw new Error("Please provide a valid email address");
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(leadData.phone)) {
      throw new Error("Please provide a valid phone number");
    }

    const response = await fetch(`${API_BASE_URL}/lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...leadData,
        source: leadData.source || "website_contact_form",
        status: "new",
        createdAt: new Date().toISOString(),
      }),
    });

    // Handle authentication error
    if (response.status === 401) {
      console.warn(
        "Lead API requires authentication. Lead saved locally only.",
      );

      const localLeads = JSON.parse(
        localStorage.getItem("pendingLeads") || "[]",
      );
      localLeads.push({
        ...leadData,
        id: Date.now(),
        pendingSync: true,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("pendingLeads", JSON.stringify(localLeads));

      return {
        success: true,
        data: {
          _id: `local_${Date.now()}`,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          message: leadData.message,
          projectId: leadData.projectId,
          status: "new",
          createdAt: new Date().toISOString(),
        },
        message: "Lead saved locally. Will sync when authenticated.",
      };
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to submit lead" }));
      throw new Error(
        error.message || `Failed to submit lead: ${response.status}`,
      );
    }

    const result = await response.json();

    // Store in localStorage for backup
    const submittedLeads = JSON.parse(
      localStorage.getItem("submittedLeads") || "[]",
    );
    submittedLeads.push({
      ...leadData,
      serverId: result.data?._id,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem("submittedLeads", JSON.stringify(submittedLeads));

    return result;
  } catch (error) {
    console.error("Error submitting lead:", error);

    // Store failed lead in localStorage for retry
    const failedLeads = JSON.parse(localStorage.getItem("failedLeads") || "[]");
    failedLeads.push({
      ...leadData,
      failedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
    localStorage.setItem("failedLeads", JSON.stringify(failedLeads));

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to submit lead",
    };
  }
}

/**
 * Sync pending leads (useful for authenticated sessions)
 * Call this after login to sync any leads saved while unauthenticated
 */
export async function syncPendingLeads(): Promise<{
  synced: number;
  failed: number;
}> {
  try {
    const pendingLeads = JSON.parse(
      localStorage.getItem("pendingLeads") || "[]",
    );

    if (pendingLeads.length === 0) {
      return { synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;
    const token =
      localStorage.getItem("adminToken") || CookieManager.get("adminToken");

    for (const lead of pendingLeads) {
      try {
        const response = await fetch(`${API_BASE_URL}/lead`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(lead),
        });

        if (response.ok) {
          synced++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        console.error("Failed to sync lead:", error);
      }
    }

    // Clear synced leads
    if (synced > 0) {
      const remainingLeads = pendingLeads.slice(-failed);
      localStorage.setItem("pendingLeads", JSON.stringify(remainingLeads));
    }

    return { synced, failed };
  } catch (error) {
    console.error("Error syncing pending leads:", error);
    return { synced: 0, failed: 0 };
  }
}

/**
 * Get all leads (requires authentication)
 * For admin dashboard use
 */
export async function getAllLeads(options?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{
  success: boolean;
  data?: LeadResponse["data"][];
  total?: number;
}> {
  try {
    const token =
      localStorage.getItem("adminToken") || CookieManager.get("adminToken");

    if (!token) {
      throw new Error("Authentication required to fetch leads");
    }

    const { page = 1, limit = 50, status } = options || {};
    let url = `${API_BASE_URL}/lead?page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch leads: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching leads:", error);
    return { success: false };
  }
}

/**
 * Update lead status (requires authentication)
 * For admin dashboard to manage lead status
 */
export async function updateLeadStatus(
  leadId: string,
  status: "new" | "contacted" | "qualified" | "lost",
): Promise<{ success: boolean; message?: string }> {
  try {
    const token =
      localStorage.getItem("adminToken") || CookieManager.get("adminToken");

    if (!token) {
      throw new Error("Authentication required to update lead status");
    }

    const response = await fetch(`${API_BASE_URL}/lead/${leadId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      throw new Error(`Failed to update lead status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating lead status:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Update failed",
    };
  }
}

/**
 * Get lead by ID (requires authentication)
 */
export async function getLeadById(
  leadId: string,
): Promise<LeadResponse | null> {
  try {
    const token =
      localStorage.getItem("adminToken") || CookieManager.get("adminToken");

    if (!token) {
      throw new Error("Authentication required to fetch lead");
    }

    const response = await fetch(`${API_BASE_URL}/lead/${leadId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch lead: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching lead:", error);
    return null;
  }
}

/**
 * Submit contact form data (legacy function)
 */
export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
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

    // Also submit as lead
    await submitLead(formData);

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Failed to submit form" };
  }
}
