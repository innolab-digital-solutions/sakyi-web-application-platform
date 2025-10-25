import { ArrowRight,CheckCircle, Heart, Users } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
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
          <Heart className="h-4 w-4 text-[#35bec5]" />
          <span
            className="text-sm font-medium text-[#35bec5]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            How It Works
          </span>
        </div>

        <h2
          className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Transform Your Health in{" "}
          <span
            className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Just 3 Steps
          </span>
        </h2>

        <p
          className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Join thousands who&apos;ve transformed their lives with our proven 3-step process. Get
          personalized guidance from certified doctors and see real results in just weeks.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {[
          {
            step: "1",
            icon: Heart,
            title: "Choose Your Program",
            description:
              "Select the wellness plan that fits your goals — from mental focus to healthy living.",
          },
          {
            step: "2",
            icon: Users,
            title: "Complete Your Profile",
            description:
              "Share your personal details and preferences so our doctors can customize your plan.",
          },
          {
            step: "3",
            icon: CheckCircle,
            title: "Start Your Weekly Guidance",
            description:
              "Receive personalized weekly plans, feedback, and lifestyle recommendations directly from your doctor.",
          },
        ].map((step, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg"
            data-aos="fade-up"
            data-aos-delay={`${index * 200}`}
          >
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Step Number Badge */}
              <div className="mb-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4] text-white shadow-lg">
                  <span
                    className="text-xl font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {step.step}
                  </span>
                </div>
              </div>

              {/* Icon with Enhanced Design */}
              <div className="mb-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#35bec5]/10 to-[#0c96c4]/10 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <step.icon className="h-10 w-10 text-[#35bec5]" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3
                  className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#35bec5]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {step.title}
                </h3>

                <p
                  className="leading-relaxed text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="600">
        <Link
          href="#app"
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <span className="relative z-10">Get Started Today</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0c96c4] via-[#4bc4db] to-[#35bec5] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </Link>
      </div>
    </div>
  </section>
  );
}