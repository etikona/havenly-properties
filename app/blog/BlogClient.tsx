// app/blog/BlogClient.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Clock,
  ChevronRight,
} from "lucide-react";
import { BlogPost } from "@/types";

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialTags: string[];
}

export default function BlogClient({
  initialPosts,
  initialTags,
}: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "views" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const categories = useMemo(() => {
    const cats = new Set(initialPosts.map((post) => post.category));
    return Array.from(cats);
  }, [initialPosts]);

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = initialPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === "" || post.tags.includes(selectedTag);
      const matchesCategory =
        selectedCategory === "" || post.category === selectedCategory;
      return matchesSearch && matchesTag && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else if (sortBy === "views") {
        return sortOrder === "desc" ? b.views - a.views : a.views - b.views;
      } else {
        return sortOrder === "desc"
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [
    initialPosts,
    searchTerm,
    selectedTag,
    selectedCategory,
    sortBy,
    sortOrder,
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-amber-900 text-white py-20">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Real Estate Blog
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Expert insights, market trends, and property buying guides
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Categories
              </h3>
              <div className="space-y-2 mb-6">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === "" ? "bg-amber-50 text-amber-700 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat ? "bg-amber-50 text-amber-700 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedTag("")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === "" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  All
                </button>
                {initialTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === tag ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">Sort By</h3>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split("-");
                  setSortBy(newSortBy as "date" | "views" | "title");
                  setSortOrder(newSortOrder as "asc" | "desc");
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="views-desc">Most Popular</option>
                <option value="views-asc">Least Popular</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {filteredAndSortedPosts.length}
                </span>{" "}
                articles
              </p>
            </div>

            {filteredAndSortedPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 text-lg">
                  No articles found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredAndSortedPosts.map((post) => (
                  <article
                    key={post._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                  >
                    <Link href={`/blog/${post.slug}`} className="block md:flex">
                      <div className="relative md:w-80 h-56 md:h-auto overflow-hidden">
                        <Image
                          src={
                            post.coverImage || "/images/placeholder-blog.jpg"
                          }
                          alt={post.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.author}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {Math.ceil(post.excerpt.length / 500)} min read
                          </span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center text-amber-600 font-semibold">
                          Read More
                          <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
