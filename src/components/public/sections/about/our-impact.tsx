import { Award, Heart, Star, TrendingUp, Users } from "lucide-react";

export default function OurImpact() {
  const impactStats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Lives Transformed",
      description: "Individuals who have achieved their wellness goals"
    },
    {
      icon: Heart,
      value: "98%",
      label: "Success Rate",
      description: "Of our members report improved health outcomes"
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: "Goal Achievement",
      description: "Members who reach their primary wellness objectives"
    },
    {
      icon: Award,
      value: "4.9/5",
      label: "Member Satisfaction",
      description: "Average rating from our community members"
    }
  ];

  const achievements = [
    {
      title: "Healthcare Innovation Award 2024",
      description: "Recognized for outstanding contribution to personalized healthcare technology",
      year: "2024"
    },
    {
      title: "Best Wellness Platform",
      description: "Awarded by the International Wellness Association for excellence in digital health",
      year: "2023"
    },
    {
      title: "Patient Safety Excellence",
      description: "Certified for maintaining the highest standards in patient care and safety",
      year: "2023"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Diabetes Management Program",
      quote: "SaKyi's personalized approach helped me manage my diabetes better than ever. The continuous support and expert guidance made all the difference.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Weight Management Program",
      quote: "I lost 30 pounds and gained a new perspective on health. The team's expertise and encouragement kept me motivated throughout my journey.",
      rating: 5
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
        <div className="space-y-6 text-center" data-aos="fade-up">
          <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <TrendingUp className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Our Impact So Far
            </span>
          </div>

          <h2
            className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Transforming Lives Through{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Proven Results
            </span>
          </h2>

          <p
            className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Our impact speaks for itself. Through personalized care, innovative technology, 
            and unwavering commitment to our members&apos; success, we&apos;ve achieved remarkable 
            results that continue to inspire us every day.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10">
                <stat.icon className="h-8 w-8 text-[#35bec5]" />
              </div>
              
              <div
                className="mb-2 text-3xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {stat.value}
              </div>
              
              <h3
                className="mb-2 text-lg font-semibold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {stat.label}
              </h3>
              
              <p
                className="text-sm text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Achievements & Recognition */}
        <div className="mt-20">
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
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className="text-sm font-semibold text-[#35bec5]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {achievement.year}
                  </span>
                </div>
                
                <h4
                  className="mb-3 text-lg font-semibold text-slate-900"
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

        {/* Member Testimonials */}
        <div className="mt-20">
          <h3
            className="mb-12 text-center text-2xl font-bold text-slate-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            What Our Members Say
          </h3>
          
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                {/* Rating */}
                <div className="mb-4 flex items-center space-x-1">
                  {Array.from({length: testimonial.rating}).map((_, index_) => (
                    <Star key={index_} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote
                  className="mb-4 text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                
                {/* Author */}
                <div>
                  <div
                    className="font-semibold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    className="text-sm text-[#35bec5]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center" data-aos="fade-up">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3
              className="mb-4 text-2xl font-bold text-slate-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Ready to Start Your Wellness Journey?
            </h3>
            <p
              className="mb-6 text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Join thousands of individuals who have transformed their lives with SaKyi&apos;s 
              personalized wellness programs.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#programs"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="relative z-10">Explore Programs</span>
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-all duration-300 hover:border-[#35bec5] hover:bg-slate-50"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
