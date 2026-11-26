"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Calendar, Clock, CreditCard, Eye, Sparkles, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { CustomerAppointmentItem, SessionUser } from "@/types/salon";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";

export default function CustomerAppointmentsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;
  const userId = user?.id;
  const userEmail = user?.email;

  const [appointments, setAppointments] = useState<CustomerAppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<CustomerAppointmentItem | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CustomerAppointmentItem | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  // 1. Fetch customer appointments on load
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    async function fetchAppointments() {
      try {
        const query = userEmail
          ? `?customerEmail=${encodeURIComponent(userEmail)}`
          : "";
        const data = await apiRequest<
          | { appointments?: CustomerAppointmentItem[] }
          | CustomerAppointmentItem[]
        >(`/customer/appointments${query}`);

        if (isMounted) {
          setAppointments(Array.isArray(data) ? data : data.appointments || []);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load your appointments."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, [userId, userEmail]);

  // 2. Verify Stripe Checkout Session when returning from Stripe
  useEffect(() => {
    if (!userId || typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const sessionId = params.get("session_id");

    if (payment === "success" && sessionId) {
      (async () => {
        try {
          await apiRequest("/customer/appointments/confirm-checkout", {
            method: "POST",
            body: JSON.stringify({ sessionId }),
          });
          toast.success("Payment completed! Your appointment is now marked as paid.");

          const query = userEmail
            ? `?customerEmail=${encodeURIComponent(userEmail)}`
            : "";
          const data = await apiRequest<
            | { appointments?: CustomerAppointmentItem[] }
            | CustomerAppointmentItem[]
          >(`/customer/appointments${query}`);
          setAppointments(Array.isArray(data) ? data : data.appointments || []);
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Could not confirm payment."
          );
        } finally {
          window.history.replaceState({}, "", "/dashboard/customer/appointments");
        }
      })();
    } else if (payment === "cancelled") {
      toast.error("Stripe checkout was cancelled.");
      window.history.replaceState({}, "", "/dashboard/customer/appointments");
    }
  }, [userId, userEmail]);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await apiRequest(`/customer/appointments/${cancelTarget._id}/cancel`, {
        method: "PATCH",
        body: JSON.stringify({ customerEmail: userEmail }),
      });
      toast.success("Pending appointment cancelled.");
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === cancelTarget._id ? { ...a, status: "cancelled" } : a
        )
      );
      setCancelTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel appointment."
      );
    } finally {
      setCancelling(false);
    }
  };

  const handlePayConfirmed = async (appt: CustomerAppointmentItem) => {
    if (appt.status !== "confirmed" || appt.paymentStatus === "paid") return;
    setPayingId(appt._id);
    try {
      const data = await apiRequest<{ url: string }>(
        `/customer/appointments/${appt._id}/create-checkout-session`,
        {
          method: "POST",
          body: JSON.stringify({ customerEmail: userEmail }),
        }
      );

      if (!data.url) {
        throw new Error("Could not get Stripe checkout URL.");
      }

      window.location.assign(data.url);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Payment could not be started."
      );
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-[#FAF8F5] text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-5 py-3.5">Service</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Appointment Schedule</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Appointment Status</th>
              <th className="px-5 py-3.5">Payment Status</th>
              <th className="px-5 py-3.5">Requested On</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-neutral-400">
                  Loading your appointments...
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-neutral-400">
                  You have not submitted any appointment requests yet.
                </td>
              </tr>
            ) : (
              appointments.map((appt) => {
                const canCancel = appt.status === "pending";
                const canPay =
                  appt.status === "confirmed" && appt.paymentStatus !== "paid";

                return (
                  <tr key={appt._id} className="hover:bg-neutral-50/70 align-middle">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden border border-neutral-200 bg-[#FAF8F5] flex items-center justify-center shrink-0">
                          {appt.serviceImage ? (
                            <img
                              src={appt.serviceImage}
                              alt={appt.serviceName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Sparkles className="h-4 w-4 text-[#C87D6B]" />
                          )}
                        </div>
                        <span className="font-medium text-[#1E1E1E]">
                          {appt.serviceName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-neutral-600">
                      {appt.serviceCategory || "General"}
                    </td>

                    <td className="px-5 py-4 text-neutral-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#C87D6B]" />
                        <span>{appt.appointmentDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{appt.timeSlot}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                      ${Number(appt.servicePrice || 0).toFixed(2)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge value={appt.status} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge value={appt.paymentStatus} />
                    </td>

                    <td className="px-5 py-4 text-xs text-neutral-500">
                      {appt.createdAt
                        ? new Date(appt.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAppt(appt)}
                          className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:border-[#C87D6B] hover:text-[#C87D6B] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Details
                        </button>

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(appt)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        )}

                        {canPay && (
                          <button
                            type="button"
                            disabled={payingId === appt._id}
                            onClick={() => handlePayConfirmed(appt)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#1E1E1E] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#C87D6B] disabled:opacity-60 cursor-pointer"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            {payingId === appt._id ? "Redirecting..." : "Pay Now"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* View Appointment Details Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#EAE4DC] bg-white p-6 shadow-lg space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#C87D6B]">
                  Appointment Details
                </p>
                <h3 className="font-editorial text-2xl text-[#1E1E1E] mt-1">
                  {selectedAppt.serviceName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppt(null)}
                className="rounded-lg border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-neutral-400">Category</p>
                <p className="font-medium text-neutral-800">
                  {selectedAppt.serviceCategory || "General"}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Service Price</p>
                <p className="font-medium text-neutral-800">
                  ${Number(selectedAppt.servicePrice || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Appointment Date</p>
                <p className="font-medium text-neutral-800">
                  {selectedAppt.appointmentDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Time Slot</p>
                <p className="font-medium text-neutral-800">
                  {selectedAppt.timeSlot}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Appointment Status</p>
                <div className="mt-1">
                  <StatusBadge value={selectedAppt.status} />
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Payment Status</p>
                <div className="mt-1">
                  <StatusBadge value={selectedAppt.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-3">
              <p className="text-xs text-neutral-400 mb-1">Notes</p>
              <p className="text-sm text-neutral-700">
                {selectedAppt.message || "No additional notes provided."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Pending Appointment Confirmation */}
      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel Appointment Request"
        description={`Cancel your pending appointment for "${cancelTarget?.serviceName}" on ${cancelTarget?.appointmentDate} (${cancelTarget?.timeSlot})?`}
        confirmLabel="Cancel Request"
        loading={cancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}