"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { CustomerStats, SessionUser } from "@/types/salon";

const initialStats: CustomerStats = {
  totalAppointments: 0,
  pendingAppointments: 0,
  confirmedAppointments: 0,
  cancelledAppointments: 0,
};

const cards = [
  {
    key: "totalAppointments",
    label: "Total Appointment Requests",
    hint: "All bookings submitted by you",
  },
  {
    key: "pendingAppointments",
    label: "Pending Appointments",
    hint: "Awaiting salon confirmation",
  },
  {
    key: "confirmedAppointments",
    label: "Confirmed Appointments",
    hint: "Ready for payment & visit",
  },
  {
    key: "cancelledAppointments",
    label: "Cancelled Appointments",
    hint: "Cancelled requests",
  },
] as const;

export default function CustomerOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  const [stats, setStats] = useState<CustomerStats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function loadCustomerStats() {
      try {
        setLoading(true);
        const query = user?.email
          ? `?customerEmail=${encodeURIComponent(user.email)}`
          : "";
        const data = await apiRequest<{ stats?: CustomerStats } & CustomerStats>(
          `/customer/stats${query}`
        );
        setStats(data.stats || data);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load overview stats."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCustomerStats();
  }, [user?.id, user?.email]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-2xl text-[#121212]">
            My Booking Summary
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Track your salon appointment requests and payment status.
          </p>
        </div>

        <Link
          href="/services"
          className="rounded-xl bg-[#1E1E1E] px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white hover:bg-[#C87D6B] transition"
        >
          Book New Service
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.key}
              className="h-36 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.key}
              className="rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <p className="text-sm text-neutral-500">{card.label}</p>
              <p className="mt-4 font-editorial text-4xl text-[#C87D6B]">
                {stats[card.key]}
              </p>
              <p className="mt-3 text-xs text-neutral-400">{card.hint}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-[#EAE4DC] bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-editorial text-2xl text-[#121212]">
            Ready to manage your sessions?
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            View full booking details, cancel pending requests, or pay for confirmed appointments.
          </p>
        </div>
        <Link
          href="/dashboard/customer/appointments"
          className="rounded-xl border border-[#1E1E1E] px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-[#1E1E1E] hover:border-[#C87D6B] hover:text-[#C87D6B] transition shrink-0 text-center"
        >
          View My Appointments
        </Link>
      </div>
    </div>
  );
}