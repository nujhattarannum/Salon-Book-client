"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client"; // Adjust path to your Better Auth client
import { AlertCircle, CheckCircle2, Upload, Eye, EyeOff } from "lucide-react";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Profile image (URL or uploaded file)
  const [imageUrl, setImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must include at least one uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Password must include at least one lowercase letter.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setFeedback({ type: "error", text: passwordError });
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setFeedback({
        type: "error",
        text: "Password must be at least 6 characters with 1 uppercase and 1 lowercase letter.",
      });
      return;
    }

    setSubmitting(true);
 try {
      const { error } = await authClient.signUp.email({
        name: fullName.trim(),
        email: email.trim(),
        password,
        image: imageUrl.trim() || undefined,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (error) {
        toast.error(error.message || "Registration failed. Please check your details and try again.");
        return;
      }

      toast.success("Account created successfully! Redirecting...");

      setTimeout(() => {
        router.push("/services");
        router.refresh();
      }, 900);
    } catch {
      toast.error("An unexpected error occurred during registration.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setFeedback(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/services",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Google authentication could not be started.",
      });
      setGoogleLoading(false);
    }
  };

return (
    <main className="min-h-screen bg-[#F9F9F9] text-[#1E1E1E] flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-lg bg-[#FFFFFF] border border-neutral-200 p-8 md:p-11">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C87D6B] mb-2">
            Join SalonBook
          </p>
          <h1 className="font-editorial text-4xl md:text-5xl text-[#1E1E1E]">
            Create Account
          </h1>
          <p className="text-xs text-neutral-500 mt-2.5">
            Book curated beauty treatments and manage your appointments.
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-6 p-4 text-xs leading-relaxed border flex items-start gap-2.5 ${
              feedback.type === "success"
                ? "bg-[#F9F9F9] border-emerald-700/40 text-emerald-900"
                : "bg-[#F9F9F9] border-[#C87D6B] text-[#1E1E1E]"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={16} className="text-[#C87D6B] shrink-0 mt-0.5" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleRegister} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#C87D6B] transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.18em] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="off"
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
                autoComplete="new-password"
                placeholder="Min 6 chars, 1 uppercase & 1 lowercase"
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
            <p className="text-[11px] text-neutral-500 mt-1.5">
              Must contain at least 6 characters, one uppercase letter, and one lowercase letter.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.18em] mb-1.5">
              Profile Image URL (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="url"
                placeholder="https://example.com/your-photo.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-[#FFFFFF] border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#C87D6B] transition"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-11 h-11 object-cover border border-[#D4A5A5] shrink-0"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-[#1E1E1E] text-white text-xs uppercase tracking-[0.22em] py-4 hover:bg-[#C87D6B] disabled:opacity-60 transition cursor-pointer"
          >
            {submitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">or</span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="w-full border border-[#1E1E1E] bg-[#FFFFFF] text-[#1E1E1E] text-xs uppercase tracking-[0.2em] py-3.5 hover:border-[#C87D6B] hover:text-[#C87D6B] disabled:opacity-60 transition cursor-pointer"
        >
          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <p className="text-center text-xs text-neutral-500 mt-7">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-[#1E1E1E] font-medium underline underline-offset-4 hover:text-[#C87D6B]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}