import { ArrowRight, ChevronRight, Heart, Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import CallToAction from "@/components/public/sections/call-to-action";
import AboutPreview from "@/components/public/sections/home/about-preview";
import ArticleInsights from "@/components/public/sections/home/article-insights";
import Hero from "@/components/public/sections/home/hero";
import HowItWorks from "@/components/public/sections/home/how-it-works";
import MobileApp from "@/components/public/sections/home/mobile-app";
import Testimonials from "@/components/public/sections/home/testimonials";

export const metadata: Metadata = {
  title: "SaKyi Health & Wellness - Transform Your Life with Personalized Wellness Programs",
  description:
    "Discover personalized wellness programs designed by certified doctors. Join thousands who've transformed their lives with SaKyi's evidence-based approach to health, nutrition, and mental wellness.",
  keywords: [
    "wellness programs",
    "personalized health",
    "mental wellness",
    "nutrition counseling",
    "holistic health",
    "wellness coaching",
    "health transformation",
    "certified doctors",
    "wellness journey",
    "healthy living",
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
    canonical: "/",
  },
  openGraph: {
    title: "SaKyi Health & Wellness - Transform Your Life with Personalized Wellness Programs",
    description:
      "Discover personalized wellness programs designed by certified doctors. Join thousands who've transformed their lives with SaKyi's evidence-based approach to health, nutrition, and mental wellness.",
    url: "https://sakyihealthandwellness.com",
    siteName: "SaKyi Health & Wellness",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "SaKyi Health & Wellness - Personalized Wellness Programs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaKyi Health & Wellness - Transform Your Life with Personalized Wellness Programs",
    description:
      "Discover personalized wellness programs designed by certified doctors. Join thousands who've transformed their lives with SaKyi's evidence-based approach to health, nutrition, and mental wellness.",
    images: ["/images/og-home.jpg"],
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <AboutPreview />

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
              href="/programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Heart className="mr-2 h-5 w-5" />
              <span className="relative z-10">Start Your Journey</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Mail className="mr-2 h-5 w-5" />
              <span>Get Free Consultation</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </>
  );
}
