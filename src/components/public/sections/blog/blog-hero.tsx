import { Sparkles } from "lucide-react";

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2 text-sm font-medium text-[#35bec5]">
            <Sparkles className="h-4 w-4" />
            <span style={{ fontFamily: "Inter, sans-serif" }}>Editorial</span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
            data-aos-duration="800"
          >
            The{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              SaKyi Journal
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            Your trusted space for wellness inspiration, mindfulness practices, and healthy living tips. 
            Discover evidence-based insights to support your journey toward holistic wellbeing.
          </p>
        </div>
      </div>
    </section>
  );
}
