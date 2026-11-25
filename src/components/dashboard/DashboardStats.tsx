"use client";

import React from "react";
import { AdminStats } from "@/types/salon";

const statItems = [
  { key: "totalCustomers", title: "Registered Customers", description: "Total customer accounts" },
  { key: "totalServices", title: "Active Services", description: "Currently available services" },
  { key: "totalAppointments", title: "Appointment Requests", description: "All appointment requests" },
  { key: "pendingAppointments", title: "Pending Appointments", description: "Waiting for confirmation" },
  { key: "confirmedAppointments", title: "Confirmed Appointments", description: "Approved appointments" },
  { key: "successfulPayments", title: "Successful Payments", description: "Completed payments" },
] as const;

export default function DashboardStats({
  stats,
  loading,
}: {
  stats: AdminStats;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statItems.map((item) => (
          <div
            key={item.key}
            className="h-36 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {statItems.map((item) => (
        <div
          key={item.key}
          className="rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-neutral-500">{item.title}</p>
          <p className="mt-4 font-editorial text-4xl text-[#C87D6B]">
            {stats[item.key]}
          </p>
          <p className="mt-3 text-xs text-neutral-400">{item.description}</p>
        </div>
      ))}
    </div>
  );
}