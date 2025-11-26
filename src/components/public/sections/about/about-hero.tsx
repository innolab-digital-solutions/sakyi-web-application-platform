import {  Users } from "lucide-react";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-linear-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-linear-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Column - Content */}
          <div className="space-y-8" data-aos="slide-up" data-aos-duration="1200" data-aos-easing="ease-out-cubic">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2 text-sm font-medium text-[#35bec5]"
              data-aos="slide-down"
              data-aos-delay="200"
              data-aos-duration="800"
              data-aos-easing="ease-out-back"
            >
              <Users className="h-4 w-4" />
              <span style={{ fontFamily: "Inter, sans-serif" }}>About SaKyi</span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <span
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
              >
                Your Trusted Partner in{" "}
              </span>
              <span
                className="bg-linear-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
                data-aos="fade-up"
                data-aos-delay="500"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
              >
                Holistic Wellness
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="slide-up"
              data-aos-delay="700"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              At SaKyi, we believe that true wellness comes from addressing the whole person—mind, body, and spirit. 
              Our mission is to empower you with personalized, evidence-based programs that transform your health 
              and enhance your quality of life.
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-8">
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

          {/* Right Column - Creative Multi-Image Layout */}
          <div className="relative" data-aos="zoom-in" data-aos-duration="1200" data-aos-delay="400" data-aos-easing="ease-out-cubic">
            {/* Main Grid Container */}
            <div className="grid grid-cols-2 gap-4">
              {/* Large Main Image - Top Left */}
              <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-xl">
                <div className="aspect-4/3 w-full sm:aspect-3/2 lg:aspect-4/3">
                  <Image
                    src="/images/team.jpg"
                    alt="SaKyi Wellness Team - Holistic Health Approach"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={95}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  />
                </div>
                {/* Subtle dark overlay that disappears on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-900/20 to-slate-800/10 transition-opacity duration-300 group-hover:opacity-0"></div>
                {/* Brand gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#35bec5]/5 to-[#0c96c4]/5"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-4 left-4 text-white">
                  <div
                    className="text-lg font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Our Expert Team
                  </div>
                  <div
                    className="text-sm text-white/90"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Certified Medical Professionals
                  </div>
                </div>
              </div>

              {/* Small Image 1 - Bottom Left */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                <div className="aspect-square w-full sm:aspect-4/3 lg:aspect-square">
                  <Image
                    src="/images/consultation.jpg"
                    alt="Wellness Consultation - Personalized Care"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={90}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
                {/* Subtle dark overlay that disappears on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-900/20 to-slate-800/10 transition-opacity duration-300 group-hover:opacity-0"></div>
                {/* Brand gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#35bec5]/5 to-[#0c96c4]/5"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-3 left-3 text-white">
                  <div
                    className="text-sm font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Personalized Care
                  </div>
                  <div
                    className="text-xs text-white/90"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    One-on-One Consultation
                  </div>
                </div>
              </div>

              {/* Small Image 2 - Bottom Right */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                <div className="aspect-square w-full sm:aspect-4/3 lg:aspect-square">
                  <Image
                    src="/images/holistic.jpg"
                    alt="Holistic Wellness Approach - Mind, Body, Spirit"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={90}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
                {/* Subtle dark overlay that disappears on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-900/20 to-slate-800/10 transition-opacity duration-300 group-hover:opacity-0"></div>
                {/* Brand gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#35bec5]/5 to-[#0c96c4]/5"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-3 left-3 text-white">
                  <div
                    className="text-sm font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Holistic Approach
                  </div>
                  <div
                    className="text-xs text-white/90"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Mind, Body & Spirit
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
