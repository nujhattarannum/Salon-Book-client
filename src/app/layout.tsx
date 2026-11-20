import type { Metadata } from "next";
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
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}