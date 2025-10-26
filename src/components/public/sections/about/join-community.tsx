import { ArrowRight, Heart, Mail, Users } from "lucide-react";
import Link from "next/link";

export default function JoinCommunity() {
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
            <Users className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Join the SaKyi Community
            </span>
          </div>

          <h2
            className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Be Part of a{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Wellness Revolution
            </span>
          </h2>

          <p
            className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Join thousands of individuals who are transforming their lives through 
            personalized wellness. Be part of a supportive community that&apos;s committed 
            to achieving better health together.
          </p>
        </div>

        {/* Community Benefits */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {[
            {
              icon: Heart,
              title: "Personalized Care",
              description: "Get a wellness plan tailored specifically to your needs, goals, and lifestyle.",
              features: ["Custom health assessments", "Personalized nutrition plans", "Individualized exercise routines"]
            },
            {
              icon: Users,
              title: "Expert Support",
              description: "Access to certified doctors and wellness experts who guide you every step of the way.",
              features: ["24/7 expert guidance", "Regular health check-ins", "Continuous program adjustments"]
            },
            {
              icon: Mail,
              title: "Community Connection",
              description: "Connect with like-minded individuals on similar wellness journeys for motivation and support.",
              features: ["Peer support groups", "Success story sharing", "Community challenges"]
            }
          ].map((benefit, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10">
                <benefit.icon className="h-8 w-8 text-[#35bec5]" />
              </div>
              
              <h3
                className="mb-4 text-xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {benefit.title}
              </h3>
              
              <p
                className="mb-6 text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {benefit.description}
              </p>
              
              <ul className="space-y-2">
                {benefit.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center space-x-2 text-sm text-slate-600"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[#35bec5]"></div>
                    <span style={{ fontFamily: "Inter, sans-serif" }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* How to Get Started */}
        <div className="mt-20">
          <h3
            className="mb-12 text-center text-2xl font-bold text-slate-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            How to Get Started
          </h3>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Sign Up & Assessment",
                description: "Create your account and complete our comprehensive health assessment to understand your current wellness status."
              },
              {
                step: "02",
                title: "Get Your Plan",
                description: "Receive your personalized wellness plan designed by our expert team based on your assessment results."
              },
              {
                step: "03",
                title: "Start Your Journey",
                description: "Begin your wellness journey with ongoing support from our team and community of like-minded individuals."
              }
            ].map((step, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4] text-white text-lg font-bold">
                  {step.step}
                </div>
                
                <h4
                  className="mb-4 text-lg font-semibold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {step.title}
                </h4>
                
                <p
                  className="text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center" data-aos="fade-up">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-12 shadow-sm">
            <h3
              className="mb-4 text-3xl font-bold text-slate-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Ready to Transform Your Life?
            </h3>
            
            <p
              className="mb-8 text-lg text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Join the SaKyi community today and start your personalized wellness journey. 
              Your healthier, happier life begins now.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#programs"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="#contact"
                className="group inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-300 hover:border-[#35bec5] hover:bg-slate-50"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span>Learn More</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
