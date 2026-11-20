import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#F9F9F9]">

      <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

        {/* Left Content */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:pl-20 py-16 lg:py-20 z-10">

          <p className="uppercase tracking-[0.25em] text-xs mb-6 text-[#C87D6B]">
            Look good · Feel amazing
          </p>

          <h1 className="font-editorial text-5xl md:text-6xl lg:text-[76px] leading-[1.08] font-normal">

            Book Your
            <br />

            Beauty Appointment

            <br />

            <span className="italic text-[#C87D6B]">
              with SalonBook
            </span>

          </h1>

          <p className="text-neutral-600 mt-7 text-sm md:text-base leading-7 max-w-md">

            Premium salon services at your fingertips.
            Hair, skin, nails and more — all in one place.

          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">

            <Link
              href="/services"
              className="bg-[#C87D6B] text-white px-7 py-3.5 rounded-sm text-sm flex items-center gap-2 hover:bg-[#b56c5b] transition"
            >
              Explore Services
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/about"
              className="border border-[#1E1E1E] px-7 py-3.5 rounded-sm text-sm hover:bg-[#1E1E1E] hover:text-white transition"
            >
              About Us
            </Link>

          </div>

        </div>

        {/* Right Image */}
        <div className="relative min-h-[420px] lg:min-h-full">

          <div className="absolute inset-0 bg-[#D4A5A5]/30 rounded-tl-[250px] lg:rounded-tl-[400px]" />

          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=90"
            alt="Beauty and fashion portrait"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Editorial Message */}
          <div className="absolute bottom-10 right-6 md:right-12 bg-white/90 backdrop-blur-sm p-5 md:p-7 max-w-[220px]">

            <p className="font-editorial italic text-2xl md:text-3xl leading-tight">
              Self Care
              <br />
              Looks Good
              <br />
              On You.
            </p>

            <div className="w-12 h-px bg-[#C87D6B] mt-5" />

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;