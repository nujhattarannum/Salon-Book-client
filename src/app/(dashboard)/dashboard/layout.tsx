"use client";

import React, { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/types/salon";
import DashboardSidebar, {
  getSidebarItemsByRole,
} from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const ADMIN_TAB_META: Record<string, { title: string; description: string }> = {
  overview: {
    title: "Admin Overview",
    description: "Manage your salon and monitor daily activities.",
  },
  services: {
    title: "Manage Services",
    description: "Create, update, or toggle active salon treatments.",
  },
  appointments: {
    title: "Manage Appointments",
    description: "Review, confirm, or cancel customer booking requests.",
  },
  users: {
    title: "Manage Users",
    description: "Manage customer and admin accounts and access status.",
  },
  transactions: {
    title: "Transactions",
    description: "Track completed and pending appointment payments.",
  },
  profile: {
    title: "My Profile",
    description: "Update your administrator profile details.",
  },
};

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  // Role & Auth Guard: prevents accessing another role's dashboard via URL
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    if (user.isBlocked) {
      router.replace("/sign-in?error=blocked");
      return;
    }

    if (pathname.startsWith("/dashboard/admin") && user.role !== "admin") {
      router.replace("/dashboard/customer?tab=overview");
      return;
    }

    if (pathname.startsWith("/dashboard/customer") && user.role !== "customer") {
      router.replace("/dashboard/admin?tab=overview");
      return;
    }
  }, [isPending, user, pathname, router]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (
    isPending ||
    !user ||
    (pathname.startsWith("/dashboard/admin") && user.role !== "admin") ||
    (pathname.startsWith("/dashboard/customer") && user.role !== "customer")
  ) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#1F191E]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#B85D68]" />
          <p className="text-xs font-medium text-[#6E636B]">
            Verifying access permissions...
          </p>
        </div>
      </div>
    );
  }

  const currentTab = searchParams.get("tab") || "overview";
  const navItems = getSidebarItemsByRole(user.role);
  const activeNav = navItems.find((item) => item.key === currentTab);

  const meta =
    user.role === "admin" && ADMIN_TAB_META[currentTab]
      ? ADMIN_TAB_META[currentTab]
      : {
          title: activeNav?.label ?? "Dashboard",
          description: `Welcome back, ${user.name}`,
        };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F191E] flex">
      <DashboardSidebar
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader
          title={meta.title}
          description={meta.description}
          userName={user.name}
          role={user.role}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#B85D68]" />
        </div>
      }
    >
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}