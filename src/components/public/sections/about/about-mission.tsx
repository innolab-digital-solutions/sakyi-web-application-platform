import { Heart, Lightbulb, Target, Users } from "lucide-react";

const values = [
  {
    icon: <Target className="h-8 w-8 text-[#35bec5]" />,
    title: "Our Mission",
    description: "To empower individuals with personalized, evidence-based wellness programs that transform their health and enhance their quality of life through holistic care.",
  },
  {
    icon: <Heart className="h-8 w-8 text-[#35bec5]" />,
    title: "Our Vision",
    description: "A world where everyone has access to comprehensive wellness care that addresses the whole person—mind, body, and spirit—for lasting health and happiness.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-[#35bec5]" />,
    title: "Our Philosophy",
    description: "We believe that true wellness comes from understanding the interconnectedness of physical, mental, and emotional health, and treating each person as a unique individual.",
  },
  {
    icon: <Users className="h-8 w-8 text-[#35bec5]" />,
    title: "Our Commitment",
    description: "To provide compassionate, expert care that respects your journey, celebrates your progress, and supports you every step of the way toward optimal wellness.",
  },
];

export default function AboutMission() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center" data-aos="fade-up">
          <h2
            className="text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Our{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Mission & Philosophy
            </span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            At SaKyi, we&apos;re driven by a deep commitment to holistic wellness and personalized care. 
            Our mission, vision, and philosophy guide everything we do.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              <div className="mb-6 flex justify-center">{value.icon}</div>
              <h3
                className="mb-4 text-xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {value.title}
              </h3>
              <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="mt-20 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 p-12">
          <div className="mx-auto max-w-4xl text-center">
            <h3
              className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
              data-aos="fade-up"
            >
              Our Story
            </h3>
            <p
              className="mb-8 text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Founded by a team of passionate healthcare professionals, SaKyi was born from a simple yet powerful belief: 
              that everyone deserves access to comprehensive, personalized wellness care. We&apos;ve seen too many people struggle 
              with fragmented healthcare that treats symptoms rather than addressing root causes.
            </p>
            <p
              className="text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Today, we&apos;re proud to be at the forefront of holistic wellness, combining cutting-edge medical science 
              with time-tested healing practices to help thousands of people achieve lasting health and vitality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
