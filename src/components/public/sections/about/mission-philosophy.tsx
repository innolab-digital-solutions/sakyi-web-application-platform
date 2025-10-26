import { Heart, Lightbulb, Target, Users } from "lucide-react";

export default function MissionPhilosophy() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-6 text-center" data-aos="fade-up">
          <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <Heart className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Our Mission & Philosophy
            </span>
          </div>

          <h2
            className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Empowering Wellness Through{" "}
            <span
              className="text-brand-gradient bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Compassionate Innovation
            </span>
          </h2>

          <p
            className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Our mission is to revolutionize healthcare by making personalized wellness 
            accessible to everyone, everywhere. We believe in the power of technology 
            combined with human compassion to transform lives.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Mission */}
          <div
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
            data-aos="fade-right"
          >
            <div className="relative z-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                <Target className="h-8 w-8 text-white" />
              </div>
              
              <h3
                className="mb-4 text-2xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Our Mission
              </h3>
              
              <p
                className="text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                To democratize healthcare by providing personalized, accessible, and 
                effective wellness solutions that empower individuals to take control 
                of their health journey and achieve their wellness goals.
              </p>
            </div>
            
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          {/* Vision */}
          <div
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
            data-aos="fade-left"
          >
            <div className="relative z-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#4bc4db] to-[#35bec5]">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              
              <h3
                className="mb-4 text-2xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Our Vision
              </h3>
              
              <p
                className="text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                To create a world where everyone has access to personalized healthcare 
                that not only treats symptoms but addresses the root causes of health 
                challenges, fostering a culture of proactive wellness and prevention.
              </p>
            </div>
            
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          <h3
            className="mb-12 text-center text-2xl font-bold text-slate-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Our Core Values
          </h3>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                title: "Compassion",
                description: "We approach every interaction with empathy, understanding, and genuine care for your wellbeing."
              },
              {
                icon: Users,
                title: "Accessibility",
                description: "Healthcare should be available to everyone, regardless of location, background, or circumstances."
              },
              {
                icon: Target,
                title: "Personalization",
                description: "Every wellness journey is unique, and we tailor our approach to your specific needs and goals."
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "We continuously evolve our methods and technology to provide the most effective care possible."
              }
            ].map((value, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10">
                  <value.icon className="h-6 w-6 text-[#35bec5]" />
                </div>
                <h4
                  className="mb-3 text-lg font-semibold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {value.title}
                </h4>
                <p
                  className="text-sm text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
