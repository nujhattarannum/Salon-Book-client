"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">

      <nav className="max-w-[1450px] mx-auto px-6 md:px-12 py-4">

        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">

            <span className="font-editorial text-3xl md:text-4xl tracking-tight">
              Salon
              <span className="text-[#C87D6B]">Book</span>
            </span>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">

            <Link
              href="/"
              className="text-sm hover:text-[#C87D6B] transition"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="text-sm hover:text-[#C87D6B] transition"
            >
              Browse Services
            </Link>

            <Link
              href="/about"
              className="text-sm hover:text-[#C87D6B] transition"
            >
              About
            </Link>

          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-5">

            <button
              aria-label="Search"
              className="hover:text-[#C87D6B] transition"
            >
              <Search size={20} />
            </button>

            <div className="h-6 w-px bg-neutral-300" />

            <Link
              href="/login"
              className="text-sm hover:text-[#C87D6B] transition"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="bg-[#C87D6B] text-white px-6 py-3 text-sm rounded-sm hover:bg-[#b56c5b] transition"
            >
              Sign Up
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-5 border-t pt-5 flex flex-col gap-5">

            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link
              href="/services"
              onClick={() => setMenuOpen(false)}
            >
              Browse Services
            </Link>

            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="bg-[#C87D6B] text-white text-center py-3"
            >
              Sign Up
            </Link>

          </div>
        )}

      </nav>

    </header>
  );
};

export default Navbar;
