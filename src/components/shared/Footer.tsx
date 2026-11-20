import Link from "next/link";
import {
  Music2,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] text-white">

      {/* Main Footer */}
      <div className="max-w-[1450px] mx-auto px-6 md:px-12 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div>

            <Link href="/" className="font-editorial text-3xl">

              Salon
              <span className="text-[#C87D6B]">Book</span>

            </Link>

            <p className="text-sm text-neutral-400 mt-3">
              Look good. Feel amazing.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">

              <Link href="#" aria-label="Instagram">
                <FaInstagram size={18} className="hover:text-[#C87D6B] transition" />
              </Link>

              <Link href="#" aria-label="Facebook">
                <FaFacebookF size={18} className="hover:text-[#C87D6B] transition" />
              </Link>

              <Link href="#" aria-label="YouTube">
                <FaYoutube size={18} className="hover:text-[#C87D6B] transition" />
              </Link>

              <Link href="#" aria-label="TikTok">
                <Music2 size={18} className="hover:text-[#C87D6B] transition" />
              </Link>

            </div>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="font-editorial text-xl mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm text-neutral-400">

              <Link href="/" className="hover:text-white transition">
                Home
              </Link>

              <Link href="/services" className="hover:text-white transition">
                Browse Services
              </Link>

              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>

              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>

            </div>

          </div>

          {/* Contact */}
          <div>

            <h3 className="font-editorial text-xl mb-4">
              Contact Us
            </h3>

            <div className="flex flex-col gap-4 text-sm text-neutral-400">

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#C87D6B]" />
                <span>+880 123 456 789</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#C87D6B]" />
                <span>hello@salonbook.com</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C87D6B] shrink-0" />
                <span>123 Beauty Street, Dhaka</span>
              </div>

            </div>

          </div>

          {/* Opening Hours */}
          <div>

            <h3 className="font-editorial text-xl mb-4">
              Opening Hours
            </h3>

            <div className="flex flex-col gap-3 text-sm text-neutral-400">

              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#C87D6B]" />
                <span>Mon - Sat: 9AM - 9PM</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#C87D6B]" />
                <span>Sun: 10AM - 6PM</span>
              </div>

            </div>

          </div>

          {/* Newsletter */}
          <div>

            <h3 className="font-editorial text-xl mb-4">
              Stay Updated
            </h3>

            <p className="text-sm text-neutral-400 mb-4">
              Get the latest beauty tips and offers.
            </p>

            <form className="flex flex-col sm:flex-row gap-2">

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white text-[#1E1E1E] text-sm outline-none"
              />

              <button
                type="button"
                className="bg-[#C87D6B] px-5 py-3 text-sm hover:bg-[#b56c5b] transition"
              >
                Subscribe
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">

        <div className="max-w-[1450px] mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row justify-between gap-4 text-xs text-neutral-400">

          <p>
            © 2026 SalonBook. All rights reserved.
          </p>

          <div className="flex gap-4">

            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>

            <span>|</span>

            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;