import { ArrowRight, Calendar, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

import CallToAction from "@/components/public/sections/call-to-action";
import ProgramsExplore from "@/components/public/sections/programs/programs-explore";
import ProgramsFAQ from "@/components/public/sections/programs/programs-faq";
import ProgramsHero from "@/components/public/sections/programs/programs-hero";
import ProgramsHowItWorks from "@/components/public/sections/programs/programs-how-it-works";
import ProgramsPersonalized from "@/components/public/sections/programs/programs-personalized";
import ProgramsWhyChoose from "@/components/public/sections/programs/programs-why-choose";

export default function ProgramsPage() {
  return (
    <>
      <ProgramsHero />

      <ProgramsExplore />

      <ProgramsPersonalized />

      <ProgramsWhyChoose />

      <ProgramsHowItWorks />

      <ProgramsFAQ />

      <CallToAction
        title="Ready to Choose Your Perfect Program?"
        description="You've seen our comprehensive wellness programs. Now it's time to take action. Get a personalized recommendation or schedule a free consultation to find the program that's right for you."
        actions={
          <>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Play className="mr-2 h-5 w-5" />
              <span className="relative z-10">Get Personalized Plan</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Calendar className="mr-2 h-5 w-5" />
              <span>Book Free Consultation</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </>
  );
}
