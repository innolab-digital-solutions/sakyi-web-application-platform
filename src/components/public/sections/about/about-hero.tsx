import { Heart, Shield, Target } from "lucide-react";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Column - Content */}
          <div className="space-y-8" data-aos="fade-right">
        

            {/* Main Headline */}
            <h1
              className="text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Transforming Healthcare Through{" "}
              <span
                className="text-brand-gradient bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Personalized Wellness
              </span>
            </h1>

            <p
              className="text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              We believe that healthcare should be accessible, personalized, and empowering. 
              SaKyi combines cutting-edge technology with compassionate care to help you 
              achieve your wellness goals and live your healthiest life.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  value: "10K+",
                  label: "Lives Transformed",
                  delay: 100,
                },
                {
                  value: "98%",
                  label: "Success Rate",
                  delay: 200,
                },
                {
                  value: "50+",
                  label: "Expert Doctors",
                  delay: 300,
                },
                {
                  value: "24/7",
                  label: "Support Available",
                  delay: 400,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-center !transition-all !duration-300 !ease-out hover:scale-[1.02] hover:shadow-xl hover:border-[#35bec5]/30 hover:bg-gradient-to-br hover:from-[#35bec5]/5 hover:to-[#0c96c4]/5"
                  data-aos="fade-up"
                  data-aos-delay={stat.delay}
                  style={{ transitionDelay: '0ms' }}
                >
                  <div
                    className="text-2xl font-bold text-[#35bec5] transition-colors duration-700 ease-out group-hover:text-[#0c96c4]"
                    style={{ fontFamily: "Poppins, sans-serif", transitionDelay: '200ms' }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs text-slate-600 transition-colors duration-700 ease-out group-hover:text-slate-700"
                    style={{ fontFamily: "Inter, sans-serif", transitionDelay: '300ms' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div className="space-y-6">
            {/* Top Image */}
            <div 
              className="relative group overflow-hidden rounded-2xl shadow-lg"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="aspect-[4/3] w-full">
                <Image
                  src="/images/about-1.jpg"
                  alt="SaKyi Wellness Team"
                  width={500}
                  height={375}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  quality={90}
                />
              </div>
            </div>
            
            {/* Bottom Two Images */}
            <div className="grid grid-cols-2 gap-6">
              <div 
                className="relative group overflow-hidden rounded-2xl shadow-lg"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="aspect-[4/3] w-full">
                  <Image
                    src="/images/about-2.jpg"
                    alt="SaKyi Healthcare Professionals"
                    width={250}
                    height={188}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={90}
                  />
                </div>
              </div>
              <div 
                className="relative group overflow-hidden rounded-2xl shadow-lg"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="aspect-[4/3] w-full">
                  <Image
                    src="/images/about-3.jpg"
                    alt="SaKyi Wellness Care"
                    width={250}
                    height={188}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={90}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Values Section */}
        <div className="mt-20">
          <h2
            className="mb-12 text-center text-2xl font-bold text-slate-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            What Makes Us Different
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Personalized Care",
                description: "Tailored wellness plans designed specifically for your unique needs and goals."
              },
              {
                icon: Shield,
                title: "Expert Guidance",
                description: "Certified doctors and wellness experts guiding you every step of the way."
              },
              {
                icon: Heart,
                title: "Holistic Approach",
                description: "Comprehensive wellness that addresses mind, body, and spirit together."
              }
            ].map((value, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10">
                  <value.icon className="h-8 w-8 text-[#35bec5]" />
                </div>
                <h3
                  className="mb-4 text-xl font-semibold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
