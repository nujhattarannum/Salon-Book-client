"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/api";
import ServiceForm, { ServiceFormPayload } from "@/components/dashboard/ServiceForm";

export default function NewServicePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (payload: ServiceFormPayload) => {
    setSubmitting(true);
    try {
      await apiRequest("/admin/services", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success("Service created successfully.");
      router.push("/dashboard/admin/services");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin/services"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#1E1E1E] hover:text-[#C87D6B]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Manage Services
      </Link>

      <ServiceForm
        submitLabel="Create Service"
        submitting={submitting}
        onSubmit={handleCreate}
      />
    </div>
  );
}