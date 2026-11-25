"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";
import { AdminStats } from "@/types/salon";
import DashboardStats from "@/components/dashboard/DashboardStats";

const initialStats: AdminStats = {
  totalCustomers: 0,
  totalServices: 0,
  totalAppointments: 0,
  pendingAppointments: 0,
  confirmedAppointments: 0,
  successfulPayments: 0,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await apiRequest<{ stats?: AdminStats } & AdminStats>(
          "/admin/stats"
        );
        setStats(data.stats || data);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load admin statistics."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-editorial text-2xl text-[#121212]">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Here&apos;s what&apos;s happening at your salon.
        </p>
      </div>

      <DashboardStats stats={stats} loading={loading} />

      <div className="rounded-xl border border-[#EAE4DC] bg-white p-6">
        <p className="font-editorial text-2xl text-[#121212]">
          Welcome to SalonBook
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Keep track of your services, appointment requests, customers, and
          payments from one place.
        </p>
      </div>
    </div>
  );
}