"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Plus, Edit2, Trash2, Image as ImageIcon, GripVertical } from "lucide-react";

export default function FeaturesAdmin() {
  const [features, setFeatures] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    order: 0,
    isActive: true,
  });

  const fetchFeatures = async () => {
    const res = await fetch("/api/admin/features");
    const data = await res.json();
    if (data.success) setFeatures(data.data);
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleOpenModal = (feature: any = null) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        title: feature.title,
        description: feature.description,
        imageUrl: feature.imageUrl || "",
        order: feature.order ?? 0,
        isActive: feature.isActive ?? true,
      });
    } else {
      setEditingFeature(null);
      setFormData({ title: "", description: "", imageUrl: "", order: features.length, isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
      const result = await res.json();
      if (result.success) {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      } else {
        alert(result.error || "Upload failed");
      }
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingFeature
      ? `/api/admin/features/${editingFeature._id}`
      : "/api/admin/features";
    const method = editingFeature ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchFeatures();
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feature? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/features/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchFeatures();
      else alert(data.error || "Delete failed");
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-primary">Features Section</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the &quot;What Happens at WCC?&quot; cards shown on the landing page.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" /> Add Feature
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase">
                <th className="p-4 font-medium w-10">#</th>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Title &amp; Description</th>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {features.map((feature, idx) => (
                <tr key={feature._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400">
                    <GripVertical className="w-4 h-4" />
                  </td>
                  <td className="p-4">
                    {feature.imageUrl ? (
                      <img
                        src={feature.imageUrl}
                        alt={feature.title}
                        className="w-20 h-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="font-medium text-primary">{feature.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[260px]">{feature.description}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{feature.order}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feature.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {feature.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenModal(feature)}
                      className="text-blue-500 hover:text-blue-700 p-2 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(feature._id)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {features.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No features yet. Click &quot;Add Feature&quot; to create one.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-serif mb-6">
          {editingFeature ? "Edit Feature" : "Add Feature"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Image Upload */}
          <div>
            <Label className="mb-2 block">Feature Image</Label>
            <div className="flex items-start gap-4">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-28 h-20 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-28 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="text-sm"
                />
                {uploading && (
                  <p className="text-xs text-blue-500 mt-1 animate-pulse">Uploading image...</p>
                )}
                {formData.imageUrl && (
                  <p className="text-xs text-green-600 mt-1">✓ Image uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="feat-title">Title *</Label>
            <Input
              id="feat-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Financial Conversations"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="feat-desc">Description *</Label>
            <Textarea
              id="feat-desc"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description shown below the feature title..."
              rows={3}
              required
            />
          </div>

          {/* Order + isActive */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feat-order">Display Order</Label>
              <Input
                id="feat-order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                min={0}
              />
              <p className="text-xs text-gray-400">Lower = shown first</p>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="feat-active"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <Label htmlFor="feat-active">Visible on site</Label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : editingFeature ? "Save Changes" : "Add Feature"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
