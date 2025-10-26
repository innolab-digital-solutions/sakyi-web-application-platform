import { ArrowRight, Heart, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ProgramsHero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Content Layout */}
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2 text-sm font-medium text-[#35bec5]">
            <Sparkles className="h-4 w-4" />
            <span style={{ fontFamily: "Inter, sans-serif" }}>Doctor-Designed Programs</span>
          </div>

          {/* Main Headline */}
          <h1
            className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
            data-aos-duration="800"
          >
            Our Wellness{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Programs
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            Choose from our comprehensive range of personalized wellness programs, each designed by certified doctors 
            and tailored to help you achieve your specific health and wellness goals.
          </p>

          {/* Program Categories Preview */}
          <div className="mb-12 grid gap-6 sm:grid-cols-3" data-aos="fade-up" data-aos-delay="400">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#4bc4db] mx-auto">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3
                className="mb-2 text-lg font-semibold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Mental Wellness
              </h3>
              <p
                className="text-sm text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Comprehensive mental health support with personalized therapy sessions
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#4bc4db] to-[#0c96c4] mx-auto">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3
                className="mb-2 text-lg font-semibold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Nutrition & Lifestyle
              </h3>
              <p
                className="text-sm text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Transform your eating habits with personalized meal plans and coaching
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4] mx-auto">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3
                className="mb-2 text-lg font-semibold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Fitness & Movement
              </h3>
              <p
                className="text-sm text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Build strength and flexibility with personalized workout plans
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center" data-aos="fade-up" data-aos-delay="600">
            <Link
              href="#programs"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-8 py-4 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Heart className="h-5 w-5" />
              Explore All Programs
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-[#35bec5] bg-white px-8 py-4 text-[#35bec5] font-semibold transition-all duration-300 hover:bg-[#35bec5] hover:text-white hover:shadow-lg hover:scale-105"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Shield className="h-5 w-5" />
              Get Free Consultation
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
