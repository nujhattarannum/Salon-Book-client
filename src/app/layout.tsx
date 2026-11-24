import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import PublicShell from "@/components/shared/PublicShell";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-editorial",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SalonBook | Beauty, Your Way",
  description:
    "Discover and book your favorite salon services with SalonBook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodoni.variable} ${manrope.variable}`}>
       <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#FFFFFF",
              color: "#1E1E1E",
              border: "1px solid #E5E5E5",
              borderRadius: "0px",
              fontSize: "12px",
              letterSpacing: "0.04em",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#1E1E1E",
                secondary: "#FFFFFF",
              },
            },
            error: {
              style: {
                border: "1px solid #C87D6B",
              },
              iconTheme: {
                primary: "#C87D6B",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
      <PublicShell>
        {children}
       </PublicShell>
      </body>
    </html>
  );
}