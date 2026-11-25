"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Scissors,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { SidebarNavItem, SidebarUser, UserRole } from "@/types/salon";

export const CUSTOMER_SIDEBAR_ITEMS: SidebarNavItem[] = [
  {
    key: "overview",
    label: "Overview",
    href: "/dashboard/customer",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    key: "appointments",
    label: "My Appointments",
    href: "/dashboard/customer/appointments",
    icon: <CalendarCheck className="h-4 w-4" />,
  },
  {
    key: "profile",
    label: "My Profile",
    href: "/dashboard/customer/profile",
    icon: <UserCircle className="h-4 w-4" />,
  },
];

export const ADMIN_SIDEBAR_ITEMS: SidebarNavItem[] = [
  {
    key: "overview",
    label: "Overview",
    href: "/dashboard/admin",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    key: "services",
    label: "Manage Services",
    href: "/dashboard/admin/services",
    icon: <Scissors className="h-4 w-4" />,
  },
  {
    key: "add-service",
    label: "Add/Update Service",
    href: "/dashboard/admin/services/new",
    icon: <PlusCircle className="h-4 w-4" />,
  },
  {
    key: "appointments",
    label: "Manage Appointments",
    href: "/dashboard/admin/appointments",
    icon: <CalendarCheck className="h-4 w-4" />,
  },
  {
    key: "users",
    label: "Manage Users",
    href: "/dashboard/admin/users",
    icon: <Users className="h-4 w-4" />,
  },
  {
    key: "transactions",
    label: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    key: "profile",
    label: "My Profile",
    href: "/dashboard/admin/profile",
    icon: <UserCircle className="h-4 w-4" />,
  },
];

interface DashboardSidebarProps {
  user: SidebarUser;
  onLogout: () => Promise<void> | void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function getSidebarItemsByRole(role: UserRole): SidebarNavItem[] {
  return role === "admin" ? ADMIN_SIDEBAR_ITEMS : CUSTOMER_SIDEBAR_ITEMS;
}

export default function DashboardSidebar({
  user,
  onLogout,
  mobileOpen = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = getSidebarItemsByRole(user.role);

  const handleLogoutClick = async () => {
    await onLogout();
  };

  const body = (
    <div className="flex h-full flex-col justify-between bg-[#FFFDFB] border-r border-[#EAE4DC] text-[#1F191E]">
      <div>
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <Link href="/" onClick={() => onCloseMobile?.()}>
            <span className="block font-editorial text-2xl tracking-tight text-[#121212]">
              Salon<span className="text-[#c87d6b]">Book</span>
            </span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              {user.role === "admin" ? "Studio Admin" : "Customer Portal"}
            </span>
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden rounded-lg p-1.5 text-neutral-500 hover:bg-[#f9f9f9]"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => onCloseMobile?.()}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#B85D68] text-white shadow-2xs"
                    : "text-[#4A4047] hover:bg-[#F5F0EA] hover:text-[#1F191E]"
                }`}
              >
                <span className={isActive ? "text-white" : "text-[#8A7C85]"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 pt-2">
          <Link
            href="/services"
            onClick={() => onCloseMobile?.()}
            className="flex items-center justify-between rounded-xl border border-[#EAE4DC] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-medium text-[#4A4047] hover:border-[#B85D68]/40 hover:text-[#1F191E] transition-colors"
          >
            <span>Browse Salon Services</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-[#EAE4DC] bg-[#FAF8F5]/75">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={
              user.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=B85D68&color=fff`
            }
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover border border-[#E2D9CE]"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1F191E]">
              {user.name}
            </p>
            <p className="truncate text-xs text-[#6E636B]">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E2D9CE] bg-white px-3 py-2 text-xs font-medium text-[#4A4047] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 h-screen w-64">{body}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full">{body}</div>
        </div>
      )}
    </>
  );
}