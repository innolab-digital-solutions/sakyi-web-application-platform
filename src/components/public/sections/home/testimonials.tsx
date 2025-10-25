"use client";

import { ArrowRight, Star } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      quote:
        "SaKyi helped me rebuild my confidence and improve my energy levels. The weekly doctor feedback made everything feel personalized and achievable. I genuinely feel seen and supported, and now I wake up with a sense of purpose and a positive mindset toward my health journey. I never thought a program could be so motivating and easy to stick with.",
      name: "Thida M.",
      program: "Mind Wellness Program",
    },
    {
      quote:
        "I didn't expect such progress. My daily mood and focus improved drastically after only three weeks! The actionable steps and regular check-ins made all the difference, and seeing real results has kept me motivated. SaKyi’s approach is structured, caring, and truly delivers long-term change. I’m now more productive and balanced than ever.",
      name: "Ko Aung",
      program: "Productivity Program",
    },
    {
      quote:
        "This feels like a friend guiding me every week — calm, positive, and effective. The personal encouragement and structure helped me break old habits and form new ones that truly last. I have more energy, my self-esteem is up, and I actually look forward to tracking my progress. It’s made healthy living enjoyable instead of stressful.",
      name: "May N.",
      program: "Weight Management Program",
    },
    {
      quote:
        "The app made it so easy to stick to my routine. My sugar levels are down and I feel more energetic than ever. I love the way my doctor responds to my weekly updates and adapts my plan. The information and support feel tailor-made for my needs. I wish I had started with SaKyi sooner—it’s truly life-changing.",
      name: "U Win Soe",
      program: "Diabetes Care Program",
    },
    {
      quote:
        "After joining, my sleep improved and my stress is way down. Grateful for my doctor's advice each step. Not only do I feel supported, but I also gained practical tools to manage daily challenges. The mindfulness exercises really helped quiet my mind at night, and I feel more in control of my wellbeing than before.",
      name: "Ei Mon Kyaing",
      program: "Mind Wellness Program",
    },
    {
      quote:
        "Personalized routines helped me lose weight in a healthy way. I feel more positive about my body and habits. The progress tracking and kind encouragement made a huge difference. Instead of a short-term fix, I learned how to create lasting routines that work for me. My outlook on health and self-care has completely changed.",
      name: "Mya Thida",
      program: "Weight Management Program",
    },
    {
      quote:
        "Before SaKyi, I struggled with discipline. Now, I look forward to checking my progress in the app every day. Setting daily intentions, receiving feedback, and seeing even small wins kept me moving forward. My work and home life both feel more organized, and I’m proud of how far I’ve come.",
      name: "Khine Linn",
      program: "Productivity Program",
    },
    {
      quote:
        "With SaKyi's guidance, my heart health is better, and I have the confidence to be more active with my family. The lessons and exercises are practical and easy to follow, and my whole family benefits from the changes I’ve made. SaKyi’s support has given me hope, energy, and a much healthier outlook.",
      name: "Moe Kyaw",
      program: "Cardiac Health & Rehab Program",
    },
    {
      quote:
        "Every week, I see improvement. My doctor adjusts my plan to match my progress, and I never feel alone. The regular encouragement and flexible approach mean I always have clear next steps, no matter where I’m starting. I look forward to each update and am excited to keep going.",
      name: "Sandi Myint",
      program: "Diabetes Care Program",
    },
    {
      quote:
        "I've finally found something that works for me. The support, the community, and my dedicated coach made all the difference. I used to feel stuck, but now I have the confidence and knowledge to keep pushing forward. The SaKyi program fits into my lifestyle, and I feel proud of the achievements I’ve made along the way.",
      name: "Aye Chan",
      program: "Weight Management Program",
    },
  ];

  // Auto-rotate testimonials with hover pause and manual navigation control
  useEffect(() => {
    if (!isAutoRotating || isHovered) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTestimonial((previous) => (previous + 1) % testimonials.length);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 350);
    }, 6000); // Slower rotation - 6 seconds
    
    return () => clearInterval(interval);
  }, [isAutoRotating, isHovered, testimonials.length]);

  // Handle manual navigation with smooth transitions
  const handlePrevious = () => {
    setIsAutoRotating(false); // Stop auto-rotation when user manually navigates
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((previous) => (previous - 1 + testimonials.length) % testimonials.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 350);
    // Restart auto-rotation after 10 seconds of inactivity
    setTimeout(() => setIsAutoRotating(true), 10_000);
  };

  const handleNext = () => {
    setIsAutoRotating(false); // Stop auto-rotation when user manually navigates
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((previous) => (previous + 1) % testimonials.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 350);
    // Restart auto-rotation after 10 seconds of inactivity
    setTimeout(() => setIsAutoRotating(true), 10_000);
  };

  const handleIndicatorClick = (index: number) => {
    setIsAutoRotating(false); // Stop auto-rotation when user clicks indicator
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 350);
    // Restart auto-rotation after 10 seconds of inactivity
    setTimeout(() => setIsAutoRotating(true), 10_000);
  };

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
            onClick={handlePrevious}
            className="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white shadow-lg transition-all duration-300 hover:border-[#35bec5] hover:bg-slate-50"
          >
            <ArrowRight className="h-4 w-4 rotate-180 text-slate-600" />
          </button>

          <button
            onClick={handleNext}
            className="absolute top-1/2 right-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white shadow-lg transition-all duration-300 hover:border-[#35bec5] hover:bg-slate-50"
          >
            <ArrowRight className="h-4 w-4 text-slate-600" />
          </button>

          {/* Testimonial Cards Container */}
          <div 
            className="mx-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Mobile/Tablet: Single Column */}
            <div className="block lg:hidden">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentTestimonial * 100}%)`,
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="flex h-80 flex-col justify-between text-center">
                  {/* Quote */}
                  <div className="flex flex-1 items-center justify-center px-2">
                    <div className="text-center">
                      {/* Star Rating */}
                      <div className="mb-4 flex justify-center">
                        <div className="flex space-x-1">
                          {Array.from({length: 5}).map((_, index_) => (
                            <Star
                              key={index_}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <blockquote
                        className="text-base leading-relaxed text-slate-700"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        &quot;{testimonial.quote}&quot;
                      </blockquote>
                    </div>
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

            {/* Desktop: Two Columns */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
              {/* Left Column - Current Testimonial */}
              <div className="relative overflow-hidden">
                <div className={`flex h-80 flex-col justify-between text-center transition-all duration-700 ease-in-out ${
                  isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                }`}>
                  {/* Quote */}
                  <div className="flex flex-1 items-center justify-center px-2">
                    <div className="text-center">
                      {/* Star Rating */}
                      <div className="mb-4 flex justify-center">
                        <div className="flex space-x-1">
                          {Array.from({length: 5}).map((_, index) => (
                            <Star
                              key={index}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <blockquote
                        className="text-base leading-relaxed text-slate-700"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        &quot;{testimonials[currentTestimonial]?.quote}&quot;
                      </blockquote>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                      <span className="text-sm font-bold text-white">
                        {testimonials[currentTestimonial]?.name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-center">
                      <h4
                        className="text-base font-semibold text-slate-900"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {testimonials[currentTestimonial]?.name}
                      </h4>
                      <p
                        className="text-sm text-slate-600"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {testimonials[currentTestimonial]?.program}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Next Testimonial */}
              <div className="relative overflow-hidden">
                <div className={`flex h-80 flex-col justify-between text-center transition-all duration-700 ease-in-out ${
                  isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                }`}>
                  {/* Quote */}
                  <div className="flex flex-1 items-center justify-center px-2">
                    <div className="text-center">
                      {/* Star Rating */}
                      <div className="mb-4 flex justify-center">
                        <div className="flex space-x-1">
                          {Array.from({length: 5}).map((_, index) => (
                            <Star
                              key={index}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <blockquote
                        className="text-base leading-relaxed text-slate-700"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        &quot;{testimonials[(currentTestimonial + 1) % testimonials.length]?.quote}&quot;
                      </blockquote>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                      <span className="text-sm font-bold text-white">
                        {testimonials[(currentTestimonial + 1) % testimonials.length]?.name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-center">
                      <h4
                        className="text-base font-semibold text-slate-900"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {testimonials[(currentTestimonial + 1) % testimonials.length]?.name}
                      </h4>
                      <p
                        className="text-sm text-slate-600"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {testimonials[(currentTestimonial + 1) % testimonials.length]?.program}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="mt-8 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleIndicatorClick(index)}
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