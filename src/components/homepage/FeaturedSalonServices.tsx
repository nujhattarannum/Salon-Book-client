"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SalonCard from "../shared/SalonCard";
import { ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { SalonServiceItem } from "@/types/salon";

const FeaturedSalonServices = () => {
  const [services, setServices] = useState<SalonServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiRequest<
          { services: SalonServiceItem[] } | SalonServiceItem[]
        >("/services");

        // Supports either an array or an object containing services
        const serviceList = Array.isArray(res)
          ? res
          : res.services || [];

        // Only active services
        const activeServices = serviceList.filter(
          (service: SalonServiceItem) => service.isActive === true
        );

        setServices(activeServices.slice(0, 6));
      } catch (err) {
        console.error(err);
        setError("Unable to load services right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="bg-white py-20">

      <div className="max-w-[1450px] mx-auto px-6 md:px-12">

        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12">

          <div className="flex items-center gap-4">

            <span className="w-12 md:w-20 h-px bg-[#C87D6B]" />

            <p className="text-[#C87D6B] text-xs uppercase tracking-[0.25em]">
              Curated for You
            </p>

            <span className="w-12 md:w-20 h-px bg-[#C87D6B]" />

          </div>

          <h2 className="font-editorial text-4xl md:text-6xl font-normal mt-4">
            Featured Salon Services
          </h2>

          <p className="text-neutral-500 text-sm md:text-base mt-4 max-w-xl leading-7">
            Discover the beauty treatments everyone is loving.
            Your next little moment of self-care starts here.
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse border border-neutral-200"
              >
                <div className="h-56 bg-neutral-200" />

                <div className="p-5 space-y-3">
                  <div className="h-5 bg-neutral-200 w-3/4" />
                  <div className="h-4 bg-neutral-200 w-full" />
                  <div className="h-4 bg-neutral-200 w-1/2" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-center text-red-500 py-10">
            {error}
          </p>
        )}

        {/* Services */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {services.map((service) => (
              <SalonCard
                key={service._id}
                service={service}
              />
            ))}

          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center py-16">

            <h3 className="font-editorial text-3xl">
              No featured services yet
            </h3>

            <p className="text-neutral-500 mt-3">
              New beauty experiences will be coming soon.
            </p>

          </div>
        )}

        {/* View All */}
        <div className="flex justify-center mt-12">

          <Link
            href="/services"
            className="inline-flex items-center gap-3 bg-[#1E1E1E] text-white px-7 py-4 text-sm hover:bg-[#C87D6B] transition"
          >
            Explore All Services
            <ArrowRight size={17} />
          </Link>

        </div>

      </div>

    </section>
  );
};

export default FeaturedSalonServices;