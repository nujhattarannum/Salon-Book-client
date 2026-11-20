"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; // Adjust path to your Better Auth client
import {
  Clock,
  ArrowLeft,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface ServiceDetail {
  _id: string;
  name: string;
  image?: string;
  category: string;
  description: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
}

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: "customer" | "admin" | string;
}

export default function ServiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const serviceId = params?.id;

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Appointment form state
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingFeedback, setBookingFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!serviceId) return;

    const loadService = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/services/${serviceId}`);

        if (res.status === 400 || res.status === 404) {
          setErrorMessage("We couldn't find that service. The link may be invalid or no longer available.");
          setService(null);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load service details.");
        }

        const data = await res.json();
        const found: ServiceDetail | undefined = data.service || data;

        if (!found || !found._id) {
          setErrorMessage("Invalid service ID. Please select a valid service.");
          setService(null);
          return;
        }

        setService(found);
      } catch {
        setErrorMessage("Unable to load service details right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingFeedback(null);

    if (!service || !service.isActive) {
      setBookingFeedback({
        type: "error",
        text: "This service is currently inactive and cannot be booked.",
      });
      return;
    }

    if (!user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(`/services/${service._id}`)}`);
      return;
    }

    if (user.role === "admin") {
      setBookingFeedback({
        type: "error",
        text: "Admin accounts cannot submit customer appointment requests.",
      });
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      setBookingFeedback({
        type: "error",
        text: "Please select both a preferred date and time.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          serviceId: service._id,
          serviceName: service.name,
          price: service.price,
          duration: service.duration,
          date: appointmentDate,
          time: appointmentTime,
          notes: notes.trim(),
          customerId: user.id,
          customerEmail: user.email,
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.message || "Could not submit your appointment request.");
      }

      setBookingFeedback({
        type: "success",
        text: "Your appointment request has been submitted! We look forward to welcoming you.",
      });
      setAppointmentDate("");
      setAppointmentTime("");
      setNotes("");
    } catch (err) {
      setBookingFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong while booking.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FFFFFF] text-[#1E1E1E] min-h-screen">
      {/* Top Bar */}
      <div className="bg-[#F9F9F9] border-b border-neutral-200">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1E1E1E] hover:text-[#C87D6B] transition"
          >
            <ArrowLeft size={15} />
            Back to Services
          </Link>
          <span className="text-xs uppercase tracking-[0.22em] text-[#C87D6B]">
            SalonBook Editorial
          </span>
        </div>
      </div>

      <section className="max-w-[1320px] mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Loading State */}
        {(loading || sessionLoading) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
            <div className="lg:col-span-7 h-[420px] bg-[#F9F9F9] border border-neutral-200" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-4 w-32 bg-neutral-200" />
              <div className="h-10 w-3/4 bg-neutral-200" />
              <div className="h-24 w-full bg-neutral-200" />
              <div className="h-64 w-full bg-neutral-200" />
            </div>
          </div>
        )}

        {/* Invalid ID / Error State */}
        {!loading && errorMessage && (
          <div className="max-w-xl mx-auto my-12 bg-[#F9F9F9] border border-[#D4A5A5] p-10 text-center">
            <AlertCircle className="w-10 h-10 text-[#C87D6B] mx-auto mb-4" />
            <h1 className="font-editorial text-3xl md:text-4xl mb-3">Service Unavailable</h1>
            <p className="text-sm text-neutral-600 leading-relaxed mb-7">{errorMessage}</p>
            <Link
              href="/services"
              className="inline-block bg-[#1E1E1E] text-white text-xs uppercase tracking-[0.2em] px-7 py-3.5 hover:bg-[#C87D6B] transition"
            >
              Browse All Services
            </Link>
          </div>
        )}

        {/* Service Details Content */}
        {!loading && !errorMessage && service && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Image & Editorial Details */}
            <div className="lg:col-span-7">
              <div className="relative bg-[#F9F9F9] border border-neutral-200 overflow-hidden aspect-[4/3]">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                    <Sparkles className="w-8 h-8 mb-2 text-[#D4A5A5]" />
                    <span className="text-xs uppercase tracking-[0.2em]">SalonBook Treatment</span>
                  </div>
                )}

                {!service.isActive && (
                  <div className="absolute top-4 left-4 bg-[#1E1E1E] text-white text-[11px] uppercase tracking-[0.2em] px-3.5 py-1.5">
                    Currently Inactive
                  </div>
                )}
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-px bg-[#C87D6B]" />
                  <span className="text-xs uppercase tracking-[0.24em] text-[#C87D6B]">
                    {service.category}
                  </span>
                </div>

                <h1 className="font-editorial text-4xl md:text-5xl text-[#1E1E1E] leading-tight">
                  {service.name}
                </h1>

                <div className="flex flex-wrap items-center gap-6 mt-5 pb-6 border-b border-neutral-200">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                      Investment
                    </p>
                    <p className="text-2xl font-medium text-[#1E1E1E] mt-0.5">
                      ${service.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="h-9 w-px bg-neutral-200" />

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                      Estimated Duration
                    </p>
                    <p className="inline-flex items-center gap-1.5 text-base text-[#1E1E1E] mt-1">
                      <Clock size={16} className="text-[#C87D6B]" />
                      {service.duration} mins
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-xs uppercase tracking-[0.22em] text-[#1E1E1E] mb-3">
                    About This Treatment
                  </h2>
                  <p className="text-neutral-600 text-sm md:text-base leading-7 whitespace-pre-line">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Appointment Booking Card */}
            <div className="lg:col-span-5 bg-[#F9F9F9] border border-neutral-200 p-7 md:p-9">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#C87D6B] mb-2">
                <Calendar size={15} />
                <span>Reserve Your Spot</span>
              </div>
              <h2 className="font-editorial text-3xl text-[#1E1E1E] mb-2">
                Book Appointment
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                Select your preferred date and time for <span className="text-[#1E1E1E] font-medium">{service.name}</span>.
              </p>

              {/* Rule 1: Inactive service */}
              {!service.isActive ? (
                <div className="bg-white border border-[#D4A5A5] p-5 text-sm text-neutral-700">
                  <p className="font-medium text-[#1E1E1E] mb-1">Booking Unavailable</p>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    This service is not currently active for appointment requests. Please explore our active treatments.
                  </p>
                  <Link
                    href="/services"
                    className="inline-block mt-4 text-xs uppercase tracking-[0.18em] text-[#C87D6B] underline underline-offset-4"
                  >
                    View Active Services
                  </Link>
                </div>
              ) : !user ? (
                /* Rule 2: Must be authenticated */
                <div className="bg-white border border-neutral-200 p-6 text-center space-y-4">
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Please sign in to your customer account to request an appointment for this service.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href={`/sign-in?callbackUrl=${encodeURIComponent(`/services/${service._id}`)}`}
                      className="bg-[#1E1E1E] text-white text-xs uppercase tracking-[0.2em] px-5 py-3 hover:bg-[#C87D6B] transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="border border-[#1E1E1E] text-[#1E1E1E] text-xs uppercase tracking-[0.2em] px-5 py-3 hover:border-[#C87D6B] hover:text-[#C87D6B] transition"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              ) : user.role === "admin" ? (
                /* Rule 3: Admins cannot submit customer appointment requests */
                <div className="bg-white border border-[#D4A5A5] p-6 space-y-2">
                  <div className="flex items-center gap-2 text-[#C87D6B] font-medium text-sm">
                    <ShieldAlert size={18} />
                    <span>Admin Account Restricted</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    You are signed in as an administrator. Admins cannot submit customer appointment requests.
                  </p>
                </div>
              ) : (
                /* Authenticated Customer Form */
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {bookingFeedback && (
                    <div
                      className={`p-4 text-xs leading-relaxed border flex items-start gap-2.5 ${
                        bookingFeedback.type === "success"
                          ? "bg-white border-emerald-600/40 text-emerald-900"
                          : "bg-white border-[#C87D6B] text-[#1E1E1E]"
                      }`}
                    >
                      {bookingFeedback.type === "success" ? (
                        <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={16} className="text-[#C87D6B] shrink-0 mt-0.5" />
                      )}
                      <span>{bookingFeedback.text}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-[0.18em] text-[#1E1E1E] mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#C87D6B] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.18em] text-[#1E1E1E] mb-1.5">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      required
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#C87D6B] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.18em] text-[#1E1E1E] mb-1.5">
                      Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any preferences, allergies, or special requests..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#C87D6B] transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1E1E1E] text-white text-xs uppercase tracking-[0.22em] py-4 hover:bg-[#C87D6B] disabled:opacity-60 transition cursor-pointer"
                  >
                    {submitting ? "Submitting Request..." : "Request Appointment"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}