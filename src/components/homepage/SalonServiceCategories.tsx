"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Palette,
  Sparkles,
  Flower2,
  Brush,
  Hand,
  Heart,
  ArrowUpRight,
} from "lucide-react";

interface SalonService {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  image: string;
  isActive: boolean;
}
const categoryIcons: Record<string, React.ElementType> = {
  "Haircut & Styling": Scissors,
  "Hair Coloring": Palette,
  "Hair Treatment": Sparkles,
  "Facial & Skincare": Flower2,
  "Makeup": Brush,
  "Manicure & Pedicure": Hand,
  "Spa & Massage": Heart,
};

const SalonServiceCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/services");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        const serviceList : SalonService[] = Array.isArray(data)
          ? data
          : data.services || [];

        // Only get categories from active services
     const activeServices = serviceList.filter(
  (service) => service.isActive === true
);

        // Extract unique categories
        const uniqueCategories : string[] = [
          ...new Set(
            activeServices.map(
              (service: { category: string }) => service.category
            )
          ),
        ];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Category fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="bg-[#F9F9F9] py-20">

      <div className="max-w-[1450px] mx-auto px-6 md:px-12">

        {/* Heading */}
        <div className="text-center mb-14">

          <div className="flex items-center justify-center gap-4">

            <span className="w-12 md:w-20 h-px bg-neutral-400" />

            <p className="uppercase tracking-[0.25em] text-xs text-[#C87D6B]">
              Discover Your Beauty
            </p>

            <span className="w-12 md:w-20 h-px bg-neutral-400" />

          </div>

          <h2 className="font-editorial text-4xl md:text-6xl mt-4">
            Explore by Category
          </h2>

          <p className="text-neutral-500 mt-4 text-sm md:text-base">
            Find the perfect service for your next beauty moment.
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center gap-5 flex-wrap">

            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse w-40 h-48 bg-neutral-200"
              />
            ))}

          </div>
        )}

        {/* Categories */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">

            {categories.map((category) => {
              const Icon = categoryIcons[category] || Sparkles;

              return (
                <Link
                  key={category}
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="group bg-white border border-neutral-200 p-6 md:p-8 flex flex-col items-center text-center hover:border-[#C87D6B] hover:shadow-md transition duration-300"
                >

                  {/* Icon */}
                  <div className="w-16 h-16 flex items-center justify-center bg-[#F9F9F9] group-hover:bg-[#D4A5A5] transition">

                    <Icon
                      size={28}
                      strokeWidth={1.4}
                      className="text-[#1E1E1E]"
                    />

                  </div>

                  {/* Category Name */}
                  <h3 className="font-editorial text-lg mt-5 leading-tight">
                    {category}
                  </h3>

                  {/* Arrow */}
                  <ArrowUpRight
                    size={17}
                    className="mt-4 text-[#C87D6B] group-hover:translate-x-1 group-hover:-translate-y-1 transition"
                  />

                </Link>
              );
            })}

          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <p className="text-center text-neutral-500 py-10">
            Categories will appear once services are available.
          </p>
        )}

      </div>

    </section>
  );
};

export default SalonServiceCategories;