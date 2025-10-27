"use client";

import { ArrowRight, CheckCircle, MessageCircle, Target, Users } from "lucide-react";

import { smoothScrollTo } from "@/utils/smooth-scroll";

export default function ProgramsHowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Initial Consultation",
      description: "Schedule a free consultation with our wellness experts to discuss your goals, health history, and preferences.",
      icon: MessageCircle,
      color: "from-[#35bec5] to-[#4bc4db]"
    },
    {
      number: "02",
      title: "Personalized Assessment",
      description: "Complete our comprehensive health assessment to create your unique wellness profile and identify areas for improvement.",
      icon: Target,
      color: "from-[#4bc4db] to-[#0c96c4]"
    },
    {
      number: "03",
      title: "Custom Program Design",
      description: "Our medical team designs a personalized program tailored to your specific needs, goals, and lifestyle preferences.",
      icon: CheckCircle,
      color: "from-[#35bec5] to-[#0c96c4]"
    },
    {
      number: "04",
      title: "Program Implementation",
      description: "Begin your wellness journey with ongoing support, regular check-ins, and adjustments to ensure optimal results.",
      icon: Users,
      color: "from-[#4bc4db] to-[#35bec5]"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2
            className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            How It{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Works
            </span>
          </h2>
          <p
            className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Our proven 4-step process ensures you get the most personalized and effective wellness experience possible.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={`${index * 200}`}
            >
              {/* Step Number */}
              <div className="mb-6 flex items-center gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${step.color} shadow-lg`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <span
                    className="text-2xl font-bold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3
                  className="text-xl font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-slate-600 leading-relaxed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {step.description}
                </p>
              </div>

              {/* Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="absolute -bottom-4 -right-4 hidden lg:block">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-slate-200 shadow-lg">
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#35bec5]/5 to-[#0c96c4]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
            <h3
              className="mb-4 text-2xl font-bold text-slate-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
              data-aos="fade-up"
            >
              Ready to Start Your Journey?
            </h3>
            <p
              className="mb-8 text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Book your free consultation today and take the first step towards a healthier, happier you.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-8 py-4 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{ fontFamily: "Inter, sans-serif" }}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <MessageCircle className="h-5 w-5" />
                Book Free Consultation
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <button
                onClick={() => smoothScrollTo('programs', 80)}
                className="group inline-flex items-center gap-2 rounded-full border-2 border-[#35bec5] bg-white px-8 py-4 text-[#35bec5] font-semibold transition-all duration-300 hover:bg-[#35bec5] hover:text-white hover:shadow-lg hover:scale-105"
                style={{ fontFamily: "Inter, sans-serif" }}
                data-aos="fade-up"
                data-aos-delay="500"
              >
                View All Programs
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
