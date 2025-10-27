import { ArrowRight, Heart, Shield, Star, Users } from "lucide-react";

const impactStats = [
  {
    icon: <Users className="h-8 w-8 text-[#35bec5]" />,
    value: "10,000+",
    label: "Lives Transformed",
    description: "People who have achieved their wellness goals with our programs",
  },
  {
    icon: <Star className="h-8 w-8 text-[#35bec5]" />,
    value: "4.9★",
    label: "Average Rating",
    description: "Client satisfaction rating across all our programs",
  },
  {
    icon: <Heart className="h-8 w-8 text-[#35bec5]" />,
    value: "95%",
    label: "Success Rate",
    description: "Clients who achieve their primary wellness objectives",
  },
  {
    icon: <Shield className="h-8 w-8 text-[#35bec5]" />,
    value: "98%",
    label: "Would Recommend",
    description: "Clients who would recommend SaKyi to friends and family",
  },
];

const achievements = [
  {
    title: "Certified Healthcare Excellence",
    description: "Recognized by the National Wellness Association for outstanding patient care and innovative treatment approaches.",
  },
  {
    title: "Evidence-Based Practice Award",
    description: "Awarded for our commitment to integrating the latest medical research into personalized wellness programs.",
  },
  {
    title: "Patient-Centered Care Recognition",
    description: "Honored for our holistic approach that treats the whole person, not just symptoms.",
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
              Impact
            </span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            The numbers speak for themselves. Our evidence-based approach and personalized care 
            have helped thousands of people achieve lasting wellness and transform their lives.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              <div className="mb-6 flex justify-center">{stat.icon}</div>
              <div
                className="mb-2 text-3xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {stat.value}
              </div>
              <div
                className="mb-3 text-lg font-semibold text-slate-700"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {stat.label}
              </div>
              <p
                className="text-sm text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <h3
            className="mb-12 text-center text-2xl font-bold text-slate-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Recognition & Achievements
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay={`${index * 200}`}
              >
                <h4
                  className="mb-4 text-lg font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {achievement.title}
                </h4>
                <p
                  className="text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#35bec5] to-[#0c96c4] p-12 text-center">
          <h3
            className="mb-6 text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Ready to Start Your Wellness Journey?
          </h3>
          <p
            className="mx-auto mb-8 max-w-2xl text-lg text-white/90"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Join thousands of people who have transformed their lives with our personalized wellness programs. 
            Your journey to optimal health starts here.
          </p>
          <div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <a
              href="/programs"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[#35bec5] font-semibold transition-all duration-300 hover:bg-slate-50 hover:shadow-lg hover:scale-105"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Heart className="h-5 w-5" />
              Explore Programs
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 text-white font-semibold transition-all duration-300 hover:bg-white hover:text-[#35bec5] hover:shadow-lg hover:scale-105"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Shield className="h-5 w-5" />
              Get Free Consultation
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
