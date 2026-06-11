// components/admin/AdminHeader.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function AdminHeader({
  sidebarOpen,
  onToggleSidebar,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-stone-200 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-stone-600" />
          </button>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm w-64 text-gray-900 placeholder-stone-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-stone-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-700 font-semibold text-sm">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-stone-900 leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-stone-500 capitalize leading-tight">
                  {user?.role}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-stone-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-20">
                  <div className="px-4 py-2 border-b border-stone-100 sm:hidden">
                    <p className="text-sm font-medium text-stone-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-stone-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
