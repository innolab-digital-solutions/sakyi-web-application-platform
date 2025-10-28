import {  CheckCircle, MessageCircle, Settings, Target, Users } from "lucide-react";

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

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <Settings className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              How It Works
            </span>
          </div>

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
              className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#35bec5]/50 hover:shadow-lg overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={`${index * 200}`}
              data-aos-duration="800"
              data-aos-easing="ease-out"
            >
              {/* Step Number */}
              <div className="mb-6 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${step.color} shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl`}>
                  <step.icon className="h-6 w-6 text-white transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                  <span
                    className="text-xl font-bold text-slate-900"
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

              {/* Hover Effect - Background Gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#35bec5]/5 to-[#0c96c4]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
