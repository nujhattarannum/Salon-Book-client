
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Sparkles,
  ShieldCheck,
  Clock,
  Star,
  Scissors,
} from "lucide-react";

const values = [
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Self-Care First",
    description:
      "We believe beauty is more than appearance. Every appointment is an opportunity to relax, recharge, and feel your best.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Quality Experience",
    description:
      "From choosing your treatment to completing your appointment, we focus on making every step special.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Trusted Professionals",
    description:
      "We value professionalism, care, and attention to detail to help you enjoy a comfortable salon experience.",
  },
];

const features = [
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Easy Booking",
    description: "Book your favorite salon services whenever it suits you.",
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: "Selected Services",
    description: "Explore beauty and wellness treatments in one place.",
  },
  {
    icon: <Scissors className="h-5 w-5" />,
    title: "Personalized Care",
    description: "Find services that match your beauty and self-care needs.",
  },
];

const gallery = [
  {
    image:
      "https://sapsalon614.com/images/haircuts-styling.webp",
    title: "Professional Hair Styling",
    category: "Hair & Styling",
  },
  {
    image:
      "https://classpass-res.cloudinary.com/image/upload/f_auto/q_auto/xqhh0j352x9shosa83wa.jpg",
    title: "Relaxing Facial Treatments",
    category: "Skin Care",
  },
  {
    image:
      "https://files.autoblogging.ai/images/transform-your-look-at-melrose-heights-best-hair-salons%28gde9%29.jpg_01.jpeg",
    title: "A Beautiful Space",
    category: "Salon Experience",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-[#121212]">

      {/* HERO */}
      <section className="bg-[#f9f9f9]">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-20 text-center">

          <p className="text-[#c87d6b] text-xs uppercase tracking-[0.25em] mb-4">
            Discover SalonBook
          </p>

          <h1 className="font-editorial text-4xl md:text-6xl leading-tight">
            Beauty Begins
            <br />
            <span className="italic text-[#c87d6b]">
              With You.
            </span>
          </h1>

          <p className="max-w-xl mx-auto mt-5 text-neutral-600 text-sm leading-7">
            A little time for yourself can make a beautiful difference.
            SalonBook makes discovering and booking your favorite beauty
            treatments simple, comfortable, and convenient.
          </p>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 mt-7 bg-[#1e1e1e] text-white px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-[#c87d6b] transition-colors"
          >
            Explore Our Services
            <ArrowRight size={15} />
          </Link>

        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">

          {/* Image */}
          <div className="relative">
            <img
              src="https://files.autoblogging.ai/images/transform-your-look-at-melrose-heights-best-hair-salons%28gde9%29.jpg_01.jpeg"
              alt="Elegant modern salon interior"
              className="w-full h-[280px] md:h-[390px] object-cover"
            />

            <div className="absolute -bottom-4 -right-3 md:-right-4 bg-white shadow-md px-5 py-3">
              <p className="font-editorial text-xl italic text-[#c87d6b]">
                Feel beautiful.
              </p>
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1">
                Every single day
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="pt-4 md:pt-0">

            <p className="text-[#c87d6b] text-xs uppercase tracking-[0.2em] mb-4">
              Our Story
            </p>

            <h2 className="font-editorial text-3xl md:text-4xl leading-tight">
              Making Every Beauty Moment
              <span className="italic text-[#c87d6b]">
                {" "}More Meaningful.
              </span>
            </h2>

            <div className="w-12 h-px bg-[#c87d6b] my-5" />

            <p className="text-neutral-600 text-sm leading-7 mb-4">
              SalonBook was created with one simple idea: booking a salon
              appointment should be as enjoyable as the experience itself.
            </p>

            <p className="text-neutral-600 text-sm leading-7 mb-4">
              We bring salon services and appointment booking together
              in one convenient platform. Whether you are looking for a
              refreshing facial, a relaxing massage, or your next beauty
              treatment, discovering the right service is easier with SalonBook.
            </p>

            <p className="text-neutral-600 text-sm leading-7">
              Our goal is to give you more time to focus on yourself while
              making the booking process simple and organized.
            </p>

          </div>
        </div>
      </section>

      {/* IMAGE GALLERY */}
      <section className="bg-[#f9f9f9] py-14 md:py-18">
        <div className="max-w-6xl mx-auto px-5 md:px-10">

          <div className="text-center mb-9">
            <p className="text-[#c87d6b] text-xs uppercase tracking-[0.2em] mb-3">
              Beauty & Wellness
            </p>

            <h2 className="font-editorial text-3xl md:text-4xl">
              Our Beauty Experience
            </h2>

            <p className="text-neutral-500 text-sm mt-3 max-w-lg mx-auto">
              Discover a space where beauty, relaxation, and self-care
              come together.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {gallery.map((item, index) => (
              <div key={index} className="group overflow-hidden bg-white">
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-52 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="px-4 py-4">
                  <p className="text-[#c87d6b] text-[10px] uppercase tracking-[0.18em] mb-1">
                    {item.category}
                  </p>
                  <h3 className="font-editorial text-xl">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* OUR VALUES */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-10">

          <div className="text-center mb-10">
            <p className="text-[#c87d6b] text-xs uppercase tracking-[0.2em] mb-3">
              What Matters to Us
            </p>

            <h2 className="font-editorial text-3xl md:text-4xl">
              Our Values
            </h2>

            <p className="text-neutral-500 text-sm mt-4 max-w-lg mx-auto leading-7">
              Everything we do is guided by our commitment to making
              your salon experience more enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white border border-neutral-200 p-6 text-center hover:border-[#c87d6b]/50 transition-colors"
              >
                <div className="h-11 w-11 rounded-full bg-[#f2e9e6] text-[#c87d6b] flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>

                <h3 className="font-editorial text-xl mb-3">
                  {value.title}
                </h3>

                <p className="text-neutral-500 text-sm leading-7">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* WHY SALONBOOK */}
      <section className="bg-[#f9f9f9] py-14 md:py-18">
        <div className="max-w-6xl mx-auto px-5 md:px-10">

          <div className="text-center mb-10">
            <p className="text-[#c87d6b] text-xs uppercase tracking-[0.2em] mb-3">
              A Better Way to Book
            </p>

            <h2 className="font-editorial text-3xl md:text-4xl">
              Why Choose SalonBook?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center px-4">
                <div className="text-[#c87d6b] flex justify-center mb-4">
                  {feature.icon}
                </div>

                <h3 className="font-editorial text-xl mb-2">
                  {feature.title}
                </h3>

                <p className="text-neutral-500 text-sm leading-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#1e1e1e] text-white py-14 md:py-18">
        <div className="max-w-3xl mx-auto px-5 text-center">

          <p className="text-[#d4a5a5] text-xs uppercase tracking-[0.2em] mb-4">
            Your Moment Starts Here
          </p>

          <h2 className="font-editorial text-3xl md:text-5xl leading-tight">
            Ready to Make Time
            <br />
            for Yourself?
          </h2>

          <p className="text-neutral-400 text-sm leading-7 mt-4 max-w-lg mx-auto">
            Discover our salon services and find the perfect treatment
            for your next self-care moment.
          </p>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 mt-7 bg-[#c87d6b] text-white px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-white hover:text-[#1e1e1e] transition-colors"
          >
            Browse Services
            <ArrowRight size={15} />
          </Link>

        </div>
      </section>

    </main>
  );
}
