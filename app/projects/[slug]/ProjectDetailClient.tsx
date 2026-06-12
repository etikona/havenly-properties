// app/projects/[slug]/ProjectDetailClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Share2,
  Printer,
} from "lucide-react";
import { useState } from "react";
import { Project } from "@/types";

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({
  project,
}: ProjectDetailClientProps) {
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.summary,
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

  const getCategoryBadge = () => {
    const colors = {
      ongoing: "bg-green-100 text-green-700",
      upcoming: "bg-blue-100 text-blue-700",
      completed: "bg-gray-100 text-gray-700",
    };
    return colors[project?.category] || colors.completed;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Link
          href="/projects"
          className="inline-flex items-center text-gray-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Projects
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-100 mb-12">
        <Image
          src={project.bannerImage || "/images/placeholder-project.jpg"}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 py-8 text-white">
          <div className="max-w-4xl">
            <div className="flex gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryBadge()}`}
              >
                {project.category.charAt(0).toUpperCase() +
                  project.category.slice(1)}
              </span>
              {project.isFeatured && (
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured Project
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-200">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  Completion:{" "}
                  {new Date(project.completionDate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long" },
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Project Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">{project.summary}</p>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Key Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className="text-gray-900 font-semibold capitalize">
                    {project.category}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="text-gray-900 font-semibold">
                    {project.location}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Expected Completion</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(project.completionDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long" },
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Project Details</p>
                  <p className="text-gray-900 font-semibold">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Features Section - You can enhance this based on actual API data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Premium Location",
                  "Modern Architecture",
                  "Quality Construction",
                  "Secure Investment",
                  "Excellent Amenities",
                  "Prime Connectivity",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-amber-600 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Interested in this project?
              </h3>
              <p className="text-gray-700 mb-4">
                Get detailed information, floor plans, and pricing.
              </p>
              <Link
                href="/contact"
                className="block w-full bg-amber-600 text-white text-center py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
              >
                Request Information
              </Link>
              <div className="mt-4 pt-4 border-t border-amber-200">
                <p className="text-sm text-gray-600 text-center">
                  Or call us directly: <br />
                  <a
                    href="tel:+8801764320172"
                    className="font-semibold text-amber-700"
                  >
                    +880 1700-000000
                  </a>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
          </div>
        </div>
      </section>
    </div>
  );
}
