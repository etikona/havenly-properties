// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/dashboard/projects", icon: Building2 },
  { label: "Blog Posts", href: "/admin/dashboard/blogs", icon: FileText },
  { label: "Leads", href: "/admin/dashboard/leads", icon: Users },
  { label: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`absolute top-0 left-0 h-full bg-white border-r border-stone-200 z-50 transition-all duration-300 flex flex-col ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-20 -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & Close Button */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            {isOpen && (
              <span className="font-bold text-lg text-stone-900">Admin</span>
            )}
          </Link>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Navigation - Scrollable area */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                pathname === link.href
                  ? "bg-amber-50 text-amber-700"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {isOpen && (
                <span className="text-sm font-medium">{link.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout - Fixed at bottom */}
        <div className="p-4 border-t border-stone-200 shrink-0">
          {isOpen && user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-stone-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-stone-500 capitalize">{user.role}</p>
            </div>
          )}
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
