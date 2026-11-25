"use client";

import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-md rounded-xl border border-[#EAE4DC] bg-white p-6 shadow-lg">
        <h3 className="font-editorial text-2xl text-[#1E1E1E]">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-xs uppercase tracking-[0.16em] text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-[#B85D68] px-4 py-2 text-xs uppercase tracking-[0.16em] text-white hover:bg-[#9B4752] disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}