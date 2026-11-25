"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { SalonServiceItem } from "@/types/salon";
import ServiceForm, { ServiceFormPayload } from "@/components/dashboard/ServiceForm";

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [service, setService] = useState<SalonServiceItem  | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function loadService() {
      try {
        setLoading(true);
        const data = await apiRequest<{ service?: SalonServiceItem  } & SalonServiceItem >(
          `/services/${id}`
        );
        setService(data.service || data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not load service.");
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id]);

  const handleUpdate = async (payload: ServiceFormPayload) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await apiRequest(`/admin/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      toast.success("Service updated successfully.");
      router.push("/dashboard/admin/services");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update service.");
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

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#B85D68]" />
        </div>
      ) : !service ? (
        <p className="text-sm text-neutral-500">Service not found.</p>
      ) : (
        <ServiceForm
          initialData={service}
          submitLabel="Update Service"
          submitting={submitting}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}