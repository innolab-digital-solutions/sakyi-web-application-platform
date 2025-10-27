import { ArrowRight, ChevronRight, Phone, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import AboutApproach from "@/components/public/sections/about/about-approach";
import AboutHero from "@/components/public/sections/about/about-hero";
import AboutImpact from "@/components/public/sections/about/about-impact";
import AboutMission from "@/components/public/sections/about/about-mission";
import AboutTeam from "@/components/public/sections/about/about-team";
import CallToAction from "@/components/public/sections/call-to-action";

export const metadata: Metadata = {
  title: "About SaKyi Health & Wellness - Our Mission, Team & Holistic Approach",
  description:
    "Learn about SaKyi's mission to transform lives through personalized wellness. Meet our certified medical team and discover our evidence-based approach to holistic health and wellness.",
  keywords: [
    "about sakyi",
    "wellness mission",
    "holistic health approach",
    "certified medical team",
    "wellness experts",
    "health transformation",
    "medical professionals",
    "wellness philosophy",
    "evidence-based care",
    "personalized wellness",
  ],
  authors: [{ name: "SaKyi Health & Wellness Team" }],
  creator: "SaKyi Health & Wellness",
  publisher: "SaKyi Health & Wellness",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sakyihealthandwellness.com"),
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About SaKyi Health & Wellness - Our Mission, Team & Holistic Approach",
    description:
      "Learn about SaKyi's mission to transform lives through personalized wellness. Meet our certified medical team and discover our evidence-based approach to holistic health and wellness.",
    url: "https://sakyihealthandwellness.com/about",
    siteName: "SaKyi Health & Wellness",
    images: [
      {
        url: "/images/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About SaKyi Health & Wellness - Our Mission and Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SaKyi Health & Wellness - Our Mission, Team & Holistic Approach",
    description:
      "Learn about SaKyi's mission to transform lives through personalized wellness. Meet our certified medical team and discover our evidence-based approach to holistic health and wellness.",
    images: ["/images/og-about.jpg"],
    creator: "@sakyiwellness",
    site: "@sakyiwellness",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <AboutMission />

      <AboutApproach />

      <AboutTeam />

      <AboutImpact />

      <CallToAction
        title="Ready to Work With Our Expert Team?"
        description="Now that you know our story, mission, and approach, let's discuss how we can help you achieve your wellness goals. Our certified doctors are ready to create your personalized plan."
        actions={
          <>
            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Users className="mr-2 h-5 w-5" />
              <span className="relative z-10">Meet Our Team</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Phone className="mr-2 h-5 w-5" />
              <span>Schedule Consultation</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </>
  );
}
