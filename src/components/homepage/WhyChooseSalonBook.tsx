import Link from "next/link";
import {
  CalendarDays,
  ShieldCheck,
  CreditCard,
  Heart,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: CalendarDays,
    title: "Easy Booking",
    description: "Book in just a few clicks",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Salons",
    description: "Find your perfect salon",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Convenient online payments",
  },
  {
    icon: Heart,
    title: "Self-Care First",
    description: "Because you deserve it",
  },
];

const WhyChooseSalonBook = () => {
  return (
    <section className="bg-[#1E1E1E] text-white">

      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Left */}
        <div className="px-6 md:px-12 lg:px-16 py-14 md:py-16 flex flex-col justify-center">

          <h2 className="font-editorial text-4xl md:text-5xl mb-9">

            Why Choose
            <span className="text-[#C87D6B]"> SalonBook?</span>

          </h2>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">

            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >

                  <Icon
                    size={30}
                    className="text-[#C87D6B] shrink-0"
                    strokeWidth={1.5}
                  />

                  <div>

                    <h3 className="font-editorial text-lg">
                      {benefit.title}
                    </h3>

                    <p className="text-xs text-neutral-400 mt-1 leading-5">
                      {benefit.description}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-[#C87D6B] text-white px-6 py-3 mt-9 w-fit text-sm hover:bg-[#b56c5b] transition"
          >
            Explore All Services
            <ArrowRight size={16} />
          </Link>

        </div>

        {/* Right Image */}
        <div className="relative min-h-[350px] lg:min-h-[450px]">

          <img
            src="https://images.unsplash.com/photo-1600948836101-fb0b5d6e1d9f?auto=format&fit=crop&w=1400&q=90"
            alt="Modern salon interior"
            className="absolute inset-0 w-full h-full object-cover"
          />

        </div>

      </div>

    </section>
  );
};

export default WhyChooseSalonBook;