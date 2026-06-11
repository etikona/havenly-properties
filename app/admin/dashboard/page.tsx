// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";
import { api } from "@/lib/api";
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  Calendar,
  Activity,
} from "lucide-react";

interface DashboardStats {
  totalProjects: number;
  activeLeads: number;
  totalBlogs: number;
  totalViews: number;
  recentActivities: Array<{
    type: string;
    action: string;
    time: string;
  }>;
  leadsGrowth: number;
  projectsGrowth: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeLeads: 0,
    totalBlogs: 0,
    totalViews: 0,
    recentActivities: [],
    leadsGrowth: 0,
    projectsGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [projectsRes, leadsRes, blogsRes] = await Promise.allSettled([
        api.get("project/admin/all"),
        api.get("lead"),
        api.get("blog/admin/all"),
      ]);

      let totalProjects = 0;
      let activeLeads = 0;
      let totalBlogs = 0;

      if (projectsRes.status === "fulfilled") {
        totalProjects =
          projectsRes.value?.data?.length ||
          projectsRes.value?.projects?.length ||
          0;
      }

      if (leadsRes.status === "fulfilled") {
        activeLeads =
          leadsRes.value?.data?.length || leadsRes.value?.leads?.length || 0;
      }

      if (blogsRes.status === "fulfilled") {
        totalBlogs =
          blogsRes.value?.data?.length || blogsRes.value?.blogs?.length || 0;
      }

      // For demo purposes, generate realistic recent activities
      const recentActivities = [
        {
          type: "project",
          action: "New project added to portfolio",
          time: "2 hours ago",
        },
        {
          type: "lead",
          action: "New lead inquiry received",
          time: "5 hours ago",
        },
        {
          type: "blog",
          action: "Blog post published successfully",
          time: "1 day ago",
        },
        {
          type: "lead",
          action: "Lead status updated to contacted",
          time: "2 days ago",
        },
        {
          type: "project",
          action: "Construction update added",
          time: "3 days ago",
        },
      ];

      setStats({
        totalProjects,
        activeLeads,
        totalBlogs,
        totalViews: 12453,
        recentActivities,
        leadsGrowth: 12,
        projectsGrowth: 8,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, growth, color }: any) => (
    <div className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {growth !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              growth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {growth >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-stone-900 mb-1">
          {loading ? (
            <div className="h-8 w-16 bg-stone-200 animate-pulse rounded" />
          ) : (
            value
          )}
        </p>
        <p className="text-sm text-stone-500">{title}</p>
      </div>
    </div>
  );

  const ActivityIcon = ({ type }: { type: string }) => {
    const icons = {
      project: Building2,
      lead: Users,
      blog: FileText,
    };
    const Icon = icons[type as keyof typeof icons] || Activity;
    const colors = {
      project: "bg-blue-100 text-blue-600",
      lead: "bg-green-100 text-green-600",
      blog: "bg-purple-100 text-purple-600",
    };

    return (
      <div
        className={`p-2 rounded-full ${colors[type as keyof typeof colors] || "bg-stone-100 text-stone-600"}`}
      >
        <Icon className="w-4 h-4" />
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
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
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-700 font-semibold">
                    {user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-stone-900">
                    Welcome back, {user?.name}
                  </h1>
                  <p className="text-sm text-stone-500">
                    Here's your portfolio overview for today
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={Building2}
                growth={stats.projectsGrowth}
                color="bg-blue-50 text-blue-600"
              />
              <StatCard
                title="Active Leads"
                value={stats.activeLeads}
                icon={Users}
                growth={stats.leadsGrowth}
                color="bg-green-50 text-green-600"
              />
              <StatCard
                title="Blog Posts"
                value={stats.totalBlogs}
                icon={FileText}
                color="bg-purple-50 text-purple-600"
              />
              <StatCard
                title="Total Views"
                value={stats.totalViews.toLocaleString()}
                icon={Eye}
                growth={15}
                color="bg-amber-50 text-amber-600"
              />
            </div>

            {/* Charts & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Quick Stats Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-stone-900">
                    Performance Overview
                  </h2>
                  <select className="text-sm border text-gray-900 border-stone-300 rounded-lg px-3 py-1.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                </div>

                {/* Simple Bar Chart using divs */}
                <div className="space-y-4">
                  {[
                    {
                      label: "Projects",
                      value: stats.totalProjects,
                      max: 20,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Leads",
                      value: stats.activeLeads,
                      max: 100,
                      color: "bg-green-500",
                    },
                    {
                      label: "Blog Posts",
                      value: stats.totalBlogs,
                      max: 50,
                      color: "bg-purple-500",
                    },
                    {
                      label: "Page Views",
                      value: 85,
                      max: 100,
                      color: "bg-amber-500",
                    },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-600">{item.label}</span>
                        <span className="text-stone-900 font-medium">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{
                            width: `${Math.min((item.value / item.max) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {stats.recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
                    >
                      <ActivityIcon type={activity.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-900 truncate">
                          {activity.action}
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Add New Project",
                  description: "Create a new property listing",
                  href: "/admin/dashboard/projects/create",
                  icon: Building2,
                  color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
                },
                {
                  title: "View Leads",
                  description: "Check and manage inquiries",
                  href: "/admin/dashboard/leads",
                  icon: Users,
                  color: "bg-green-50 text-green-600 hover:bg-green-100",
                },
                {
                  title: "Write Blog Post",
                  description: "Create engaging content",
                  href: "/admin/dashboard/blogs/create",
                  icon: FileText,
                  color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
                },
              ].map((action) => (
                <a
                  key={action.title}
                  href={action.href}
                  className={`${action.color} rounded-xl p-6 transition-all duration-300 hover:shadow-md group cursor-pointer`}
                >
                  <action.icon className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-stone-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-stone-600">{action.description}</p>
                </a>
              ))}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
