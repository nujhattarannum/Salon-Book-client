import Hero from "@/components/homepage/Hero";
import PopularServices from "@/components/homepage/PopularServices";
import WhyChooseSalonBook from "@/components/homepage/WhyChooseSalonBook";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <Navbar/>
    <main>
       <Hero/>
       <PopularServices/>
       <WhyChooseSalonBook/>
    </main>
    <Footer/>
   </div>
  );
}
