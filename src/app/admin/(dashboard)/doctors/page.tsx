"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";

export default function DoctorsAdmin() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", slug: "", photoUrl: "", specialization: "", qualifications: "",
    hospital: "", city: "", state: "", experienceYears: 0, bio: "",
    email: "", phone: "", socialLinks: { linkedin: "" }, focalPoint: { x: 50, y: 15 }, isPublished: false
  });

  const fetchDoctors = async () => {
    const res = await fetch("/api/admin/doctors");
    const data = await res.json();
    if (data.success) setDoctors(data.data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenModal = (doc: any = null) => {
    if (doc) {
      setEditingDoctor(doc);
      setFormData({
        ...doc,
        experienceYears: doc.experienceYears || 0,
        socialLinks: doc.socialLinks || { linkedin: "" },
        focalPoint: doc.focalPoint || { x: 50, y: 15 }
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: "", slug: "", photoUrl: "", specialization: "", qualifications: "",
        hospital: "", city: "", state: "", experienceYears: 0, bio: "",
        email: "", phone: "", socialLinks: { linkedin: "" }, focalPoint: { x: 50, y: 15 }, isPublished: false
      });
    }
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData((prev) => {
      const isAutoSlug = !editingDoctor && (!prev.slug || prev.slug === prev.name.toLowerCase().replace(/^dr\.?\s*/i, '').trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
      const autoSlug = newName.toLowerCase().replace(/^dr\.?\s*/i, '').trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return {
        ...prev,
        name: newName,
        slug: isAutoSlug ? autoSlug : prev.slug,
      };
    });
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
        setFormData((prev) => ({
          ...prev,
          photoUrl: result.url,
          focalPoint: result.focalPoint || { x: 50, y: 15 },
        }));
      }
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Doctor name is required");
      return;
    }

    setLoading(true);

    const url = editingDoctor ? `/api/admin/doctors/${editingDoctor._id}` : "/api/admin/doctors";
    const method = editingDoctor ? "PUT" : "POST";

    const finalSlug = formData.slug?.trim() || formData.name.toLowerCase().replace(/^dr\.?\s*/i, '').trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `doctor-${Date.now()}`;
    const payload = {
      ...formData,
      slug: finalSlug,
      experienceYears: Number(formData.experienceYears) || 0,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchDoctors();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor profile?")) return;
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, { method: "DELETE" });
      if (res.ok) fetchDoctors();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif text-primary">Doctor Directory</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" /> Add Doctor
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase">
                <th className="p-4 font-medium">Photo</th>
                <th className="p-4 font-medium">Doctor</th>
                <th className="p-4 font-medium">Specialization</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {doc.photoUrl ? (
                      <img src={doc.photoUrl} alt={doc.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-primary">Dr. {doc.name}</div>
                    <div className="text-xs text-gray-400">/{doc.slug}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{doc.specialization || "—"}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {doc.city || doc.state ? [doc.city, doc.state].filter(Boolean).join(", ") : "—"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {doc.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenModal(doc)} className="text-blue-500 hover:text-blue-700 p-2"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(doc._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No doctors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-3xl">
        <h2 className="text-2xl font-serif mb-6">{editingDoctor ? "Edit Doctor" : "Add Doctor"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4 space-y-3">
            <div className="flex items-center gap-4">
              {formData.photoUrl ? (
                <div className="w-20 h-24 rounded-lg overflow-hidden border border-gray-300 shadow-sm relative shrink-0 bg-gray-100">
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    style={{
                      objectPosition: `${formData.focalPoint?.x ?? 50}% ${formData.focalPoint?.y ?? 15}%`
                    }}
                    className="w-full h-full object-cover transition-[object-position] duration-200"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5">Card Preview</span>
                </div>
              ) : (
                <div className="w-20 h-24 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 shrink-0">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">No Photo</span>
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="photo" className="block mb-1 text-sm font-medium">Profile Photo (Automatic Face Focus)</Label>
                <p className="text-xs text-gray-500 mb-2">Photo upload hote hi system automatically face detect karke perfect framing set kar dega.</p>
                <Input id="photo" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </div>
            </div>

            {formData.photoUrl && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                  <span className="font-medium">Card Vertical Framing (Focus):</span>
                  <span className="text-primary font-semibold">
                    {(formData.focalPoint?.y ?? 15) <= 5 ? "Top of photo (0%)" : (formData.focalPoint?.y ?? 15) <= 15 ? "Near-top (10%)" : (formData.focalPoint?.y ?? 15) <= 25 ? "Standard (20%)" : "Middle / Headroom (30%)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">Top Face</span>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    step="1"
                    value={formData.focalPoint?.y ?? 15}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        focalPoint: { x: prev.focalPoint?.x ?? 50, y: val }
                      }));
                    }}
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-[11px] text-gray-400">Headroom</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, focalPoint: { x: 50, y: 0 } }))}
                    className={`text-[11px] px-2.5 py-1 rounded-md border ${(formData.focalPoint?.y ?? 15) === 0 ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    Top (Face at very top)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, focalPoint: { x: 50, y: 12 } }))}
                    className={`text-[11px] px-2.5 py-1 rounded-md border ${(formData.focalPoint?.y ?? 15) === 12 ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    Standard (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, focalPoint: { x: 50, y: 28 } }))}
                    className={`text-[11px] px-2.5 py-1 rounded-md border ${(formData.focalPoint?.y ?? 15) === 28 ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    Middle (High Headroom)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="name">Full Name (without Dr.) <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleNameChange} 
                placeholder="e.g. Ramesh Kumar"
                required 
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="slug">Slug (Auto-generated if empty)</Label>
              <Input 
                id="slug" 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})} 
                placeholder="e.g. ramesh-kumar"
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="specialization">Specialization (Optional)</Label>
              <Input 
                id="specialization" 
                value={formData.specialization} 
                onChange={e => setFormData({...formData, specialization: e.target.value})} 
                placeholder="e.g. Cardiologist"
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="qualifications">Qualifications (Optional)</Label>
              <Input 
                id="qualifications" 
                value={formData.qualifications} 
                onChange={e => setFormData({...formData, qualifications: e.target.value})} 
                placeholder="e.g. MBBS, MD"
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="hospital">Hospital / Clinic (Optional)</Label>
              <Input 
                id="hospital" 
                value={formData.hospital} 
                onChange={e => setFormData({...formData, hospital: e.target.value})} 
                placeholder="e.g. Fortis Hospital"
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="experienceYears">Experience in Years (Optional)</Label>
              <Input 
                id="experienceYears" 
                type="number" 
                min="0"
                value={formData.experienceYears === 0 && !editingDoctor ? "" : formData.experienceYears} 
                onChange={e => setFormData({...formData, experienceYears: e.target.value === "" ? 0 : Number(e.target.value)})} 
                placeholder="0"
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="city">City (Optional)</Label>
              <Input 
                id="city" 
                value={formData.city} 
                onChange={e => setFormData({...formData, city: e.target.value})} 
                placeholder="e.g. New Delhi"
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="state">State (Optional)</Label>
              <Input 
                id="state" 
                value={formData.state} 
                onChange={e => setFormData({...formData, state: e.target.value})} 
                placeholder="e.g. Delhi"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea 
                id="bio" 
                rows={3} 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                placeholder="Brief profile summary (optional)..."
              />
            </div>
            
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                placeholder="doctor@example.com"
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
              <Input 
                id="linkedin" 
                value={formData.socialLinks.linkedin} 
                onChange={e => setFormData({...formData, socialLinks: { linkedin: e.target.value }})} 
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="flex items-center gap-2 mt-4 col-span-2">
              <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-4 h-4 cursor-pointer" />
              <Label htmlFor="isPublished" className="cursor-pointer">Publish to Public Directory</Label>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-2 border-t mt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : "Save Doctor"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
