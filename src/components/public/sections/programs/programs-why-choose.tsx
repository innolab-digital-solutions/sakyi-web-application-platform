import { Award, Heart, Shield, Star, Users, Zap } from "lucide-react";

export default function ProgramsWhyChoose() {
  const benefits = [
    {
      icon: Shield,
      title: "Medical Expertise",
      description: "All programs are designed and supervised by certified doctors with years of experience in wellness and preventive medicine.",
      color: "from-[#35bec5] to-[#4bc4db]"
    },
    {
      icon: Heart,
      title: "Personalized Approach",
      description: "Every program is tailored to your specific needs, goals, and lifestyle, ensuring maximum effectiveness and sustainability.",
      color: "from-[#4bc4db] to-[#0c96c4]"
    },
    {
      icon: Users,
      title: "Proven Results",
      description: "Join thousands of satisfied clients who have successfully transformed their health and achieved their wellness goals.",
      color: "from-[#35bec5] to-[#0c96c4]"
    },
    {
      icon: Zap,
      title: "Science-Based Methods",
      description: "Our programs are built on the latest research and evidence-based practices in wellness, nutrition, and mental health.",
      color: "from-[#4bc4db] to-[#35bec5]"
    },
    {
      icon: Award,
      title: "Comprehensive Support",
      description: "Get 24/7 support, regular check-ins, and access to our community of wellness experts and like-minded individuals.",
      color: "from-[#35bec5] to-[#0c96c4]"
    },
    {
      icon: Star,
      title: "Lifetime Access",
      description: "Once you complete your program, you'll have lifetime access to resources, updates, and ongoing support for continued success.",
      color: "from-[#4bc4db] to-[#0c96c4]"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2
            className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Why Choose{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              SaKyi?
            </span>
          </h2>
          <p
            className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            We&apos;re not just another wellness program. We&apos;re a comprehensive health transformation platform 
            backed by medical expertise, personalized care, and proven results.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={`${index * 200}`}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${benefit.color} shadow-lg`}>
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3
                  className="text-xl font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="text-slate-600 leading-relaxed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {benefit.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="mt-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="h-1 w-0 bg-gradient-to-r from-[#35bec5] to-[#0c96c4] transition-all duration-500 group-hover:w-full"></div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
