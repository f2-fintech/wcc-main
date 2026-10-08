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
    email: "", phone: "", socialLinks: { linkedin: "" }, isPublished: false
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
        socialLinks: doc.socialLinks || { linkedin: "" }
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: "", slug: "", photoUrl: "", specialization: "", qualifications: "",
        hospital: "", city: "", state: "", experienceYears: 0, bio: "",
        email: "", phone: "", socialLinks: { linkedin: "" }, isPublished: false
      });
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
      if (result.success) setFormData({ ...formData, photoUrl: result.url });
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingDoctor ? `/api/admin/doctors/${editingDoctor._id}` : "/api/admin/doctors";
    const method = editingDoctor ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Doctor Directory</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
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
                  <td className="p-4 text-sm">{doc.specialization}</td>
                  <td className="p-4 text-sm">{doc.city}, {doc.state}</td>
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
          
          <div className="flex items-center gap-4 mb-4">
            {formData.photoUrl ? (
               <img src={formData.photoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
            ) : (
               <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                 <ImageIcon />
               </div>
            )}
            <div>
              <Label htmlFor="photo" className="block mb-2">Profile Photo</Label>
              <Input id="photo" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name (without Dr.)</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications (e.g. MBBS, MD)</Label>
              <Input id="qualifications" value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital / Clinic</Label>
              <Input id="hospital" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceYears">Experience (Years)</Label>
              <Input id="experienceYears" type="number" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: Number(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
              <Input id="linkedin" value={formData.socialLinks.linkedin} onChange={e => setFormData({...formData, socialLinks: { linkedin: e.target.value }})} />
            </div>

            <div className="flex items-center gap-2 mt-4 col-span-2">
              <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-4 h-4" />
              <Label htmlFor="isPublished">Publish to Public Directory</Label>
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
