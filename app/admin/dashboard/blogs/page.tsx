// app/admin/dashboard/blogs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";
import { api } from "@/lib/api";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  FileText,
  AlertCircle,
  Clock,
  User,
  X,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: string;
  author: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function BlogsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [error, setError] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("blog/admin/all");
      const blogData = response?.data || response?.blogs || [];
      setBlogs(blogData);

      const tags = new Set<string>();
      blogData.forEach((blog: Blog) => {
        blog.tags?.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get("blog/tags");
      if (response?.tags) {
        setAllTags(response.tags);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`blog/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
      setDeleteModal(null);
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  const handleViewBlog = (blog: Blog) => {
    setViewBlog(blog);
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === "all" || blog.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-stone-900">
                  Blog Posts
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  Manage your blog content and articles
                </p>
              </div>
              <button
                onClick={() => router.push("/admin/dashboard/blogs/create")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Blog Post
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-900">
                      {blogs.length}
                    </p>
                    <p className="text-sm text-stone-500">Total Posts</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Tag className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-900">
                      {allTags.length}
                    </p>
                    <p className="text-sm text-stone-500">Unique Tags</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-900">
                      {
                        blogs.filter((b) => {
                          const date = new Date(b.createdAt);
                          const now = new Date();
                          return (
                            date.getMonth() === now.getMonth() &&
                            date.getFullYear() === now.getFullYear()
                          );
                        }).length
                      }
                    </p>
                    <p className="text-sm text-stone-500">This Month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search blogs by title or excerpt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm text-gray-900"
                  />
                </div>
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm text-gray-900"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Blogs Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-stone-200 p-6 animate-pulse"
                  >
                    <div className="h-40 bg-stone-200 rounded-lg mb-4" />
                    <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-stone-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 bg-stone-100">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-12 h-12 text-stone-300" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-1">
                        <button
                          onClick={() => handleViewBlog(blog)}
                          className="p-2 bg-white rounded-lg shadow-md hover:bg-stone-50 transition-colors opacity-0 group-hover:opacity-100"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-stone-600" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/blogs/${blog._id}/edit`,
                            )
                          }
                          className="p-2 bg-white rounded-lg shadow-md hover:bg-amber-50 transition-colors opacity-0 group-hover:opacity-100"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-amber-600" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(blog._id)}
                          className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-stone-900 mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-stone-600 mb-4 line-clamp-2">
                        {blog.excerpt || "No excerpt available"}
                      </p>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded-md text-xs">
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <User className="w-3 h-3" />
                          <span>{blog.author?.name || "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500">No blog posts found</p>
                <button
                  onClick={() => router.push("/admin/dashboard/blogs/create")}
                  className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create your first blog post
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Blog Detail Modal */}
        {viewBlog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white rounded-t-2xl border-b border-stone-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Blog Post Details
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    Viewing blog post information
                  </p>
                </div>
                <button
                  onClick={() => setViewBlog(null)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Cover Image */}
                {viewBlog.coverImage && (
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image
                      src={viewBlog.coverImage}
                      alt={viewBlog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Title & Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">
                      {viewBlog.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>{viewBlog.author?.name || "Admin"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(viewBlog.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      viewBlog.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {viewBlog.status}
                  </span>
                </div>

                {/* Slug */}
                <div className="bg-stone-50 rounded-lg p-4">
                  <label className="block text-xs font-medium text-stone-500 mb-1">
                    Slug
                  </label>
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-stone-700">
                      {viewBlog.slug}
                    </code>
                    <a
                      href={`/blog/${viewBlog.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      View Live
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Excerpt
                  </label>
                  <p className="text-stone-600 text-sm leading-relaxed bg-stone-50 rounded-lg p-4">
                    {viewBlog.excerpt || "No excerpt provided"}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {viewBlog.tags && viewBlog.tags.length > 0 ? (
                      viewBlog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-stone-400">No tags added</p>
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Content Preview
                  </label>
                  <div className="bg-stone-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {viewBlog.content
                        ? viewBlog.content.substring(0, 500) +
                          (viewBlog.content.length > 500 ? "..." : "")
                        : "No content available"}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">
                      Created At
                    </label>
                    <p className="text-sm text-stone-700">
                      {formatDateTime(viewBlog.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">
                      Last Updated
                    </label>
                    <p className="text-sm text-stone-700">
                      {formatDateTime(viewBlog.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-stone-200 p-6 flex justify-between">
                <button
                  onClick={() => setDeleteModal(viewBlog._id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete Post
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setViewBlog(null)}
                    className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setViewBlog(null);
                      router.push(
                        `/admin/dashboard/blogs/${viewBlog._id}/edit`,
                      );
                    }}
                    className="px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    Edit Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    Delete Blog Post
                  </h3>
                  <p className="text-sm text-stone-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-stone-600 mb-6">
                Are you sure you want to delete this blog post? All associated
                data will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
