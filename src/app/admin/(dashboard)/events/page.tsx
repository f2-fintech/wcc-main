"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";

export default function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    editionName: "", slug: "", date: "", time: "", venue: "", location: "",
    description: "", whatToExpect: "", status: "upcoming", registrationOpen: true,
    seatLimit: 50, bannerImageUrl: "", highlightsVideoUrl: ""
  });

  const fetchEvents = async () => {
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    if (data.success) setEvents(data.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (evt: any = null) => {
    if (evt) {
      setEditingEvent(evt);
      setFormData({
        ...evt,
        whatToExpect: evt.whatToExpect.join("\n") // Convert array to multiline string for textarea
      });
    } else {
      setEditingEvent(null);
      setFormData({
        editionName: "", slug: "", date: "", time: "", venue: "", location: "",
        description: "", whatToExpect: "", status: "upcoming", registrationOpen: true,
        seatLimit: 50, bannerImageUrl: "", highlightsVideoUrl: ""
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
      if (result.success) setFormData({ ...formData, bannerImageUrl: result.url });
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      whatToExpect: formData.whatToExpect.split("\n").filter(Boolean)
    };

    const url = editingEvent ? `/api/admin/events/${editingEvent._id}` : "/api/admin/events";
    const method = editingEvent ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchEvents();
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
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Events</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase">
                <th className="p-4 font-medium">Edition Name</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Registrations</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((evt) => (
                <tr key={evt._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-primary">{evt.editionName}</div>
                    <div className="text-xs text-gray-400">/{evt.slug}</div>
                  </td>
                  <td className="p-4 text-sm">{evt.date} <br/> <span className="text-gray-500">{evt.time}</span></td>
                  <td className="p-4 text-sm">{evt.venue}, {evt.location}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${evt.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {evt.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {evt.registrationOpen ? "Open" : "Closed"} <br/> (Max {evt.seatLimit})
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenModal(evt)} className="text-blue-500 hover:text-blue-700 p-2"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(evt._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
        <h2 className="text-2xl font-serif mb-6">{editingEvent ? "Edit Event" : "Add Event"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editionName">Edition Name</Label>
              <Input id="editionName" value={formData.editionName} onChange={e => setFormData({...formData, editionName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" placeholder="e.g. 24th October, 2026" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" placeholder="e.g. 7:00 PM onwards" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">City/Location</Label>
              <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="whatToExpect">What to Expect (One per line)</Label>
              <Textarea id="whatToExpect" rows={4} value={formData.whatToExpect} onChange={e => setFormData({...formData, whatToExpect: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seatLimit">Seat Limit</Label>
              <Input id="seatLimit" type="number" value={formData.seatLimit} onChange={e => setFormData({...formData, seatLimit: Number(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Event Status</Label>
              <select 
                id="status" 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="flex h-12 w-full rounded-md border border-border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="bannerImage">Banner Image</Label>
              <div className="flex items-center gap-4">
                {formData.bannerImageUrl && <img src={formData.bannerImageUrl} alt="Banner" className="h-12 w-20 object-cover rounded" />}
                <Input id="bannerImage" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="highlightsVideoUrl">Highlights Video URL (For Past Events)</Label>
              <Input id="highlightsVideoUrl" value={formData.highlightsVideoUrl} onChange={e => setFormData({...formData, highlightsVideoUrl: e.target.value})} />
            </div>
            <div className="flex items-center gap-2 mt-4 col-span-2">
              <input type="checkbox" id="registrationOpen" checked={formData.registrationOpen} onChange={e => setFormData({...formData, registrationOpen: e.target.checked})} className="w-4 h-4" />
              <Label htmlFor="registrationOpen">Registration Open</Label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t mt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : "Save Event"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
