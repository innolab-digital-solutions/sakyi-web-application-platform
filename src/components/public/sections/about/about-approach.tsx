import { CheckCircle, Heart, Shield, Target } from "lucide-react";
import Image from "next/image";

const approachSteps = [
  {
    icon: <Target className="h-6 w-6 text-white" />,
    title: "Comprehensive Assessment",
    description: "We begin with a thorough evaluation of your health history, lifestyle, goals, and current challenges to create a complete picture of your wellness needs.",
  },
  {
    icon: <Heart className="h-6 w-6 text-white" />,
    title: "Personalized Planning",
    description: "Based on your assessment, our team designs a customized wellness plan that addresses your unique needs and aligns with your personal goals and preferences.",
  },
  {
    icon: <Shield className="h-6 w-6 text-white" />,
    title: "Expert Guidance",
    description: "You'll work with certified healthcare professionals who provide ongoing support, monitor your progress, and adjust your plan as needed.",
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-white" />,
    title: "Holistic Integration",
    description: "We integrate nutrition, movement, mindfulness, and medical care to address all aspects of your health for comprehensive, lasting results.",
  },
];

export default function AboutApproach() {
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
          <div data-aos="fade-right">
            <h2
              className="mb-6 text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our{" "}
              <span
                className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Approach
              </span>
            </h2>
            <p
              className="mb-8 text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Our evidence-based methodology combines the latest medical research with personalized care 
              to deliver transformative results. Here&apos;s how we work with you to achieve optimal wellness.
            </p>

            {/* Approach Steps */}
            <div className="space-y-6">
              {approachSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                  data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                    {step.icon}
                  </div>
                  <div>
                    <h3
                      className="mb-2 text-lg font-semibold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative" data-aos="fade-left">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div className="aspect-[4/3] w-full">
                <Image
                  src="/images/our-approach.jpg"
                  alt="SaKyi Wellness Approach - Holistic Health Methodology"
                  width={600}
                  height={450}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#35bec5]/10 to-[#0c96c4]/10"></div>
            </div>

            {/* Floating Stats */}
            <div
              className="absolute -top-6 -left-6 rounded-2xl border border-slate-200/50 bg-white/90 p-6 shadow-xl backdrop-blur-sm"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="text-center">
                <div
                  className="text-2xl font-bold text-slate-900"
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
            </div>

            <div
              className="absolute -right-6 -bottom-6 rounded-2xl border border-slate-200/50 bg-white/90 p-6 shadow-xl backdrop-blur-sm"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="text-center">
                <div
                  className="text-2xl font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  10K+
                </div>
                <div
                  className="text-sm text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Lives Changed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
