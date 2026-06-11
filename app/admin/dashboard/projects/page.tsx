// app/admin/dashboard/projects/page.tsx
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
  Building2,
  MapPin,
  Calendar,
  AlertCircle,
  X,
  DollarSign,
  Ruler,
  Bed,
  Bath,
  List,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  image: string;
  coverImage: string;
  images: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("project/admin/all");
      setProjects(response?.data || response?.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`project/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      setDeleteModal(null);
      if (viewProject?._id === id) {
        setViewProject(null);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleViewProject = (project: Project) => {
    setViewProject(project);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      ongoing: "bg-blue-100 text-blue-700",
      upcoming: "bg-amber-100 text-amber-700",
      completed: "bg-green-100 text-green-700",
    };
    return (
      colors[status as keyof typeof colors] || "bg-stone-100 text-stone-700"
    );
  };

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
                <h1 className="text-2xl font-bold text-stone-900">Projects</h1>
                <p className="text-sm text-stone-500 mt-1">
                  Manage your property listings
                </p>
              </div>
              <button
                onClick={() => router.push("/admin/dashboard/projects/create")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Project
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm text-gray-900"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm text-gray-900"
                >
                  <option value="all">All Status</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Projects Table */}
            {loading ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-20 h-20 bg-stone-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-stone-200 rounded w-3/4" />
                        <div className="h-4 bg-stone-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50">
                        <th className="text-left p-4 text-sm font-semibold text-stone-700">
                          Project
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-stone-700">
                          Category
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-stone-700">
                          Status
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-stone-700">
                          Location
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-stone-700">
                          Price
                        </th>
                        <th className="text-right p-4 text-sm font-semibold text-stone-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr
                          key={project._id}
                          className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {project.image || project.coverImage ? (
                                  <Image
                                    src={project.image || project.coverImage}
                                    alt={project.title}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Building2 className="w-6 h-6 text-stone-400" />
                                )}
                              </div>
                              <span className="font-medium text-stone-900 text-sm">
                                {project.title}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-stone-700 font-medium capitalize">
                              {project.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-sm text-stone-700">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              {project.location}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-medium text-stone-900">
                              {project.price || "N/A"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleViewProject(project)}
                                className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-600 hover:text-stone-900"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/dashboard/projects/${project._id}/edit`,
                                  )
                                }
                                className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-stone-600 hover:text-amber-600"
                                title="Edit Project"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteModal(project._id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-stone-600 hover:text-red-600"
                                title="Delete Project"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-16">
                    <Building2 className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-600 font-medium text-lg mb-1">
                      No projects found
                    </p>
                    <p className="text-stone-400 text-sm mb-4">
                      {searchTerm || filterStatus !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by creating your first project"}
                    </p>
                    {!searchTerm && filterStatus === "all" && (
                      <button
                        onClick={() =>
                          router.push("/admin/dashboard/projects/create")
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Create Project
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Project Detail Modal */}
        {viewProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white rounded-t-2xl border-b border-stone-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Project Details
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    Viewing project information
                  </p>
                </div>
                <button
                  onClick={() => setViewProject(null)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Cover Image */}
                {(viewProject.coverImage || viewProject.image) && (
                  <div className="relative h-72 rounded-xl overflow-hidden">
                    <Image
                      src={viewProject.coverImage || viewProject.image}
                      alt={viewProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Title & Status */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">
                      {viewProject.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{viewProject.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(viewProject.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(viewProject.status)}`}
                    >
                      {viewProject.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-purple-100 text-purple-700">
                      {viewProject.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Description
                  </label>
                  <p className="text-stone-600 text-sm leading-relaxed bg-stone-50 rounded-lg p-4">
                    {viewProject.description || "No description available"}
                  </p>
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {viewProject.price && (
                    <div className="bg-stone-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-amber-600" />
                        <span className="text-xs text-stone-500">Price</span>
                      </div>
                      <p className="text-lg font-semibold text-stone-900">
                        {viewProject.price}
                      </p>
                    </div>
                  )}
                  {viewProject.area && (
                    <div className="bg-stone-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Ruler className="w-4 h-4 text-amber-600" />
                        <span className="text-xs text-stone-500">Area</span>
                      </div>
                      <p className="text-lg font-semibold text-stone-900">
                        {viewProject.area} sq ft
                      </p>
                    </div>
                  )}
                  {viewProject.bedrooms !== undefined &&
                    viewProject.bedrooms > 0 && (
                      <div className="bg-stone-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Bed className="w-4 h-4 text-amber-600" />
                          <span className="text-xs text-stone-500">
                            Bedrooms
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">
                          {viewProject.bedrooms}
                        </p>
                      </div>
                    )}
                  {viewProject.bathrooms !== undefined &&
                    viewProject.bathrooms > 0 && (
                      <div className="bg-stone-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Bath className="w-4 h-4 text-amber-600" />
                          <span className="text-xs text-stone-500">
                            Bathrooms
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-stone-900">
                          {viewProject.bathrooms}
                        </p>
                      </div>
                    )}
                </div>

                {/* Features */}
                {viewProject.features && viewProject.features.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Features & Amenities
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {viewProject.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-stone-600"
                        >
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images Gallery */}
                {viewProject.images && viewProject.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Project Images ({viewProject.images.length})
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {viewProject.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative h-24 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`Project image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">
                      Created At
                    </label>
                    <p className="text-sm text-stone-700">
                      {formatDateTime(viewProject.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">
                      Last Updated
                    </label>
                    <p className="text-sm text-stone-700">
                      {formatDateTime(viewProject.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-stone-200 p-6 flex justify-between">
                <button
                  onClick={() => {
                    setViewProject(null);
                    setDeleteModal(viewProject._id);
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete Project
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setViewProject(null)}
                    className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setViewProject(null);
                      router.push(
                        `/admin/dashboard/projects/${viewProject._id}/edit`,
                      );
                    }}
                    className="px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    Edit Project
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
                    Delete Project
                  </h3>
                  <p className="text-sm text-stone-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-stone-600 mb-6">
                Are you sure you want to delete this project? All associated
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
