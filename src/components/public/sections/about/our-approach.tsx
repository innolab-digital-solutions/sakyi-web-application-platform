import { Brain, Heart, Shield, Target, TrendingUp, Users } from "lucide-react";
import Image from "next/image";

export default function OurApproach() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-6 text-center" data-aos="fade-up">
          <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <Brain className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Our Approach to Wellness
            </span>
          </div>

          <h2
            className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            A{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Holistic Methodology
            </span>{" "}
            for Lasting Health
          </h2>

          <p
            className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Our approach combines evidence-based medicine with personalized care, 
            addressing not just symptoms but the whole person to create sustainable 
            wellness transformations.
          </p>
        </div>

        {/* Methodology Steps */}
        <div className="mt-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Comprehensive Assessment",
                description: "We begin with a thorough evaluation of your health history, lifestyle, goals, and unique challenges to create your personalized wellness blueprint.",
                icon: Target,
                color: "from-[#35bec5] to-[#4bc4db]"
              },
              {
                step: "02",
                title: "Personalized Care Plan",
                description: "Based on your assessment, our experts design a tailored wellness program that addresses your specific needs and aligns with your lifestyle.",
                icon: Heart,
                color: "from-[#4bc4db] to-[#0c96c4]"
              },
              {
                step: "03",
                title: "Ongoing Support & Monitoring",
                description: "We provide continuous guidance, track your progress, and adjust your plan as needed to ensure you achieve and maintain your wellness goals.",
                icon: TrendingUp,
                color: "from-[#0c96c4] to-[#35bec5]"
              }
            ].map((step, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg"
                data-aos="fade-up"
                data-aos-delay={`${index * 200}`}
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-bold`}>
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${step.color}`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3
                  className="mb-4 text-xl font-bold text-slate-900"
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
            ))}
          </div>
        </div>

        {/* Our Methodology Visual */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column - Content */}
          <div className="space-y-8" data-aos="fade-right">
            <div>
              <h3
                className="mb-6 text-2xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Evidence-Based Excellence
              </h3>
              <p
                className="text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Our methodology is grounded in the latest scientific research and 
                clinical evidence. We combine traditional medical wisdom with 
                cutting-edge technology to deliver the most effective wellness solutions.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: Shield,
                  title: "Safety First",
                  description: "All our programs are designed with your safety as the top priority."
                },
                {
                  icon: Users,
                  title: "Community Support",
                  description: "Join a supportive community of individuals on similar wellness journeys."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                  data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10">
                    <feature.icon className="h-5 w-5 text-[#35bec5]" />
                  </div>
                  <h4
                    className="mb-2 text-lg font-semibold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {feature.title}
                  </h4>
                  <p
                    className="text-sm text-slate-600"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative" data-aos="fade-left">
            <div className="relative">
              <Image
                src="/images/wellness-approach.jpg"
                alt="SaKyi Wellness Methodology"
                width={600}
                height={500}
                className="h-auto w-full rounded-3xl object-cover shadow-2xl"
                quality={90}
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      AI-Powered
                    </div>
                    <div
                      className="text-xs text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Personalization
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#4bc4db] to-[#35bec5]">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Human-Centered
                    </div>
                    <div
                      className="text-xs text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Care
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
