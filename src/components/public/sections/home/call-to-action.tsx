import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
  return (
          <section className="relative overflow-hidden bg-white py-24">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
            <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
          </div>
  
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
                <span
                  className="text-sm font-medium text-[#35bec5]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Ready to Start?
                </span>
              </div>

              <h2
                className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Ready to Transform{" "}
                <span
                  className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Your Life?
                </span>
              </h2>

              <p
                className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Join thousands of individuals who have already started their wellness journey with
                SaKyi. Get personalized guidance from certified doctors and achieve your health
                goals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row" data-aos="fade-up" data-aos-delay="200">
              <Link
                href="#programs"
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0c96c4] via-[#4bc4db] to-[#35bec5] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Link>

              <Link
                href="#contact"
                className="group inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-300 hover:border-[#35bec5] hover:bg-slate-50 hover:text-[#35bec5]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span>Contact Us</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </section>
  );
}