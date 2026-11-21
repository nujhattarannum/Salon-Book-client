
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  UserRound,
  ChevronDown,
  CalendarDays,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter();

  const user = session?.user;

  // Sign Out
  const handleSignOut = async () => {
    await authClient.signOut();

    setProfileOpen(false);
    setMenuOpen(false);

    router.push("/");
    router.refresh();
  };

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

            {!isPending && (
              user ? (

                /* Logged In User */
                <div className="relative">

                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2"
                  >

                    {/* Profile Picture */}
                    <div className="w-10 h-10 rounded-full bg-[#F5E8E4] text-[#C87D6B] flex items-center justify-center overflow-hidden">

                      {user.image ? (
                        <img
                          src={user.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserRound size={21} />
                      )}

                    </div>

                    <span className="text-sm font-medium">
                      {user.name || "My Account"}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />

                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (

                    <div className="absolute right-0 top-14 w-60 bg-white border border-neutral-100 shadow-xl rounded-md py-2">

                      {/* User Information */}
                      <div className="px-4 py-3 border-b border-neutral-100">

                        <p className="font-medium text-sm">
                          {user.name}
                        </p>

                        <p className="text-xs text-neutral-500 mt-1">
                          {user.email}
                        </p>

                      </div>

                      {/* My Profile */}
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-50 transition"
                      >
                        <UserRound size={17} />
                        My Profile
                      </Link>

                      {/* My Bookings */}
                      <Link
                        href="/myBookings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-50 transition"
                      >
                        <CalendarDays size={17} />
                        My Bookings
                      </Link>

                      {/* Sign Out */}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-neutral-50 transition"
                      >
                        <LogOut size={17} />
                        Sign Out
                      </button>

                    </div>

                  )}

                </div>

              ) : (

                /* Not Logged In */
                <>
                  <Link
                    href="/signIn"
                    className="text-sm hover:text-[#C87D6B] transition"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signUp"
                    className="bg-[#C87D6B] text-white px-6 py-3 text-sm rounded-sm hover:bg-[#b56c5b] transition"
                  >
                    Sign Up
                  </Link>
                </>

              )
            )}

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

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
            >
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

            {!isPending && (
              user ? (

                <>
                  {/* Mobile User Info */}
                  <div className="flex items-center gap-3 border-t pt-4">

                    <div className="w-10 h-10 rounded-full bg-[#F5E8E4] text-[#C87D6B] flex items-center justify-center overflow-hidden">

                      {user.image ? (
                        <img
                          src={user.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserRound size={21} />
                      )}

                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {user.name}
                      </p>

                      <p className="text-xs text-neutral-500">
                        {user.email}
                      </p>
                    </div>

                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>

                  <Link
                    href="/myBookings"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Bookings
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="text-left text-red-500"
                  >
                    Sign Out
                  </button>

                </>

              ) : (

                <>
                  <Link
                    href="/signIn"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signUp"
                    onClick={() => setMenuOpen(false)}
                    className="bg-[#C87D6B] text-white text-center py-3"
                  >
                    Sign Up
                  </Link>
                </>

              )
            )}

          </div>

        )}

      </nav>

    </header>
  );
};

export default Navbar;
