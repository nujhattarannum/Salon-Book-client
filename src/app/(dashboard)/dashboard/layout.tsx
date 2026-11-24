
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Menu } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/types/salon";

import DashboardSidebar, {
  getSidebarItemsByRole,
} from "@/components/dashboard/DashboardSidebar";

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Get current session using Better Auth
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as SessionUser | undefined;

  // Authentication and role checking
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

    // Admin dashboard protection
    if (
      pathname.startsWith("/dashboard/admin") &&
      user.role !== "admin"
    ) {
      router.replace("/dashboard/customer");
      return;
    }

    // Customer dashboard protection
    if (
      pathname.startsWith("/dashboard/customer") &&
      user.role !== "customer"
    ) {
      router.replace("/dashboard/admin");
      return;
    }
  }, [isPending, user, pathname, router]);

  // Logout using Better Auth
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Loading screen
  if (isPending || !user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#1F191E]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#B85D68]" />

          <p className="text-xs font-medium text-[#6E636B]">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  // Sidebar items according to user role
  const navItems = getSidebarItemsByRole(user.role);

  const currentItem = navItems.find(
    (item) => item.href?.split("?")[0] === pathname
  );

  return (
    <div
      className="min-h-screen bg-[#FAF8F5] text-[#1F191E] flex"
      data-route={pathname}
    >
      {/* Sidebar */}
      <DashboardSidebar
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE4DC] px-4 sm:px-8 py-4">

          <div className="flex items-center gap-3 min-w-0">

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-xl border border-[#E2D9CE] bg-white p-2 text-[#1F191E] hover:bg-[#F5F0EA] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page Title */}
            <div className="min-w-0">
              <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F191E] truncate">
                {currentItem?.label ?? "Dashboard"}
              </h1>

              <p className="text-xs text-[#6E636B] truncate hidden sm:block">
                Welcome back, {user.name}
              </p>
            </div>
          </div>

          {/* User Role */}
          <span className="inline-flex items-center rounded-full bg-[#B85D68]/10 border border-[#B85D68]/20 px-3 py-1 text-xs font-medium text-[#9B4752] capitalize shrink-0">
            {user.role}
          </span>

        </header>

        {/* Dashboard Page Content */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
