"use client";

import React from "react";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  userName?: string | null;
  role?: string;
  onOpenMobileMenu: () => void;
}

export default function DashboardHeader({
  title,
  description,
  userName,
  role,
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE4DC] px-4 sm:px-8 py-4">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden rounded-xl border border-[#E2D9CE] bg-white p-2 text-[#1F191E] hover:bg-[#F5F0EA] transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Title & Subtitle */}
        <div className="min-w-0">
          <h1 className="font-editorial text-2xl text-[#121212] font-semibold">
            {title}
          </h1>
          <p className="text-xs text-[#6E636B] truncate hidden sm:block">
            {description || `Welcome back, ${userName || "User"}`}
          </p>
        </div>
      </div>

      {/* Right Side: User Avatar + Role Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C87D6B] text-sm font-medium text-white">
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-[#1F191E]">
              {userName || "User"}
            </p>
            <p className="text-[11px] text-[#6E636B]">Welcome back</p>
          </div>
        </div>

        {role && (
          <span className="inline-flex items-center rounded-full bg-[#B85D68]/10 border border-[#B85D68]/20 px-3 py-1 text-xs font-medium text-[#9B4752] capitalize">
            {role}
          </span>
        )}
      </div>
    </header>
  );
}