import { ArrowRight, CheckCircle, ChevronRight, Phone } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import CallToAction from "@/components/public/sections/call-to-action";
import ContactDetails from "@/components/public/sections/contact/contact-details";
import ContactForm from "@/components/public/sections/contact/contact-form";
import ContactHero from "@/components/public/sections/contact/contact-hero";

export const metadata: Metadata = {
  title: "Contact SaKyi Health & Wellness - Get Your Free Consultation Today",
  description:
    "Ready to start your wellness journey? Contact our certified medical team for a free consultation. Get personalized health advice and discover the perfect wellness program for your needs.",
  keywords: [
    "contact sakyi",
    "wellness consultation",
    "free consultation",
    "health advice",
    "wellness programs",
    "medical consultation",
    "health assessment",
    "wellness coaching",
    "personalized health",
    "wellness support",
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
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact SaKyi Health & Wellness - Get Your Free Consultation Today",
    description:
      "Ready to start your wellness journey? Contact our certified medical team for a free consultation. Get personalized health advice and discover the perfect wellness program for your needs.",
    url: "https://sakyihealthandwellness.com/contact",
    siteName: "SaKyi Health & Wellness",
    images: [
      {
        url: "/images/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact SaKyi Health & Wellness - Free Consultation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact SaKyi Health & Wellness - Get Your Free Consultation Today",
    description:
      "Ready to start your wellness journey? Contact our certified medical team for a free consultation. Get personalized health advice and discover the perfect wellness program for your needs.",
    images: ["/images/og-contact.jpg"],
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

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <ContactDetails />

      <ContactForm />

      <CallToAction
        title="Ready to Take the Next Step?"
        description="You've reached out to us - that's the first step! Our team will review your message and get back to you within 24 hours. In the meantime, explore our programs or learn more about our approach."
        actions={
          <>
            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              <span className="relative z-10">Explore Programs</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Phone className="mr-2 h-5 w-5" />
              <span>Learn About Us</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </>
  );
}
