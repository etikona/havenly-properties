// app/admin/dashboard/projects/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Save,
  Loader2,
  AlertCircle,
  Building2,
  MapPin,
  DollarSign,
  Ruler,
  Bed,
  Bath,
} from "lucide-react";

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  price: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  features: string[];
  coverImage?: string;
  images?: string[];
}

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState<ProjectData>({
    _id: "",
    title: "",
    description: "",
    category: "ongoing",
    status: "ongoing",
    location: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    features: [""],
    coverImage: "",
    images: [],
  });

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setFetching(true);
      const response = await api.get(`project/${projectId}`);
      const project = response?.data || response?.project;

      if (project) {
        setFormData({
          ...project,
          features: project.features?.length ? project.features : [""],
          bedrooms: project.bedrooms?.toString() || "",
          bathrooms: project.bathrooms?.toString() || "",
          area: project.area?.toString() || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
      setError("Failed to load project details");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Prepare data as JSON (not FormData)
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        location: formData.location,
        price: formData.price,
        area: formData.area,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        features: formData.features.filter((f) => f.trim() !== ""),
      };

      await api.put(`project/${projectId}`, projectData);

      setSuccessMessage("Project updated successfully!");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/dashboard/projects");
      }, 1500);
    } catch (error: any) {
      console.error("Failed to update project:", error);
      setError(error.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                <p className="text-stone-500">Loading project details...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                onClick={() => router.push("/admin/dashboard/projects")}
                className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Projects</span>
              </button>
              <h1 className="text-2xl font-bold text-stone-900">
                Edit Project
              </h1>
              <p className="text-stone-500 mt-1 text-sm">
                Update project details and information
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
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-600" />
                      Basic Information
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                          placeholder="Enter project title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={6}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900 resize-none"
                          placeholder="Enter project description"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-amber-600" />
                      Property Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-stone-400" />
                            Price
                          </span>
                        </label>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                          placeholder="e.g., 500,000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          <span className="flex items-center gap-1.5">
                            <Ruler className="w-4 h-4 text-stone-400" />
                            Area (sq ft)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                          placeholder="e.g., 2500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          <span className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-stone-400" />
                            Bedrooms
                          </span>
                        </label>
                        <input
                          type="number"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                          placeholder="Number of bedrooms"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          <span className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-stone-400" />
                            Bathrooms
                          </span>
                        </label>
                        <input
                          type="number"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                          placeholder="Number of bathrooms"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-stone-900">
                        Features & Amenities
                      </h2>
                      <button
                        type="button"
                        onClick={addFeature}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) =>
                              handleFeatureChange(index, e.target.value)
                            }
                            className="flex-1 px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                            placeholder="e.g., Swimming Pool, Gym, Security"
                          />
                          {formData.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="p-3 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar - Right Side */}
                <div className="space-y-6">
                  {/* Current Cover Image */}
                  {formData.coverImage && (
                    <div className="bg-white rounded-xl border border-stone-200 p-6">
                      <h2 className="text-lg font-semibold text-stone-900 mb-4">
                        Cover Image
                      </h2>
                      <img
                        src={formData.coverImage}
                        alt={formData.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <p className="text-xs text-stone-400 mt-2">
                        Current cover image. Use image upload section to change.
                      </p>
                    </div>
                  )}

                  {/* Settings */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4">
                      Settings
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                        >
                          <option value="ongoing">Ongoing</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                        >
                          <option value="ongoing">Ongoing</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-stone-400" />
                            Location <span className="text-red-500">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-stone-900"
                          placeholder="e.g., Dhaka, Bangladesh"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Project
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push("/admin/dashboard/projects")}
                      className="w-full px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-xl transition-colors border border-stone-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
