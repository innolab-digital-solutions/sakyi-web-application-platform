import { ArrowRight, Heart, Shield } from "lucide-react";
import Link from "next/link";

export default function ProgramsCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#35bec5] to-[#0c96c4] py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Ready to Transform Your Life?
          </h2>
          <p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/90"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Join thousands of people who have already transformed their health and wellness with our 
            personalized programs. Your journey to a healthier, happier life starts today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center" data-aos="fade-up" data-aos-delay="400">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[#35bec5] font-semibold transition-all duration-300 hover:bg-slate-50 hover:shadow-lg hover:scale-105"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Heart className="h-5 w-5" />
              Start Your Journey
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="#programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 text-white font-semibold transition-all duration-300 hover:bg-white hover:text-[#35bec5] hover:shadow-lg hover:scale-105"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Shield className="h-5 w-5" />
              Explore Programs
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
