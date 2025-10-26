"use client";

import { ArrowRight, Shield } from "lucide-react";
import { useState } from "react";

import ProgramCard from "@/components/public/shared/program-card";

// Dummy program data - simulating 8 programs total
const programs = [
  {
    title: "Mental Wellness Program",
    description: "Comprehensive mental health support with personalized therapy sessions, mindfulness training, and stress management techniques.",
    image: "/images/program-1.jpg",
    href: "/programs/mental-wellness"
  },
  {
    title: "Nutrition & Lifestyle Program",
    description: "Transform your eating habits and lifestyle with personalized meal plans, nutrition coaching, and sustainable habit building.",
    image: "/images/program-2.jpg",
    href: "/programs/nutrition-lifestyle"
  },
  {
    title: "Fitness & Movement Program",
    description: "Build strength, flexibility, and endurance with personalized workout plans, movement therapy, and injury prevention.",
    image: "/images/program-3.jpg",
    href: "/programs/fitness-movement"
  },
  {
    title: "Weight Management Program",
    description: "Achieve sustainable weight loss with personalized nutrition plans, exercise routines, and lifestyle modifications.",
    image: "/images/program-4.jpg",
    href: "/programs/weight-management"
  },
  {
    title: "Stress Management Program",
    description: "Learn effective stress reduction techniques, mindfulness practices, and resilience building strategies.",
    image: "/images/program-5.jpg",
    href: "/programs/stress-management"
  },
  {
    title: "Sleep Optimization Program",
    description: "Improve sleep quality and establish healthy sleep habits with personalized sleep hygiene strategies.",
    image: "/images/program-6.jpg",
    href: "/programs/sleep-optimization"
  },
  {
    title: "Chronic Disease Management",
    description: "Comprehensive support for managing chronic conditions with personalized care plans and lifestyle interventions.",
    image: "/images/program-7.jpg",
    href: "/programs/chronic-disease-management"
  },
  {
    title: "Preventive Health Program",
    description: "Proactive health maintenance with regular check-ups, health screenings, and preventive care strategies.",
    image: "/images/program-8.jpg",
    href: "/programs/preventive-health"
  }
];

export default function ProgramsExplore() {
  const [showAll, setShowAll] = useState(false);
  const initialPrograms = 4;
  const displayedPrograms = showAll ? programs : programs.slice(0, initialPrograms);

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2
            className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Explore Our{" "}
            <span
              className="text-brand-gradient bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Programs
            </span>
          </h2>
          <p
            className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Choose from our comprehensive range of wellness programs, each designed by certified doctors 
            and tailored to help you achieve your specific health and wellness goals.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {displayedPrograms.map((program, index) => (
            <ProgramCard
              key={index}
              program={program}
              index={index}
            />
          ))}
        </div>

        {/* Show More / Show Less Button */}
        {programs.length > initialPrograms && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-[#35bec5] bg-white px-8 py-4 text-[#35bec5] font-semibold transition-all duration-300 hover:bg-[#35bec5] hover:text-white hover:shadow-lg hover:scale-105"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <Shield className="h-5 w-5" />
              {showAll ? `Show Less` : `Show All ${programs.length} Programs`}
              <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${showAll ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
