"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function JoinRequestsAdmin() {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    const res = await fetch("/api/admin/join-requests");
    const data = await res.json();
    if (data.success) setRequests(data.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to mark this request as ${status}?`)) return;
    try {
      const res = await fetch(`/api/admin/join-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchRequests();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-primary mb-8">Pending Join Requests</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Doctor Details</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Workplace</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-primary">Dr. {req.name}</div>
                    <div className="text-sm text-gray-500">{req.specialty}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{req.email}</div>
                    <div className="text-sm text-gray-500">{req.phone}</div>
                  </td>
                  <td className="p-4 text-sm">
                    {req.workplace}, {req.city}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      req.status === 'approved' ? 'bg-green-100 text-green-700' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateStatus(req._id, 'approved')} className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors" title="Approve">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleUpdateStatus(req._id, 'rejected')} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Reject">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No join requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
