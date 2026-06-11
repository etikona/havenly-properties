// app/admin/dashboard/projects/create/page.tsx
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
  Loader2,
  AlertCircle,
  Building2,
  MapPin,
  DollarSign,
  Ruler,
  Bed,
  Bath,
} from "lucide-react";
import Image from "next/image";

export default function CreateProject() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Prepare JSON data
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        status: formData.status,
        location: formData.location.trim(),
        price: formData.price.trim(),
        area: formData.area.trim(),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        features: formData.features.filter((f) => f.trim() !== ""),
      };

      console.log("Creating project with data:", projectData);

      // Send as JSON
      const response = await api.post("project", projectData);
      console.log("Project created successfully:", response);

      // If there's a cover image, upload it separately if needed
      // Note: If your backend supports direct image upload with project creation,
      // you might need to adjust this based on your API structure

      setSuccessMessage("Project created successfully!");

      setTimeout(() => {
        router.push("/admin/dashboard/projects");
      }, 1500);
    } catch (error: any) {
      console.error("Failed to create project:", error);
      setError(error.message || "Failed to create project. Please try again.");
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
                onClick={() => router.push("/admin/dashboard/projects")}
                className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Projects</span>
              </button>
              <h1 className="text-2xl font-bold text-stone-900">
                Create New Project
              </h1>
              <p className="text-stone-500 mt-1 text-sm">
                Add a new property listing to your portfolio
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

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info */}
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
                          placeholder="Enter detailed project description"
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                          placeholder="Number of bedrooms"
                          min="0"
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                          placeholder="Number of bathrooms"
                          min="0"
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
                            className="flex-1 px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
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
                            Click to upload image
                          </span>
                          <span className="text-xs text-stone-400 mt-1">
                            SVG, PNG, JPG or GIF (max. 5MB)
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
                    {coverImage && (
                      <p className="text-xs text-stone-400 mt-2">
                        Image will be uploaded after project creation
                      </p>
                    )}
                  </div>

                  {/* Settings */}
                  <div className="bg-white rounded-xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4">
                      Project Settings
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
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
                          className="w-full px-4 py-3 text-gray-900 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                          placeholder="e.g., Dhaka, Bangladesh"
                          required
                        />
                      </div>
                    </div>
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
                        Creating Project...
                      </>
                    ) : (
                      "Create Project"
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
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
