"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { SalonServiceItem } from "@/types/salon";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";

export default function AdminServicesPage() {
  const [services, setServices] = useState<SalonServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SalonServiceItem | null>(null);
  const [deleting, setDeleting] = useState(false);


useEffect(() => {
  const fetchServices = async () => {
    try {
      setLoading(true);

      const data = await apiRequest<
        { services?: SalonServiceItem[] } | SalonServiceItem[]
      >("/admin/services");

      setServices(
        Array.isArray(data) ? data : data.services || []
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchServices(); // This was missing!
}, []);


  const handleToggleActive = async (service: SalonServiceItem) => {
    try {
      await apiRequest(`/admin/services/${service._id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      toast.success(
        `Service marked as ${!service.isActive ? "active" : "inactive"}.`
      );
      setServices((prev) =>
        prev.map((s) =>
          s._id === service._id ? { ...s, isActive: !s.isActive } : s
        )
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update status.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/admin/services/${deleteTarget._id}`, {
        method: "DELETE",
      });
      toast.success("Service deleted successfully.");
      setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete service.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Total Services:{" "}
          <span className="font-semibold text-[#1E1E1E]">{services.length}</span>
        </p>

        <Link
          href="/dashboard/admin/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E1E1E] px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-white hover:bg-[#C87D6B] transition"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-[#FAF8F5] text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-5 py-3.5">Service</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-neutral-400">
                  Loading services...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-neutral-400">
                  No services found.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service._id} className="hover:bg-neutral-50/70">
                  <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                    {service.name}
                  </td>
                  <td className="px-5 py-4 text-neutral-600">
                    {service.category}
                  </td>
                  <td className="px-5 py-4 font-medium">
                    ${Number(service.price).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-neutral-600">
                    {service.duration} mins
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={service.isActive ? "active" : "inactive"} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/dashboard/admin/services/${service._id}/edit`}
                        title="Edit Service"
                        className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:border-[#C87D6B] hover:text-[#C87D6B]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(service)}
                        title="Toggle Status"
                        className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:border-amber-500 hover:text-amber-600 cursor-pointer"
                      >
                        <Power className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(service)}
                        title="Delete Service"
                        className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:border-rose-300 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}