"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/types/salon";

import AdminOverviewTab from "@/components/dashboard/admin/AdminOverviewTab";
import ManageServicesTab from "@/components/dashboard/admin/ManageServicesTab";
import ManageAppointmentsTab from "@/components/dashboard/admin/ManageAppointmentsTab";
import ManageUsersTab from "@/components/dashboard/admin/ManageUsersTab";
import TransactionsTab from "@/components/dashboard/admin/TransactionsTab";
import AdminProfileTab from "@/components/dashboard/admin/AdminProfileTab";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  if (isPending || !user || user.role !== "admin") {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#B85D68]" />
      </div>
    );
  }

  switch (activeTab) {
    case "services":
      return <ManageServicesTab />;
    case "appointments":
      return <ManageAppointmentsTab />;
    case "users":
      return <ManageUsersTab currentAdminId={user.id} />;
    case "transactions":
      return <TransactionsTab />;
    case "profile":
      return <AdminProfileTab user={user} />;
    case "overview":
    default:
      return <AdminOverviewTab />;
  }
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#B85D68]" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}