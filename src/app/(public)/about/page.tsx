import { ArrowRight, ChevronRight, Globe, Mail } from "lucide-react";
import Link from "next/link";

import AboutApproach from "@/components/public/sections/about/about-approach";
import AboutHero from "@/components/public/sections/about/about-hero";
import AboutImpact from "@/components/public/sections/about/about-impact";
import AboutMission from "@/components/public/sections/about/about-mission";
import AboutTeam from "@/components/public/sections/about/about-team";
import CallToAction from "@/components/public/sections/call-to-action";

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <AboutMission />

      <AboutApproach />

      <AboutTeam />

      <AboutImpact />

      <CallToAction
        title="Ready to Start Your Wellness Journey?"
        description="  Join thousands of people who have transformed their lives with our personalized wellness programs. Your journey to optimal health starts here."
        actions={
          <>
            <Link
              href="#programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Globe className="mr-2 h-5 w-5" />
              <span className="relative z-10">Explore Programs</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Mail className="mr-2 h-5 w-5" />
              <span> Get Free Consultation</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </>
  );
}
