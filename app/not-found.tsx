// app/not-found-enhanced.tsx (optional - if you want more interactivity)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Search, Building2, Phone, Compass } from "lucide-react";

export default function NotFoundEnhanced() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 overflow-hidden relative">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(245, 158, 11, 0.15), transparent 50%)`,
        }}
      />

      <div className="relative container mx-auto px-6 min-h-screen flex items-center justify-center py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Interactive 404 Card */}
          <div
            className="relative mb-8 transform transition-all duration-500"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className={`relative inline-block transition-all duration-500 ${isHovering ? "scale-105" : "scale-100"}`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-amber-600 rounded-2xl blur-2xl opacity-30 animate-pulse" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
                <div className="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter">
                  <span className="bg-linear-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                    4
                  </span>
                  <span className="relative inline-block mx-2">
                    <span className="bg-linear-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                      0
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Compass
                        className={`w-12 h-12 md:w-16 md:h-16 text-amber-500 transition-all duration-500 ${isHovering ? "rotate-12 scale-110" : "rotate-0"}`}
                      />
                    </div>
                  </span>
                  <span className="bg-linear-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                    4
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
                  Page Not Found
                </h2>
                <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-amber-600 mx-auto my-4 rounded-full" />
                <p className="text-gray-600 max-w-sm mx-auto">
                  The property page you are looking for seems to have been sold
                  or relocated.
                </p>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <div className="max-w-md mx-auto mb-8">
            <form action="/projects" method="GET" className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search for properties, locations..."
                className="w-full px-5 py-3 pl-12 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700 transition-colors"
              >
                Go
              </button>
            </form>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
            {[
              {
                label: "Home",
                href: "/",
                icon: Home,
                color: "bg-gray-50 hover:bg-amber-50",
              },
              {
                label: "Projects",
                href: "/projects",
                icon: Building2,
                color: "bg-gray-50 hover:bg-amber-50",
              },
              {
                label: "Blog",
                href: "/blog",
                icon: Search,
                color: "bg-gray-50 hover:bg-amber-50",
              },
              {
                label: "Contact",
                href: "/contact",
                icon: Phone,
                color: "bg-gray-50 hover:bg-amber-50",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 ${item.color} rounded-lg border border-gray-200 text-gray-700 hover:border-amber-300 hover:text-amber-600 transition-all group`}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Help Text */}
          <div className="text-sm text-gray-500">
            <p>
              Or call our support team at{" "}
              <a
                href="tel:+8801700000000"
                className="text-amber-600 font-semibold hover:text-amber-700"
              >
                +880 1700-000000
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
    </div>
  );
}
