import { ArrowRight, ChevronRight, Heart, Mail } from "lucide-react";
import Link from "next/link";

import CallToAction from "@/components/public/sections/call-to-action";
import AboutPreview from "@/components/public/sections/home/about-preview";
import ArticleInsights from "@/components/public/sections/home/article-insights";
import Hero from "@/components/public/sections/home/hero";
import HowItWorks from "@/components/public/sections/home/how-it-works";
import MobileApp from "@/components/public/sections/home/mobile-app";
import OurPrograms from "@/components/public/sections/home/our-programs";
import Testimonials from "@/components/public/sections/home/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />

      <AboutPreview />

      <OurPrograms />

      <HowItWorks />

      <MobileApp />

      <Testimonials />

      <ArticleInsights />

      <CallToAction
        title="Ready to Transform Your Life?"
        description="Join thousands of individuals who have already started their wellness journey with SaKyi. Get personalized guidance from certified doctors and achieve your health goals."
        actions={
          <>
            <Link
              href="#programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Heart className="mr-2 h-5 w-5" />
              <span className="relative z-10">Start Your Journey</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Mail className="mr-2 h-5 w-5" />
              <span>Contact Us</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </>
  );
}
