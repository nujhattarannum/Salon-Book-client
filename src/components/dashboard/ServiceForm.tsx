"use client";

import React, { useState } from "react";
import {SalonServiceItem } from "@/types/salon";

export interface ServiceFormPayload {
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  isActive: boolean;
}

interface ServiceFormProps {
  initialData?: Partial<SalonServiceItem>;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (payload: ServiceFormPayload) => Promise<void> | void;
}

export default function ServiceForm({
  initialData,
  submitLabel,
  submitting = false,
  onSubmit,
}: ServiceFormProps) {
  const [name, setName] = useState(initialData?.serviceName|| "");
  const [category, setCategory] = useState(initialData?.category || "Hair");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(
    initialData?.price !== undefined ? String(initialData.price) : ""
  );
  const [duration, setDuration] = useState(
    initialData?.duration !== undefined ? String(initialData.duration) : "60"
  );
  const [image, setImage] = useState(initialData?.image || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: Number(price),
      duration: Number(duration),
      image: image.trim(),
      isActive,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.16em] text-neutral-600 mb-1.5">
            Service Name
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
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-[#C87D6B]"
          >
            <option value="Hair">Hair</option>
            <option value="Skin & Facial">Skin & Facial</option>
            <option value="Nails">Nails</option>
            <option value="Spa & Massage">Spa & Massage</option>
            <option value="Bridal & Makeup">Bridal & Makeup</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.16em] text-neutral-600 mb-1.5">
            Price ($)
          </label>
          <input
            type="number"
            min="1"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-[#C87D6B]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.16em] text-neutral-600 mb-1.5">
            Duration (Minutes)
          </label>
          <input
            type="number"
            min="10"
            step="5"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-[#C87D6B]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.16em] text-neutral-600 mb-1.5">
          Image URL
        </label>
        <input
          type="url"
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-[#C87D6B]"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.16em] text-neutral-600 mb-1.5">
          Description
        </label>
        <textarea
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-[#C87D6B]"
        />
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="accent-[#B85D68]"
        />
        Active and available for customer booking
      </label>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#1E1E1E] px-6 py-3 text-xs uppercase tracking-[0.18em] text-white hover:bg-[#C87D6B] disabled:opacity-60 transition cursor-pointer"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}