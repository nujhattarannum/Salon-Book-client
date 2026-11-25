"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";
import { AppointmentItem } from "@/types/salon";
import AdminAppointmentTable from "@/components/dashboard/AdminAppointmentTable";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        setLoading(true);
        const data = await apiRequest<
          { appointments?: AppointmentItem[] } | AppointmentItem[]
        >("/admin/appointments");
        setAppointments(Array.isArray(data) ? data : data.appointments || []);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load appointments."
        );
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, []);

const handleStatusChange = async (
  id: string,
  status: AppointmentItem["status"]
) => {
    try {
      await apiRequest(`/admin/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Appointment marked as ${status}.`);
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update appointment."
      );
    }
  };

  const filtered =
    filterStatus === "all"
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilterStatus(status)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition cursor-pointer ${
              filterStatus === status
                ? "bg-[#B85D68] text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <AdminAppointmentTable
        appointments={filtered}
        loading={loading}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}