// app/admin/dashboard/blogs/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  FileText,
  Tag,
} from "lucide-react";
import Image from "next/image";

export default function CreateBlog() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: [] as string[],
    tagInput: "",
    status: "published",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById(
      "content-editor",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    let newText;
    switch (syntax) {
      case "bold":
        newText = `${before}**${selection || "bold text"}**${after}`;
        break;
      case "italic":
        newText = `${before}*${selection || "italic text"}*${after}`;
        break;
      case "list":
        newText = `${before}\n- ${selection || "list item"}${after}`;
        break;
      case "link":
        newText = `${before}[${selection || "link text"}](url)${after}`;
        break;
      case "image":
        newText = `${before}![${selection || "image alt"}](url)${after}`;
        break;
      default:
        newText = text;
    }

    setFormData((prev) => ({ ...prev, content: newText }));
    textarea.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Prepare JSON data
      const blogData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        tags: formData.tags,
        status: formData.status,
      };

      console.log("Creating blog with data:", blogData);

      // Send as JSON
      const response = await api.post("blog", blogData);
      console.log("Blog created successfully:", response);

      setSuccessMessage("Blog post published successfully!");

      setTimeout(() => {
        router.push("/admin/dashboard/blogs");
      }, 1500);
    } catch (error: any) {
      console.error("Failed to create blog:", error);
      setError(
        error.message || "Failed to create blog post. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
            <div className="mb-8">
              <button
                onClick={() => router.push("/admin/dashboard/blogs")}
                className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Blogs</span>
              </button>
              <h1 className="text-2xl font-bold text-stone-900">
                Create New Blog Post
              </h1>
              <p className="text-stone-500 mt-1 text-sm">
                Write and publish engaging content for your audience
              </p>
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
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title & Excerpt */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      Post Details
                    </h2>
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-lg"
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
                          placeholder="Brief description of the post (appears in previews)..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-stone-900">
                        Content <span className="text-red-500">*</span>
                      </h2>
                      <div className="flex items-center gap-1 bg-stone-50 rounded-lg p-1">
                        {[
                          {
                            icon: Bold,
                            action: "bold",
                            label: "Bold (Ctrl+B)",
                          },
                          {
                            icon: Italic,
                            action: "italic",
                            label: "Italic (Ctrl+I)",
                          },
                          { icon: List, action: "list", label: "List" },
                          {
                            icon: LinkIcon,
                            action: "link",
                            label: "Insert Link",
                          },
                          {
                            icon: ImageIcon,
                            action: "image",
                            label: "Insert Image",
                          },
                        ].map((tool) => (
                          <button
                            key={tool.action}
                            type="button"
                            onClick={() => insertMarkdown(tool.action)}
                            className="p-2 hover:bg-white rounded-md transition-colors text-stone-600 hover:text-stone-900"
                            title={tool.label}
                          >
                            <tool.icon className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      id="content-editor"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={20}
                      className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none font-mono text-sm leading-relaxed"
                      placeholder="Write your blog content here... Markdown formatting is supported"
                      required
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
                      <span>Supports Markdown formatting</span>
                      <span>{formData.content.length} characters</span>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Cover Image Upload */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4">
                      Cover Image
                    </h2>
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-amber-500 transition-colors">
                      {coverPreview ? (
                        <div className="relative">
                          <Image
                            src={coverPreview}
                            alt="Cover preview"
                            className="w-full h-48 object-cover rounded-lg"
                            width={400}
                            height={300}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImage(null);
                              setCoverPreview("");
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center py-8">
                          <Upload className="w-10 h-10 text-stone-400 mb-2" />
                          <span className="text-sm font-medium text-stone-600">
                            Click to upload cover image
                          </span>
                          <span className="text-xs text-stone-400 mt-1">
                            Recommended: 1200 x 630 pixels
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

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
                        className="flex-1 px-3 py-2.5 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                        placeholder="Add a tag and press Enter"
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
                      Publishing Status
                    </h2>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    <p className="text-xs text-stone-400 mt-2">
                      Drafts are only visible to you
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Publish Post"
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
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
