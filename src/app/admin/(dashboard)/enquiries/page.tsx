"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Mail, 
  Search, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Phone, 
  ExternalLink, 
  RefreshCw,
  Eye,
  X,
  MessageSquare,
  AlertCircle
} from "lucide-react";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: "General" | "Partner" | "Speaker" | "Bring to my city";
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ContactEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact-enquiries");
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load contact enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleToggleRead = async (enquiry: Enquiry) => {
    setActionLoadingId(enquiry._id);
    const newStatus = !enquiry.isRead;
    try {
      const res = await fetch(`/api/admin/contact-enquiries/${enquiry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((item) => (item._id === enquiry._id ? { ...item, isRead: newStatus } : item))
        );
        if (selectedEnquiry?._id === enquiry._id) {
          setSelectedEnquiry({ ...selectedEnquiry, isRead: newStatus });
        }
      }
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this enquiry?")) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/contact-enquiries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.filter((item) => item._id !== id));
        if (selectedEnquiry?._id === id) {
          setSelectedEnquiry(null);
        }
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert("Error deleting enquiry");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openDetails = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    // Automatically mark as read if unread
    if (!enquiry.isRead) {
      fetch(`/api/admin/contact-enquiries/${enquiry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      }).then((res) => {
        if (res.ok) {
          setEnquiries((prev) =>
            prev.map((item) => (item._id === enquiry._id ? { ...item, isRead: true } : item))
          );
        }
      });
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Status filter
      if (statusFilter === "unread" && item.isRead) return false;
      if (statusFilter === "read" && !item.isRead) return false;

      // Subject filter
      if (subjectFilter !== "all" && item.subject !== subjectFilter) return false;

      // Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesEmail = item.email?.toLowerCase().includes(q);
        const matchesPhone = item.phone?.toLowerCase().includes(q);
        const matchesSubject = item.subject?.toLowerCase().includes(q);
        const matchesMessage = item.message?.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesPhone || matchesSubject || matchesMessage;
      }

      return true;
    });
  }, [enquiries, statusFilter, subjectFilter, search]);

  const unreadCount = useMemo(() => {
    return enquiries.filter((item) => !item.isRead).length;
  }, [enquiries]);

  const getSubjectBadge = (subject: string) => {
    switch (subject) {
      case "Partner":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Speaker":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Bring to my city":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-sky-50 text-sky-700 border-sky-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-primary">Contact Enquiries</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, manage, and respond to inquiries submitted via the website contact form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm">
            <span>Total:</span>
            <strong className="text-primary">{enquiries.length}</strong>
            <span className="text-gray-300">|</span>
            <span className="text-amber-600 font-semibold">{unreadCount} Unread</span>
          </div>

          <button
            onClick={fetchEnquiries}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 shadow-sm transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-accent" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status & Subject Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  statusFilter === "all" ? "bg-white text-primary shadow-sm font-semibold" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All ({enquiries.length})
              </button>
              <button
                onClick={() => setStatusFilter("unread")}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  statusFilter === "unread" ? "bg-white text-amber-600 shadow-sm font-semibold" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setStatusFilter("read")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  statusFilter === "read" ? "bg-white text-primary shadow-sm font-semibold" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Read
              </button>
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="all">All Subjects</option>
              <option value="General">General Enquiry</option>
              <option value="Partner">Partner with us</option>
              <option value="Speaker">Become a speaker</option>
              <option value="Bring to my city">Bring to my city</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">Status</th>
                <th className="p-4">Sender Details</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Message Preview</th>
                <th className="p-4 whitespace-nowrap">Received Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredEnquiries.map((item) => (
                <tr
                  key={item._id}
                  className={`transition-colors hover:bg-gray-50/70 cursor-pointer ${
                    !item.isRead ? "bg-amber-50/20 font-medium" : ""
                  }`}
                  onClick={() => openDetails(item)}
                >
                  {/* Status Indicator */}
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleRead(item)}
                      title={item.isRead ? "Mark as unread" : "Mark as read"}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {item.isRead ? (
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                      ) : (
                        <span className="inline-block w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-sm" />
                      )}
                    </button>
                  </td>

                  {/* Sender Details */}
                  <td className="p-4">
                    <div className="font-semibold text-primary">{item.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span>{item.email}</span>
                    </div>
                    {item.phone && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{item.phone}</span>
                      </div>
                    )}
                  </td>

                  {/* Subject Badge */}
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs border font-medium ${getSubjectBadge(
                        item.subject
                      )}`}
                    >
                      {item.subject}
                    </span>
                  </td>

                  {/* Message Preview */}
                  <td className="p-4 max-w-xs md:max-w-md">
                    <p className="text-gray-600 line-clamp-2 text-xs leading-relaxed">
                      {item.message}
                    </p>
                  </td>

                  {/* Received Date */}
                  <td className="p-4 whitespace-nowrap text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openDetails(item)}
                        className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Full Message"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <a
                        href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(
                          item.subject
                        )} Enquiry - White Coat Club`}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Reply via Email"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={actionLoadingId === item._id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEnquiries.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif text-lg text-primary">No Enquiries Found</h3>
                      <p className="text-xs text-gray-500">
                        {search || statusFilter !== "all" || subjectFilter !== "all"
                          ? "Try clearing your filters or search terms."
                          : "When visitors submit the contact form on the website, their messages will appear here."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs border font-medium ${getSubjectBadge(
                      selectedEnquiry.subject
                    )}`}
                  >
                    {selectedEnquiry.subject}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(selectedEnquiry.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <h2 className="text-2xl font-serif text-primary">{selectedEnquiry.name}</h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Contact Information Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-gray-400 tracking-wider">Email</span>
                  <div className="text-sm text-primary font-medium flex items-center gap-2 mt-0.5">
                    <Mail className="w-4 h-4 text-accent" />
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="hover:underline text-primary"
                    >
                      {selectedEnquiry.email}
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-gray-400 tracking-wider">Phone</span>
                  <div className="text-sm text-primary font-medium flex items-center gap-2 mt-0.5">
                    <Phone className="w-4 h-4 text-accent" />
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="hover:underline text-primary"
                    >
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Message</h4>
                <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRead(selectedEnquiry)}
                  className="px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                >
                  {selectedEnquiry.isRead ? "Mark as Unread" : "Mark as Read"}
                </button>
                <button
                  onClick={() => handleDelete(selectedEnquiry._id)}
                  className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                >
                  Delete
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp
                </a>

                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(
                    selectedEnquiry.subject
                  )} Enquiry - White Coat Club`}
                  className="px-4 py-2 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
