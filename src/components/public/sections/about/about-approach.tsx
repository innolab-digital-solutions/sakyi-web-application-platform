import { CheckCircle,HandHeart, ListChecks, Puzzle, Stethoscope, Target, Zap } from "lucide-react";
import Image from "next/image";

const approachSteps = [
  {
    icon: <Stethoscope className="h-6 w-6 text-white" />,
    title: "Thorough Evaluation",
    description: "We initiate with an extensive assessment of your medical history, lifestyle, objectives, and obstacles. This provides a comprehensive overview of your wellness requirements.",
  },
  {
    icon: <ListChecks className="h-6 w-6 text-white" />,
    title: "Tailored Planning",
    description: "Our staff formulates a bespoke plan that corresponds with your individual objectives and preferences. Plans incorporate nutrition, physical activity, mindfulness, and medical care for comprehensive outcomes.",
  },
  {
    icon: <HandHeart className="h-6 w-6 text-white" />,
    title: "Professional Assistance",
    description: "You collaborate directly with certified healthcare practitioners who offer continuous assistance, track progress, and modify your plan as necessary.",
  },
  {
    icon: <Puzzle className="h-6 w-6 text-white" />,
    title: "Comprehensive Integration",
    description: "Genuine wellbeing entails considering the entire individual. We integrate physical exercise, dietary therapy, psychological assistance, and spiritual development to facilitate enduring health.",
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

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Column - Content */}
          <div className="space-y-8" data-aos="slide-up" data-aos-duration="1200" data-aos-easing="ease-out-cubic">
            {/* Section Header */}
            <div className="space-y-6">
              <div 
                className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2"
                data-aos="slide-down"
                data-aos-delay="200"
                data-aos-duration="800"
                data-aos-easing="ease-out-back"
              >
                <Zap className="h-4 w-4 text-[#35bec5]" />
                <span
                  className="text-sm font-medium text-[#35bec5]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Our Approach
                </span>
              </div>

              <h2 className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                <span
                  className="block text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Our{" "}
                  <span
                    className="text-brand-gradient bg-clip-text text-transparent"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
             Evidence‑Based Approach
                  </span>
                </span>
              </h2>

              <p
                className="max-w-2xl text-lg leading-relaxed text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
            Research indicates that an About page should elucidate your operational methods and highlight the distinguishing features of your service. At Sa Kyi, our approach integrates <strong>cutting-edge medical research with individualized care</strong> to achieve tangible outcomes. We collaborate with you on your wellness journey:
              </p>
            </div>

            {/* Approach Steps */}
            <div className="space-y-4">
              {approachSteps.map((step, index) => (
                <div
                  key={index}
                  className="group flex items-start space-x-3 rounded-lg p-3 transition-all duration-300 hover:bg-slate-50"
                  data-aos="fade-up"
                  data-aos-delay={`${index * 200 + 400}`}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#35bec5] to-[#0c96c4] shadow-lg">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="mb-1 text-base font-semibold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm text-slate-600"
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
          <div
            className="relative"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <div className="relative">
              <div className="aspect-[3/4] w-full">
                <div className="group relative h-full overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src="/images/methodology.jpg"
                    alt="SaKyi Wellness Approach - Holistic Health Methodology"
                    width={600}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={95}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  />
                  {/* Subtle dark overlay that disappears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-slate-800/10 transition-opacity duration-300 group-hover:opacity-0"></div>
                  {/* Brand gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5"></div>
                </div>
              </div>

              {/* Floating Cards with Movement Animation */}
              <div
                className="absolute -top-6 -left-2 sm:-left-4 lg:-top-4 lg:-left-6 animate-pulse rounded-2xl border border-slate-200/50 bg-white/90 p-4 shadow-xl backdrop-blur-sm hover:animate-bounce"
                data-aos="fade-up"
                data-aos-delay="400"
                style={{
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#4bc4db]">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold text-slate-900"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Evidence-Based
                    </div>
                    <div
                      className="text-xs text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Proven Results
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-2 sm:-right-4 lg:-right-6 -bottom-6 animate-pulse rounded-2xl border border-slate-200/50 bg-white/90 p-4 shadow-xl backdrop-blur-sm hover:animate-bounce"
                data-aos="fade-up"
                data-aos-delay="600"
                style={{
                  animation: "float 6s ease-in-out infinite",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#4bc4db] to-[#0c96c4]">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold text-slate-900"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Holistic Care
                    </div>
                    <div
                      className="text-xs text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Complete Wellness
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
