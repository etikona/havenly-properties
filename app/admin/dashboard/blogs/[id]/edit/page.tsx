// app/admin/dashboard/blogs/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Loader2,
  AlertCircle,
  FileText,
  Tag,
  Eye,
  Calendar,
  User,
} from "lucide-react";

interface BlogData {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  tagInput: string;
  status: string;
  coverImage?: string;
  author?: {
    name: string;
  };
  createdAt: string;
  slug: string;
}

export default function EditBlog() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState<BlogData>({
    _id: "",
    title: "",
    excerpt: "",
    content: "",
    tags: [],
    tagInput: "",
    status: "published",
    coverImage: "",
    createdAt: "",
    slug: "",
  });

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setFetching(true);
      const response = await api.get(`blog/admin/${blogId}`);
      const blog = response?.data || response?.blog;

      if (blog) {
        setFormData({
          ...blog,
          tags: blog.tags || [],
          tagInput: "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      setError("Failed to load blog details");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const tag = formData.tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Send as JSON, not FormData
      const blogData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        tags: formData.tags,
        status: formData.status,
      };

      await api.put(`blog/${blogId}`, blogData);

      setSuccessMessage("Blog post updated successfully!");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/dashboard/blogs");
      }, 1500);
    } catch (error: any) {
      console.error("Failed to update blog:", error);
      setError(error.message || "Failed to update blog post");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (fetching) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-stone-50">
          <AdminSidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <div
            className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
          >
            <AdminHeader
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                <p className="text-stone-500">Loading blog post...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-stone-50">
        <AdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div
          className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
        >
          <AdminHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <main className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.push("/admin/dashboard/blogs")}
                className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Blogs</span>
              </button>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-stone-900">
                    Edit Blog Post
                  </h1>
                  <p className="text-stone-500 mt-1 text-sm">
                    Update your blog content
                  </p>
                </div>
                {formData.slug && (
                  <a
                    href={`/blog/${formData.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Post
                  </a>
                )}
              </div>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-green-800 text-sm font-medium">
                  {successMessage}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Blog Meta Info */}
                  {formData.createdAt && (
                    <div className="bg-white rounded-xl border border-stone-200 p-4">
                      <div className="flex items-center gap-6 text-sm text-stone-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{formData.author?.name || "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {formatDate(formData.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span>{formData.tags.length} tags</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Title & Excerpt */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Post Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900 text-lg"
                          placeholder="Enter a compelling title..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Excerpt
                        </label>
                        <textarea
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900 resize-none"
                          placeholder="Brief description of the post..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-600" />
                        Content <span className="text-red-500">*</span>
                      </h2>
                      <span className="text-xs text-stone-400">
                        Markdown supported
                      </span>
                    </div>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={20}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900 resize-none font-mono text-sm leading-relaxed"
                      placeholder="Write your blog content here..."
                      required
                    />
                  </div>
                </div>

                {/* Sidebar - Right Side */}
                <div className="space-y-6">
                  {/* Cover Image Preview */}
                  {formData.coverImage && (
                    <div className="bg-white rounded-xl border border-stone-200 p-6">
                      <h2 className="text-lg font-semibold text-stone-900 mb-4">
                        Cover Image
                      </h2>
                      <img
                        src={formData.coverImage}
                        alt={formData.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <p className="text-xs text-stone-400 mt-2">
                        Current cover image
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-amber-600" />
                      Tags
                    </h2>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        name="tagInput"
                        value={formData.tagInput}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1 px-3 py-2.5 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900 text-sm"
                        placeholder="Add a tag..."
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.length === 0 && (
                        <p className="text-sm text-stone-400">
                          No tags added yet
                        </p>
                      )}
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4">
                      Status
                    </h2>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Post
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push("/admin/dashboard/blogs")}
                      className="w-full px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-xl transition-colors border border-stone-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
