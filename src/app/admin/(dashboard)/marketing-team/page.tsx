"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";

export default function MarketingTeamAdmin() {
  const [team, setTeam] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "", role: "", email: "", phone: "", linkedin: "", order: 0, isActive: true, photoUrl: ""
  });

  const fetchTeam = async () => {
    const res = await fetch("/api/admin/marketing-team");
    const data = await res.json();
    if (data.success) setTeam(data.data);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenModal = (member: any = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({ ...member });
    } else {
      setEditingMember(null);
      setFormData({ name: "", role: "", email: "", phone: "", linkedin: "", order: 0, isActive: true, photoUrl: "" });
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
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });
      const result = await res.json();
      if (result.success) {
        setFormData({ ...formData, photoUrl: result.url });
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingMember ? `/api/admin/marketing-team/${editingMember._id}` : "/api/admin/marketing-team";
    const method = editingMember ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchTeam();
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
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`/api/admin/marketing-team/${id}`, { method: "DELETE" });
      if (res.ok) fetchTeam();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Marketing Team</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase">
                <th className="p-4 font-medium">Photo</th>
                <th className="p-4 font-medium">Name & Role</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {team.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-primary">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{member.email || "-"}</div>
                    <div className="text-sm text-gray-500">{member.phone || "-"}</div>
                  </td>
                  <td className="p-4 text-sm">{member.order}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenModal(member)} className="text-blue-500 hover:text-blue-700 p-2"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(member._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {team.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No team members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-serif mb-6">{editingMember ? "Edit Member" : "Add Member"}</h2>
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
              {uploading && <span className="text-xs text-blue-500 mt-1">Uploading...</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Designation</Label>
              <Input id="role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
              <Input id="linkedin" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input id="order" type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
            </div>
            <div className="flex items-center gap-2 mt-8">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4" />
              <Label htmlFor="isActive">Active Status</Label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : "Save Member"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
