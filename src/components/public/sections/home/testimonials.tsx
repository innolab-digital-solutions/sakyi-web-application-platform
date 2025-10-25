"use client";

import { ArrowRight, Star } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        "SaKyi helped me rebuild my confidence and improve my energy levels. The weekly doctor feedback made everything feel personalized and achievable.",
      name: "Thida M.",
      program: "Mind Wellness Program",
    },
    {
      quote:
        "I didn't expect such progress. My daily mood and focus improved drastically after only three weeks!",
      name: "Ko Aung",
      program: "Productivity Program",
    },
    {
      quote: "This feels like a friend guiding me every week — calm, positive, and effective.",
      name: "May N.",
      program: "Weight Management Program",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((previous) => (previous + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="relative overflow-hidden bg-white py-24">
    {/* Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
    </div>

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
          <Star className="h-4 w-4 text-[#35bec5]" />
          <span
            className="text-sm font-medium text-[#35bec5]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Testimonials
          </span>
        </div>

        <h2
          className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          What Our{" "}
          <span
            className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Clients Say
          </span>
        </h2>

        <p
          className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Real stories from people who have transformed their lives through our wellness
          programs.
        </p>
      </div>

      {/* Testimonial Carousel */}
      <div className="mt-16" data-aos="fade-up" data-aos-delay="200">
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() =>
              setCurrentTestimonial(
                (previous) => (previous - 1 + testimonials.length) % testimonials.length,
              )
            }
            className="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white shadow-lg transition-all duration-300 hover:border-[#35bec5] hover:bg-slate-50"
          >
            <ArrowRight className="h-4 w-4 rotate-180 text-slate-600" />
          </button>

          <button
            onClick={() =>
              setCurrentTestimonial((previous) => (previous + 1) % testimonials.length)
            }
            className="absolute top-1/2 right-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white shadow-lg transition-all duration-300 hover:border-[#35bec5] hover:bg-slate-50"
          >
            <ArrowRight className="h-4 w-4 text-slate-600" />
          </button>

          {/* Testimonial Cards */}
          <div className="mx-12 grid gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                  width: `${testimonials.length * 100}%`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-1/2 flex-shrink-0 px-4">
                    <div className="flex h-80 flex-col justify-between rounded-2xl bg-white p-8 text-center">
                      {/* Quote */}
                      <div className="flex flex-1 items-center justify-center px-4">
                        <blockquote
                          className="text-base leading-relaxed break-words text-slate-700"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          &quot;{testimonial.quote}&quot;
                        </blockquote>
                      </div>

                      {/* Client Info */}
                      <div className="flex flex-col items-center space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                          <span className="text-sm font-bold text-white">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div className="text-center">
                          <h4
                            className="text-base font-semibold text-slate-900"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {testimonial.name}
                          </h4>
                          <p
                            className="text-sm text-slate-600"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {testimonial.program}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                  width: `${testimonials.length * 100}%`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-1/2 flex-shrink-0 px-4">
                    <div className="flex h-80 flex-col justify-between rounded-2xl bg-white p-8 text-center">
                      {/* Quote */}
                      <div className="flex flex-1 items-center justify-center px-4">
                        <blockquote
                          className="text-base leading-relaxed break-words text-slate-700"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          &quot;{testimonial.quote}&quot;
                        </blockquote>
                      </div>

                      {/* Client Info */}
                      <div className="flex flex-col items-center space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                          <span className="text-sm font-bold text-white">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div className="text-center">
                          <h4
                            className="text-base font-semibold text-slate-900"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {testimonial.name}
                          </h4>
                          <p
                            className="text-sm text-slate-600"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {testimonial.program}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="mt-8 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "w-8 bg-gradient-to-r from-[#35bec5] to-[#0c96c4]"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}