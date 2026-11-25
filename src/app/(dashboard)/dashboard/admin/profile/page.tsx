"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/types/salon";

export default function AdminProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });
      if (error) throw new Error(error.message || "Failed to update profile.");
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-4 pb-6 mb-6 border-b border-neutral-200">
        <img
          src={
            image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name || "Admin"
            )}&background=B85D68&color=fff`
          }
          alt={name}
          className="h-16 w-16 rounded-full object-cover border border-neutral-200"
        />
        <div>
          <h2 className="font-editorial text-2xl text-[#1E1E1E]">{user.name}</h2>
          <p className="text-xs text-neutral-500">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-[#B85D68]/10 px-2.5 py-0.5 text-[11px] font-medium capitalize text-[#9B4752]">
            {user.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.16em] text-neutral-600 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-[#C87D6B]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.16em] text-neutral-600 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={user.email || ""}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.16em] text-neutral-600 mb-1.5">
            Avatar Image URL
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-[#C87D6B]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#1E1E1E] px-6 py-3 text-xs uppercase tracking-[0.18em] text-white hover:bg-[#C87D6B] disabled:opacity-60 transition cursor-pointer"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}