"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import SalonCard from "@/components/shared/SalonCard";

import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from "lucide-react";
import { SalonServiceItem } from "@/types/salon";

const BrowseServicesContent = () => {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [services, setServices] = useState<SalonServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Category filter
  const [manualCategory, setManualCategory] = useState<string | null>(null);
  const selectedCategory = manualCategory ?? urlCategory ?? "All Categories";

  // Price sorting
  const [sortOption, setSortOption] = useState("default");

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:8000/services");

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await res.json();

        const serviceList: SalonServiceItem[] = Array.isArray(data)
          ? data
          : data.services || [];

        // Only active services
        const activeServices = serviceList.filter(
          (service) => service.isActive === true
        );

        setServices(activeServices);

      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Unable to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get unique categories
  const categories = [
    ...new Set(services.map((service) => service.category)),
  ];

  // Search + Filter
  let filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sorting
  if (sortOption === "lowToHigh") {
    filteredServices = [...filteredServices].sort(
      (a, b) => a.price - b.price
    );
  }

  if (sortOption === "highToLow") {
    filteredServices = [...filteredServices].sort(
      (a, b) => b.price - a.price
    );
  }

  // Clear Filters
  const clearFilters = () => {
    setSearchTerm("");
    setManualCategory("All Categories");
    setSortOption("default");

    window.history.replaceState({}, "", "/services");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "All Categories" ||
    sortOption !== "default";

  return (
    <main className="bg-white min-h-screen">


      {/* Page Header */}
     <section className="bg-[#f9f9f9] py-10 md:py-14">
  <div className="max-w-[1250px] mx-auto px-6 md:px-12 text-center">

    <p className="text-[#c87d6b] text-[10px] md:text-xs uppercase tracking-[0.25em] mb-3">
      Discover Your Beauty
    </p>

    <h1 className="font-editorial text-3xl md:text-5xl leading-tight">
      Browse Our <span className="italic text-[#c87d6b]">Services</span>
    </h1>

    <p className="max-w-xl mx-auto mt-3 text-neutral-600 text-sm leading-6">
      Explore our salon treatments and find the perfect service for your next self-care moment.
    </p>

  </div>
</section>
      {/* Services Section */}
      <section className="py-16 md:py-20">

        <div className="max-w-[1450px] mx-auto px-6 md:px-12">

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between mb-10">

            {/* Search */}
            <div className="relative w-full lg:max-w-md">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-neutral-200 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-[#C87D6B] transition"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category */}
              <div className="relative">

                <SlidersHorizontal
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full sm:w-[230px] appearance-none border border-neutral-200 bg-white pl-11 pr-5 py-3.5 text-sm outline-none focus:border-[#C87D6B] cursor-pointer"
                >

                  <option value="All Categories">
                    All Categories
                  </option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">

                <ArrowUpDown
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                />

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full sm:w-[220px] appearance-none border border-neutral-200 bg-white pl-11 pr-5 py-3.5 text-sm outline-none focus:border-[#C87D6B] cursor-pointer"
                >

                  <option value="default">
                    Sort by Price
                  </option>

                  <option value="lowToHigh">
                    Price: Low to High
                  </option>

                  <option value="highToLow">
                    Price: High to Low
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-5 mb-8">

            <p className="text-sm text-neutral-500">
              Showing{" "}
              <span className="text-[#1E1E1E] font-medium">
                {filteredServices.length}
              </span>{" "}
              services
            </p>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-[#C87D6B] hover:text-[#1E1E1E] transition"
              >
                Clear Filters
                <X size={15} />
              </button>
            )}
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
            <div className="text-center py-20">

              <h2 className="font-editorial text-3xl">
                Something went wrong
              </h2>

              <p className="text-neutral-500 mt-3">
                {error}
              </p>
            </div>
          )}

          {/* Service Cards */}
          {!loading && !error && filteredServices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredServices.map((service) => (
                <SalonCard
                  key={service._id}
                  service={service}
                />
              ))}
            </div>
          )}

          {/* Empty Results */}
          {!loading && !error && filteredServices.length === 0 && (
            <div className="text-center py-20">

              <div className="w-16 h-16 border border-neutral-200 flex items-center justify-center mx-auto mb-5">

                <Search
                  size={25}
                  className="text-neutral-400"
                />
              </div>

              <h2 className="font-editorial text-3xl">
                No Services Found
              </h2>

              <p className="text-neutral-500 text-sm mt-3">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 bg-[#1E1E1E] text-white px-6 py-3 text-sm hover:bg-[#C87D6B] transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Small CTA */}
      <section className="bg-[#1E1E1E] text-white py-16">

        <div className="max-w-[1450px] mx-auto px-6 md:px-12 text-center">

          <h2 className="font-editorial text-4xl md:text-5xl">
            Your next beauty moment awaits.
          </h2>

          <p className="text-neutral-400 text-sm mt-4">
            Discover your favorite treatments and make time for yourself.
          </p>

          <Link
            href="/"
            className="inline-block mt-7 border border-white/40 px-7 py-3 text-sm hover:bg-[#C87D6B] hover:border-[#C87D6B] transition"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
};

const BrowseServicesPage = () => {
  return (
    <Suspense fallback={<div className="bg-white min-h-screen" />}>
      <BrowseServicesContent />
    </Suspense>
  );
};

export default BrowseServicesPage;