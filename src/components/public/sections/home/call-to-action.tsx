import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
  return (
          <section className="relative overflow-hidden bg-white py-24">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
            <div className="absolute bottom-1/3 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
          </div>
  
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* CTA Card */}
            <div
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-12 text-center shadow-xl"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5"></div>
  
              <div className="relative">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
                  <span
                    className="text-sm font-medium text-[#35bec5]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Ready to Start?
                  </span>
                </div>
  
                {/* Headline */}
                <h2
                  className="mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Ready to Transform{" "}
                  <span
                    className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Your Life?
                  </span>
                </h2>
  
                {/* Description */}
                <p
                  className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Join thousands of individuals who have already started their wellness journey with
                  SaKyi. Get personalized guidance from certified doctors and achieve your health
                  goals.
                </p>
  
                {/* CTA Buttons */}
                <div
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <Link
                    href="#programs"
                    className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <span className="relative z-10">Start Your Journey</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0c96c4] via-[#4bc4db] to-[#35bec5] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </Link>
  
                  <Link
                    href="#contact"
                    className="group inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-300 hover:border-[#35bec5] hover:bg-slate-50 hover:text-[#35bec5]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
  
                {/* Trust Indicators */}
                <div className="mt-12 grid grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="400">
                  <div className="text-center">
                    <div
                      className="mb-2 text-2xl font-bold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      10,000+
                    </div>
                    <div
                      className="text-sm text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Happy Clients
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="mb-2 text-2xl font-bold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      98%
                    </div>
                    <div
                      className="text-sm text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Success Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="mb-2 text-2xl font-bold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      4.9/5
                    </div>
                    <div
                      className="text-sm text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Client Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}