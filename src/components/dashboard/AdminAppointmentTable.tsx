"use client";

import React from "react";
import { AppointmentItem } from "@/types/salon";
import StatusBadge from "./StatusBadge";

interface AdminAppointmentTableProps {
  appointments: AppointmentItem[];
  loading: boolean;
 onStatusChange: (
  id: string,
  status: AppointmentItem["status"]) => void;
}

export default function AdminAppointmentTable({
  appointments,
  loading,
  onStatusChange,
}: AdminAppointmentTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-[#FAF8F5] text-xs uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="px-5 py-3.5">Service</th>
            <th className="px-5 py-3.5">Customer</th>
            <th className="px-5 py-3.5">Date & Slot</th>
            <th className="px-5 py-3.5">Price / Payment</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {loading ? (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-neutral-400">
                Loading appointments...
              </td>
            </tr>
          ) : appointments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-neutral-400">
                No appointments found.
              </td>
            </tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-neutral-50/70">
                <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                  {appt.serviceName || "Salon Treatment"}
                </td>
                <td className="px-5 py-4 text-neutral-600">
                  {appt.customerName || appt.customerEmail || "Customer"}
                </td>
                <td className="px-5 py-4 text-neutral-600">
                  <div>{appt.appointmentDate}</div>
                  <div className="text-xs text-neutral-400">{appt.timeSlot}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-medium">
                    ${Number(appt.servicePrice || 0).toFixed(2)}
                  </span>
                  <span className="ml-2">
                    <StatusBadge value={appt.paymentStatus} />
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge value={appt.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <select
                    value={appt.status}
                    onChange={(e) => onStatusChange(appt._id,  e.target.value as AppointmentItem["status"] )}
                    className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#C87D6B]"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirm</option>
                    <option value="completed">Complete</option>
                    <option value="cancelled">Cancel</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}