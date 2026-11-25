"use client";

import React from "react";

interface StatusBadgeProps {
  value: string;
}

export default function StatusBadge({ value }: StatusBadgeProps) {
  const normalized = value.toLowerCase();

  let styles = "bg-neutral-100 text-neutral-700 border-neutral-200";

  if (["active", "confirmed", "paid", "succeeded", "completed"].includes(normalized)) {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (["pending", "unpaid"].includes(normalized)) {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (["inactive", "cancelled", "blocked", "failed"].includes(normalized)) {
    styles = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${styles}`}
    >
      {value}
    </span>
  );
}