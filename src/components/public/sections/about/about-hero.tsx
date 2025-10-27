import { Heart } from "lucide-react";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#35bec5]/10 to-[#4bc4db]/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#4bc4db]/10 to-[#0c96c4]/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Content Layout */}
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2 text-sm font-medium text-[#35bec5]">
            <Heart className="h-4 w-4" />
            <span style={{ fontFamily: "Inter, sans-serif" }}>About SaKyi</span>
          </div>

          {/* Main Headline */}
          <h1
            className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
            data-aos-duration="800"
          >
            Your Trusted Partner in{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Holistic Wellness
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
            At SaKyi, we believe that true wellness comes from addressing the whole person—mind, body, and spirit. 
            Our mission is to empower you with personalized, evidence-based programs that transform your health 
            and enhance your quality of life.
          </p>

          {/* Team Images Grid */}
          <div className="mb-12 grid gap-6 sm:grid-cols-3" data-aos="fade-up" data-aos-delay="400">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="aspect-[4/3] w-full">
                <Image
                  src="/images/team-1.jpg"
                  alt="Dr. Sarah Johnson - Chief Medical Officer"
                  width={300}
                  height={225}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div
                  className="text-sm font-semibold"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Dr. Sarah Johnson
                </div>
                <div
                  className="text-xs text-white/80"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Chief Medical Officer
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="aspect-[4/3] w-full">
                <Image
                  src="/images/team-2.jpg"
                  alt="Dr. Michael Chen - Director of Nutrition"
                  width={300}
                  height={225}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div
                  className="text-sm font-semibold"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Dr. Michael Chen
                </div>
                <div
                  className="text-xs text-white/80"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Director of Nutrition
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="aspect-[4/3] w-full">
                <Image
                  src="/images/team-3.jpg"
                  alt="Dr. Emily Rodriguez - Head of Mental Wellness"
                  width={300}
                  height={225}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div
                  className="text-sm font-semibold"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Dr. Emily Rodriguez
                </div>
                <div
                  className="text-xs text-white/80"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Head of Mental Wellness
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="600">
            <div className="text-center">
              <div
                className="mb-2 text-3xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                10K+
              </div>
              <div
                className="text-sm text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Lives Transformed
              </div>
            </div>
            <div className="text-center">
              <div
                className="mb-2 text-3xl font-bold text-slate-900"
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
                className="mb-2 text-3xl font-bold text-slate-900"
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
      </div>
    </section>
  );
}
