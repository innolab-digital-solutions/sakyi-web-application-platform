import { ArrowRight, Calendar, Globe } from "lucide-react";
import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2
            className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Start Your{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Wellness Journey
            </span>
          </h2>

          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Take the first step toward a healthier, more balanced life. Book a complimentary consultation with our experienced medical team and discover tailored wellness solutions designed around your unique needs.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">


<Link
              href="#programs"
              className="group inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Globe className="mr-2 h-5 w-5" />
              Explore Programs
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-[#35bec5] hover:text-[#35bec5]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Schedule Consultation
            <Calendar className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
