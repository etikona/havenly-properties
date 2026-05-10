const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type FetchOptions = RequestInit & {
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
};

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Projects ────────────────────────────────────────────────────────────────
export async function getFeaturedProjects() {
  return apiFetch<{ success: boolean; data: Project[] }>(
    '/projects?featured=true&limit=6',
    { next: { revalidate: 3600, tags: ['projects'] } }
  );
}

export async function getProjects(params?: {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.featured) query.set('featured', 'true');

  return apiFetch<{ success: boolean; data: Project[]; total: number; pages: number }>(
    `/projects?${query}`,
    { next: { revalidate: 3600, tags: ['projects'] } }
  );
}

export async function getProjectBySlug(slug: string) {
  return apiFetch<{ success: boolean; data: Project }>(
    `/projects/slug/${slug}`,
    { next: { revalidate: 3600, tags: [`project-${slug}`] } }
  );
}

// ── Blogs ───────────────────────────────────────────────────────────────────
export async function getBlogs(params?: { page?: number; limit?: number; tag?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.tag) query.set('tag', params.tag);

  return apiFetch<{ success: boolean; data: Blog[]; total: number }>(
    `/blogs?${query}`,
    { next: { revalidate: 1800, tags: ['blogs'] } }
  );
}

export async function getBlogBySlug(slug: string) {
  return apiFetch<{ success: boolean; data: Blog }>(
    `/blogs/slug/${slug}`,
    { next: { revalidate: 1800, tags: [`blog-${slug}`] } }
  );
}

// ── Pages (CMS) ─────────────────────────────────────────────────────────────
export async function getPageContent(pageKey: 'about' | 'buyers' | 'landowners' | 'home-stats') {
  return apiFetch<{ success: boolean; data: { pageKey: string; content: Record<string, unknown> } }>(
    `/pages/${pageKey}`,
    { next: { revalidate: 3600, tags: [`page-${pageKey}`] } }
  );
}

// ── Leads (client-side only) ────────────────────────────────────────────────
export async function submitLead(data: LeadFormData) {
  return apiFetch<{ success: boolean; message: string }>('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export { apiFetch };
