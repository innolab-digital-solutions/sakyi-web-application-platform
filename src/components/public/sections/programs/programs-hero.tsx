"use client";

import { ChevronDown, Heart, Sparkles } from "lucide-react";

import { smoothScrollTo } from "@/utils/smooth-scroll";

export default function ProgramsHero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Content Layout */}
        <div className="text-center" data-aos="zoom-in" data-aos-duration="1200" data-aos-easing="ease-out-cubic">
          {/* Badge */}
          <div 
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2 text-sm font-medium text-[#35bec5]"
            data-aos="slide-down"
            data-aos-delay="200"
            data-aos-duration="800"
            data-aos-easing="ease-out-back"
          >
            <Sparkles className="h-4 w-4" />
            <span style={{ fontFamily: "Inter, sans-serif" }}>Wellness Programs</span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
            data-aos-duration="800"
          >
            Our{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Wellness Programs
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
              Explore our carefully curated wellness programs, crafted by health experts to support your journey 
  towards better fitness, nutrition, and overall well-being, personalized to fit your lifestyle.
          </p>

          {/* CTA Button */}
               <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" data-aos="fade-up" data-aos-delay="400">
            <button
              onClick={() => smoothScrollTo('programs', 80)}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Heart className="h-5 w-5" />
              Explore All Programs
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
