import { CheckCircle, Heart, Shield, Star, Target } from "lucide-react";
import Image from "next/image";

export default function ProgramsPersonalized() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Column - Content */}
          <div className="space-y-8" data-aos="fade-right">
            <div className="space-y-6">
              <h2
                className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Personalized{" "}
                <span
                  className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Wellness Plans
                </span>
              </h2>
              <p
                className="text-lg leading-relaxed text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Every individual is unique, and so should be their wellness journey. Our personalized approach 
                ensures that your program is tailored specifically to your needs, goals, and lifestyle.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#4bc4db]">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3
                    className="mb-2 text-lg font-semibold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Goal-Oriented Approach
                  </h3>
                  <p
                    className="text-slate-600"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    We start by understanding your specific health goals and create a roadmap to achieve them.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#4bc4db] to-[#0c96c4]">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3
                    className="mb-2 text-lg font-semibold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Lifestyle Integration
                  </h3>
                  <p
                    className="text-slate-600"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Your program fits seamlessly into your daily routine, making sustainable change possible.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3
                    className="mb-2 text-lg font-semibold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Medical Supervision
                  </h3>
                  <p
                    className="text-slate-600"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Certified doctors monitor your progress and adjust your plan as needed for optimal results.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div
                  className="text-3xl font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  95%
                </div>
                <div
                  className="text-sm text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Success Rate
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-3xl font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  10K+
                </div>
                <div
                  className="text-sm text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Happy Clients
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-3xl font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  4.9★
                </div>
                <div
                  className="text-sm text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Client Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative" data-aos="fade-left">
            <div className="relative">
              {/* Main Image */}
              <div className="group relative overflow-hidden rounded-3xl shadow-2xl">
                <div className="aspect-[4/5] w-full">
                  <Image
                    src="/images/personalized.jpg"
                    alt="Personalized Wellness Plans - Tailored Health Journey"
                    width={600}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5"></div>
              </div>

              {/* Floating Cards */}
              <div
                className="absolute -top-6 -left-2 sm:-left-4 lg:-top-4 lg:-left-6 rounded-2xl border border-slate-200/50 bg-white/90 p-4 shadow-xl backdrop-blur-sm"
                data-aos="fade-up"
                data-aos-delay="400"
                style={{
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#4bc4db]">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold text-slate-900"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Customized Plan
                    </div>
                    <div
                      className="text-xs text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Tailored to your needs
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-2 sm:-right-4 lg:-right-6 -bottom-6 rounded-2xl border border-slate-200/50 bg-white/90 p-4 shadow-xl backdrop-blur-sm"
                data-aos="fade-up"
                data-aos-delay="600"
                style={{
                  animation: "float 6s ease-in-out infinite",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#4bc4db] to-[#0c96c4]">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold text-slate-900"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Expert Guidance
                    </div>
                    <div
                      className="text-xs text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Doctor supervised
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
