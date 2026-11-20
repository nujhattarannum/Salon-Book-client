import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface SalonService {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  image: string;
  isActive: boolean;
}

interface SalonCardProps {
  service: SalonService;
}

const SalonCard = ({ service }: SalonCardProps) => {
  return (
    <div className="group bg-white border border-neutral-200 overflow-hidden hover:shadow-lg transition duration-300">

      {/* Service Image */}
      <div className="relative overflow-hidden h-56">

        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs tracking-wide">
          {service.category}
        </span>

      </div>

      {/* Card Content */}
      <div className="p-5">

        {/* Name */}
        <h3 className="font-editorial text-2xl leading-tight">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-500 mt-2 line-clamp-2 leading-6">
          {service.description}
        </p>

        {/* Price & Duration */}
        <div className="flex items-center justify-between mt-5">

          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Price
            </p>

            <p className="text-lg font-medium mt-1">
              ৳{service.price}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Duration
            </p>

            <p className="text-sm mt-1">
              {service.duration} min
            </p>
          </div>

        </div>

        {/* View Details Button */}
        <Link
          href={`/services/${service._id}`}
          className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm group/link"
        >

          <span className="group-hover/link:text-[#C87D6B] transition">
            View Details
          </span>

          <span className="w-9 h-9 border border-neutral-300 flex items-center justify-center group-hover/link:bg-[#C87D6B] group-hover/link:border-[#C87D6B] group-hover/link:text-white transition">

            <ArrowUpRight size={17} />

          </span>

        </Link>

      </div>

    </div>
  );
};

export default SalonCard;