// app/admin/dashboard/leads/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";
import { api } from "@/lib/api";
import {
  Search,
  Eye,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  MoreVertical,
} from "lucide-react";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyInterest?: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get("lead");
      const leadsData = response?.data || response?.leads || [];
      setLeads(leadsData);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`lead/${id}`);
      setLeads(leads.filter((lead) => lead._id !== id));
      if (selectedLead?._id === id) {
        setSelectedLead(null);
      }
      setDeleteModal(null);
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.put(`lead/${id}`, { status: newStatus });
      setLeads(
        leads.map((lead) =>
          lead._id === id ? { ...lead, status: newStatus } : lead,
        ),
      );
      if (selectedLead?._id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("lead/mark-all-read", {});
      setLeads(leads.map((lead) => ({ ...lead, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("lead/export");
      // Handle CSV export based on your backend response
      if (response?.data) {
        const csvContent = response.data;
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-export-${new Date().toISOString()}.csv`;
        a.click();
      }
    } catch (error) {
      console.error("Failed to export leads:", error);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || lead.status === filterStatus;
    const matchesRead = filterStatus === "unread" ? !lead.isRead : true;
    return matchesSearch && matchesStatus && matchesRead;
  });

  const getStatusIcon = (status: string) => {
    const icons = {
      new: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
      contacted: { icon: Phone, color: "text-amber-600", bg: "bg-amber-50" },
      qualified: {
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-50",
      },
      closed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    };
    return icons[status as keyof typeof icons] || icons.new;
  };

  const unreadCount = leads.filter((l) => !l.isRead).length;

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
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-stone-900">Leads</h1>
                  {unreadCount > 0 && (
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-500 mt-1">
                  Manage and track your customer inquiries
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Mark All Read
                </button>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Total Leads",
                  value: leads.length,
                  color: "bg-stone-900",
                },
                {
                  label: "New",
                  value: leads.filter((l) => l.status === "new").length,
                  color: "bg-blue-600",
                },
                {
                  label: "Contacted",
                  value: leads.filter((l) => l.status === "contacted").length,
                  color: "bg-amber-600",
                },
                {
                  label: "Qualified",
                  value: leads.filter((l) => l.status === "qualified").length,
                  color: "bg-green-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl border border-stone-200 p-4"
                >
                  <div className={`w-2 h-2 ${stat.color} rounded-full mb-2`} />
                  <p className="text-2xl font-bold text-stone-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-stone-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search leads by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                  <option value="unread">Unread</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              {loading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-10 h-10 bg-stone-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-stone-200 rounded w-1/4" />
                        <div className="h-4 bg-stone-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50">
                        <th className="text-left p-4 text-sm font-medium text-stone-600">
                          Lead
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-stone-600">
                          Contact
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-stone-600">
                          Property Interest
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-stone-600">
                          Status
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-stone-600">
                          Date
                        </th>
                        <th className="text-right p-4 text-sm font-medium text-stone-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => {
                        const statusStyle = getStatusIcon(lead.status);
                        const StatusIcon = statusStyle.icon;

                        return (
                          <tr
                            key={lead._id}
                            className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${
                              !lead.isRead ? "bg-amber-50/30" : ""
                            }`}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-stone-600">
                                    {lead.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-stone-900">
                                    {lead.name}
                                    {!lead.isRead && (
                                      <span className="ml-2 inline-block w-2 h-2 bg-amber-500 rounded-full" />
                                    )}
                                  </p>
                                  <p className="text-xs text-stone-500 truncate max-w-[200px]">
                                    {lead.message}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-sm text-stone-600">
                                  <Mail className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[150px]">
                                    {lead.email}
                                  </span>
                                </div>
                                {lead.phone && (
                                  <div className="flex items-center gap-1.5 text-sm text-stone-600">
                                    <Phone className="w-3.5 h-3.5" />
                                    {lead.phone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 text-sm text-stone-600">
                                <Building className="w-3.5 h-3.5" />
                                {lead.propertyInterest || "N/A"}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`p-1.5 rounded ${statusStyle.bg}`}
                                >
                                  <StatusIcon
                                    className={`w-3.5 h-3.5 ${statusStyle.color}`}
                                  />
                                </div>
                                <select
                                  value={lead.status}
                                  onChange={(e) =>
                                    handleStatusChange(lead._id, e.target.value)
                                  }
                                  className="text-sm border border-stone-200 rounded px-2 py-1 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none capitalize"
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="qualified">Qualified</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-stone-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedLead(lead)}
                                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-600 hover:text-stone-900"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteModal(lead._id)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-stone-600 hover:text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && filteredLeads.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500">No leads found</p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    Lead Details
                  </h3>
                  <p className="text-sm text-stone-500">
                    Submitted on{" "}
                    {new Date(selectedLead.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-stone-600" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-500 mb-1">
                      Name
                    </label>
                    <p className="text-stone-900 font-medium">
                      {selectedLead.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-500 mb-1">
                      Status
                    </label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) =>
                        handleStatusChange(selectedLead._id, e.target.value)
                      }
                      className="text-sm border border-stone-300 rounded-lg px-3 py-1.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-500 mb-1">
                      Email
                    </label>
                    <p className="text-stone-900">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-500 mb-1">
                      Phone
                    </label>
                    <p className="text-stone-900">
                      {selectedLead.phone || "Not provided"}
                    </p>
                  </div>
                  {selectedLead.propertyInterest && (
                    <div>
                      <label className="block text-sm font-medium text-stone-500 mb-1">
                        Property Interest
                      </label>
                      <p className="text-stone-900">
                        {selectedLead.propertyInterest}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-500 mb-2">
                    Message
                  </label>
                  <div className="bg-stone-50 rounded-lg p-4">
                    <p className="text-stone-700 whitespace-pre-wrap">
                      {selectedLead.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-stone-200 flex justify-between">
                <button
                  onClick={() => setDeleteModal(selectedLead._id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete Lead
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 text-sm font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
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
                    Delete Lead
                  </h3>
                  <p className="text-sm text-stone-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-stone-600 mb-6">
                Are you sure you want to permanently delete this lead? All
                information will be lost.
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
