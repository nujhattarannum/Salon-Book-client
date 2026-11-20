import Hero from "@/components/homepage/Hero";
import FeaturedSalonServices from "@/components/homepage/FeaturedSalonServices";
import SalonServiceCategories from "@/components/homepage/SalonServiceCategories";
import WhyChooseSalonBook from "@/components/homepage/WhyChooseSalonBook";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <main>
       <Hero/>
       <FeaturedSalonServices/>
       <SalonServiceCategories/>
       <WhyChooseSalonBook/>
    </main>
   </div>
  );
}
