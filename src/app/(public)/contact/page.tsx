import { ArrowRight, CheckCircle, ChevronRight, Phone } from "lucide-react";
import Link from "next/link";

import CallToAction from "@/components/public/sections/call-to-action";
import ContactDetails from "@/components/public/sections/contact/contact-details";
import ContactForm from "@/components/public/sections/contact/contact-form";
import ContactHero from "@/components/public/sections/contact/contact-hero";

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
