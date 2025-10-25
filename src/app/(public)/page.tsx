"use client";

import "aos/dist/aos.css";

import AOS from "aos";
import { useEffect } from "react";

import Footer from "@/components/public/layout/footer";
import Navbar from "@/components/public/layout/navbar";
import AboutPreview from "@/components/public/sections/home/about-preview";
import ArticleInsights from "@/components/public/sections/home/article-insights";
import CallToAction from "@/components/public/sections/home/call-to-action";
import Hero from "@/components/public/sections/home/hero";
import HowItWorks from "@/components/public/sections/home/how-it-works";
import MobileApp from "@/components/public/sections/home/mobile-app";
import OurPrograms from "@/components/public/sections/home/our-programs";
import Testimonials from "@/components/public/sections/home/testimonials";

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <Hero />

      <AboutPreview />

      <OurPrograms />

      <HowItWorks />

      <MobileApp />

      <Testimonials />

      <ArticleInsights />

      <CallToAction />

      <Footer />
    </div>
  );
}
