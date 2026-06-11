// app/blog/[slug]/BlogDetailClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Tag,
  Clock,
  ArrowLeft,
  Share2,
  Printer,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { BlogPost } from "@/types";

interface BlogDetailClientProps {
  post: BlogPost;
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const [liked, setLiked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] mb-12">
        <Image
          src={post.coverImage || "/images/placeholder-blog.jpg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 py-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-amber-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-gray-200">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>
                  {Math.ceil((post.excerpt?.length || 500) / 500)} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                {/* This is where the full blog content would go */}
                <div className="space-y-4 text-gray-700">
                  <p>
                    {post.title} - This is a comprehensive guide to help you
                    make informed decisions about your real estate journey. We
                    have gathered insights from industry experts and market
                    analysis to provide you with the most valuable information.
                  </p>
                  <p>
                    Whether you are a first-time homebuyer or an experienced
                    investor, understanding the current market trends and
                    property evaluation criteria is crucial for making the right
                    investment decisions.
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    Key Takeaways
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Understanding property values in prime locations</li>
                    <li>Important factors to consider before purchasing</li>
                    <li>Legal documentation and verification process</li>
                    <li>Financing options and mortgage planning</li>
                  </ul>
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    Expert Insights
                  </h2>
                  <p>
                    Our team of real estate experts has analyzed the latest
                    market data to bring you actionable insights. From emerging
                    neighborhoods to investment hotspots, we cover everything
                    you need to know.
                  </p>
                </div>
              </div>

              {/* Tags Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-700">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-amber-100 hover:text-amber-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            {/* Author Bio */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Written by {post.author}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Real estate expert with years of experience in the
                    Bangladesh property market.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}

            {/* Related Posts would go here - you can implement this using the same API */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Related Articles
              </h3>
              <p className="text-gray-500 text-sm">
                Check back soon for more articles on this topic.
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">
                Subscribe to our Newsletter
              </h3>
              <p className="text-sm text-amber-100 mb-4">
                Get the latest real estate insights delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500"
                />
                <button className="w-full bg-white text-amber-700 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
