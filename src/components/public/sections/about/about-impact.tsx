import { Heart, Shield, Star, TrendingUp,Users } from "lucide-react";
import Image from "next/image";

const impactStats = [
  {
    icon: <Users className="h-6 w-6 text-white" />,
    value: "10,000+",
    label: "Lives Transformed",
    description: "Numerous individuals have attained their wellbeing objectives with our services.",
  },
  {
    icon: <Star className="h-6 w-6 text-white" />,
    value: "4.9★",
    label: "Average Client Rating",
    description: "Clients consistently rate our programs highly for satisfaction and effectiveness.",
  },
  {
    icon: <Heart className="h-6 w-6 text-white" />,
    value: "95%",
    label: "Success Rate",
    description: "Most customers achieve or surpass their primary wellness goals.",
  },
  {
    icon: <Shield className="h-6 w-6 text-white" />,
    value: "98%",
    label: "Would Recommend",
    description: "Almost all clients would endorse Sa Kyi to their friends and family.",
  },
];

export default function AboutImpact() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Column - Visual */}
          <div
            className="relative"
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <div className="relative">
              <div className="aspect-[3/4] w-full">
                <div className="group relative h-full overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                    alt="SaKyi Impact - Lives Transformed Through Wellness"
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
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold text-slate-900"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      10K+ Lives
                    </div>
                    <div
                      className="text-xs text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Transformed
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
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold text-slate-900"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      4.9★ Rating
                    </div>
                    <div
                      className="text-xs text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Client Satisfaction
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8" data-aos="fade-left">
            {/* Section Header */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
                <TrendingUp className="h-4 w-4 text-[#35bec5]" />
                <span
                  className="text-sm font-medium text-[#35bec5]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Our Impact
                </span>
              </div>

              <h2 className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                <span
                  className="block text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Making a{" "}
                  <span
                    className="text-brand-gradient bg-clip-text text-transparent"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Real Difference
                  </span>
                </span>
              </h2>

              <p
                className="max-w-2xl text-lg leading-relaxed text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
              The evidence is in our outcomes. Health customers seek favorable results and common ideals; hence, we confidently present our effect metrics:
              </p>
            </div>

            {/* Impact Stats */}
            <div className="space-y-4">
              {impactStats.map((stat, index) => (
                <div
                  key={index}
                  className="group flex items-start space-x-3 rounded-lg p-3 transition-all duration-300 hover:bg-slate-50"
                  data-aos="fade-up"
                  data-aos-delay={`${index * 200 + 400}`}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#35bec5] to-[#0c96c4] shadow-lg">
                    {stat.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                      <div
                        className="text-2xl font-bold text-slate-900"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-sm font-semibold text-[#35bec5]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {stat.label}
                      </div>
                    </div>
                    <p
                      className="text-sm text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {stat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
