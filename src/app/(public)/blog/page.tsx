import { ArrowRight, BookOpen, ChevronRight, MessageCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import BlogArticles from "@/components/public/sections/blog/blog-articles";
import BlogHero from "@/components/public/sections/blog/blog-hero";
import CallToAction from "@/components/public/sections/call-to-action";

export const metadata: Metadata = {
  title: "SaKyi Journal - Wellness Blog with Expert Health & Wellness Tips",
  description:
    "Discover evidence-based wellness insights, mindfulness practices, and healthy living tips from our certified medical team. Your trusted source for mental health, nutrition, and holistic wellness advice.",
  keywords: [
    "wellness blog",
    "health tips",
    "mental wellness",
    "mindfulness",
    "nutrition advice",
    "holistic health",
    "wellness insights",
    "healthy living",
    "wellness articles",
    "medical advice",
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
    canonical: "/blog",
  },
  openGraph: {
    title: "SaKyi Journal - Wellness Blog with Expert Health & Wellness Tips",
    description:
      "Discover evidence-based wellness insights, mindfulness practices, and healthy living tips from our certified medical team. Your trusted source for mental health, nutrition, and holistic wellness advice.",
    url: "https://sakyihealthandwellness.com/blog",
    siteName: "SaKyi Health & Wellness",
    images: [
      {
        url: "/images/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "SaKyi Journal - Wellness Blog and Health Tips",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaKyi Journal - Wellness Blog with Expert Health & Wellness Tips",
    description:
      "Discover evidence-based wellness insights, mindfulness practices, and healthy living tips from our certified medical team. Your trusted source for mental health, nutrition, and holistic wellness advice.",
    images: ["/images/og-blog.jpg"],
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

export default function BlogPage() {
  return (
    <>
      <BlogHero />

      <BlogArticles />

      <CallToAction
        title="Ready to Apply What You've Learned?"
        description="You've read our expert insights and wellness tips. Now it's time to put this knowledge into action with our personalized programs. Let our doctors help you implement these strategies for lasting results."
        actions={
          <>
            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              <span className="relative z-10">Start Your Program</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              <span>Discuss Your Goals</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </>
  );
}
