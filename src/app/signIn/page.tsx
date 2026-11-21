"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; // Adjust path to your Better Auth client
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface UserWithRole {
  role?: string;
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const getRedirectPathByRole = (role?: string) => {
    if (role === "admin") {
      return "/dashboard/admin";
    }
    if (callbackUrl && callbackUrl.startsWith("/")) {
      return callbackUrl;
    }
    return "/services";
  };

  const handleCredentialSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password. Please try again.");
        return;
      }

      // Fetch active session to read the user's assigned role reliably
      const sessionRes = await authClient.getSession();
      const role =
        (sessionRes?.data?.user as UserWithRole | undefined)?.role ||
        (data?.user as UserWithRole | undefined)?.role;

      const destination = getRedirectPathByRole(role);

      toast.success("Signed in successfully! Redirecting...");

      setTimeout(() => {
        router.push(destination);
        router.refresh();
      }, 700);
    } catch {
      toast.error("Unable to sign in right now. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/services",
      });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9] text-[#1E1E1E] flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-neutral-200 p-8 md:p-11">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C87D6B] mb-2">
            Welcome Back
          </p>
          <h1 className="font-editorial text-4xl md:text-5xl text-[#1E1E1E]">
            Sign In
          </h1>
          <p className="text-xs text-neutral-500 mt-2.5">
            Access your SalonBook account and appointments.
          </p>
        </div>

        <form onSubmit={handleCredentialSignIn} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#C87D6B] transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.18em] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-neutral-300 pl-4 pr-11 py-3 text-sm outline-none focus:border-[#C87D6B] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#1E1E1E]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-[#1E1E1E] text-white text-xs uppercase tracking-[0.22em] py-4 hover:bg-[#C87D6B] disabled:opacity-60 transition cursor-pointer"
          >
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">or</span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full border border-[#1E1E1E] bg-[#FFFFFF] text-[#1E1E1E] text-xs uppercase tracking-[0.2em] py-3.5 hover:border-[#C87D6B] hover:text-[#C87D6B] disabled:opacity-60 transition cursor-pointer"
        >
          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <p className="text-center text-xs text-neutral-500 mt-7">
          New to SalonBook?{" "}
          <Link
            href="/sign-up"
            className="text-[#1E1E1E] font-medium underline underline-offset-4 hover:text-[#C87D6B]"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
            Loading...
          </p>
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}