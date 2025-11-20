"use client";

import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import TestimonialSkeleton from "@/components/public/shared/testimonial-skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Testimonial } from "@/types/public/testimonial";

// Helper function to render star rating
function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex space-x-1">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
      )}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={`empty-${index}`} className="h-4 w-4 text-yellow-400" />
      ))}
    </div>
  );
}

// Helper function to get user initials
function getUserInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    data: testimonialsResponse,
    loading: testimonialsLoading,
    isFetching: testimonialsFetching,
  } = useRequest({
    url: ENDPOINTS.PUBLIC.HOME_TESTIMONIALS,
    queryKey: ["home-testimonials"],
  });

  const testimonials = (testimonialsResponse?.data as Testimonial[]) ?? [];
  const isTestimonialsLoading = testimonialsLoading || testimonialsFetching;
  const hasTestimonials = testimonials.length > 0;

  // Reset current testimonial when testimonials change
  useEffect(() => {
    if (hasTestimonials && currentTestimonial >= testimonials.length) {
      setCurrentTestimonial(0);
    }
  }, [testimonials.length, hasTestimonials, currentTestimonial]);

  // Auto-rotate testimonials with hover pause and manual navigation control
  useEffect(() => {
    if (!isAutoRotating || isHovered || !hasTestimonials) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTestimonial((previous) => (previous + 1) % testimonials.length);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 350);
    }, 6000); // Slower rotation - 6 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating, isHovered, testimonials.length, hasTestimonials]);

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

  // Hide section if no testimonials exist (after loading)
  if (!isTestimonialsLoading && !hasTestimonials) {
    return;
  }

  return (
    <section id="testimonials" className="relative overflow-hidden bg-white py-24">
    {/* Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
    </div>

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="space-y-6 text-center" data-aos="zoom-in" data-aos-duration="1200" data-aos-easing="ease-out-cubic">
        <div 
          className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2"
          data-aos="slide-down"
          data-aos-delay="200"
          data-aos-duration="800"
          data-aos-easing="ease-out-back"
        >
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
          <span
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="1000"
            data-aos-easing="ease-out-cubic"
          >
            What Our{" "}
          </span>
          <span
            className="text-brand-gradient bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="500"
            data-aos-duration="1000"
            data-aos-easing="ease-out-cubic"
          >
            Clients Say
          </span>
        </h2>

        <p
          className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600"
          style={{ fontFamily: "Inter, sans-serif" }}
          data-aos="slide-up"
          data-aos-delay="700"
          data-aos-duration="1000"
          data-aos-easing="ease-out-cubic"
        >
          Real stories from people who have transformed their lives through our wellness
          programs.
        </p>
      </div>

      {/* Testimonial Carousel */}
      <div className="mt-16" data-aos="zoom-in" data-aos-delay="400" data-aos-duration="1000" data-aos-easing="ease-out-cubic">
        <div className="relative">
          {/* Navigation Buttons - Only show when testimonials are loaded */}
          {hasTestimonials && (
            <>
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
            </>
          )}

          {/* Testimonial Cards Container */}
          <div
            className="mx-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isTestimonialsLoading ? (
              // Loading Skeletons
              <>
                <div className="block lg:hidden">
                  <TestimonialSkeleton index={0} />
                </div>
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
                  <TestimonialSkeleton index={0} />
                  <TestimonialSkeleton index={1} />
                </div>
              </>
            ) : (
              <>
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
                        <div key={testimonial.id || index} className="w-full flex-shrink-0 px-4">
                          <div className="flex h-80 flex-col justify-between text-center">
                            {/* Quote */}
                            <div className="flex flex-1 items-center justify-center px-2">
                              <div className="text-center">
                                {/* Star Rating */}
                                <div className="mb-4 flex justify-center">
                                  {renderStars(testimonial.rating)}
                                </div>
                                <blockquote
                                  className="text-base leading-relaxed text-slate-700"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  &quot;{testimonial.comment}&quot;
                                </blockquote>
                              </div>
                            </div>

                            {/* Client Info */}
                            <div className="flex flex-col items-center space-y-3">
                              {testimonial.user.picture ? (
                                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                  <Image
                                    src={testimonial.user.picture}
                                    alt={testimonial.user.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                                  <span className="text-sm font-bold text-white">
                                    {getUserInitials(testimonial.user.name)}
                                  </span>
                                </div>
                              )}
                              <div className="text-center">
                                <h4
                                  className="text-base font-semibold text-slate-900"
                                  style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                  {testimonial.user.name}
                                </h4>
                                <p
                                  className="text-sm text-slate-600"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  {testimonial.program.title}
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
                  {testimonials[currentTestimonial] && (
                    <div className="relative overflow-hidden">
                      <div
                        className={`flex h-80 flex-col justify-between text-center transition-all duration-700 ease-in-out ${
                          isTransitioning
                            ? "opacity-0 transform scale-95"
                            : "opacity-100 transform scale-100"
                        }`}
                      >
                        {/* Quote */}
                        <div className="flex flex-1 items-center justify-center px-2">
                          <div className="text-center">
                            {/* Star Rating */}
                            <div className="mb-4 flex justify-center">
                              {renderStars(testimonials[currentTestimonial].rating)}
                            </div>
                            <blockquote
                              className="text-base leading-relaxed text-slate-700"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              &quot;{testimonials[currentTestimonial].comment}&quot;
                            </blockquote>
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="flex flex-col items-center space-y-3">
                          {testimonials[currentTestimonial].user.picture ? (
                            <div className="relative h-12 w-12 overflow-hidden rounded-full">
                              <Image
                                src={testimonials[currentTestimonial].user.picture}
                                alt={testimonials[currentTestimonial].user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                              <span className="text-sm font-bold text-white">
                                {getUserInitials(testimonials[currentTestimonial].user.name)}
                              </span>
                            </div>
                          )}
                          <div className="text-center">
                            <h4
                              className="text-base font-semibold text-slate-900"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {testimonials[currentTestimonial].user.name}
                            </h4>
                            <p
                              className="text-sm text-slate-600"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              {testimonials[currentTestimonial].program.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Right Column - Next Testimonial */}
                  {testimonials[(currentTestimonial + 1) % testimonials.length] && (
                    <div className="relative overflow-hidden">
                      <div
                        className={`flex h-80 flex-col justify-between text-center transition-all duration-700 ease-in-out ${
                          isTransitioning
                            ? "opacity-0 transform scale-95"
                            : "opacity-100 transform scale-100"
                        }`}
                      >
                        {/* Quote */}
                        <div className="flex flex-1 items-center justify-center px-2">
                          <div className="text-center">
                            {/* Star Rating */}
                            <div className="mb-4 flex justify-center">
                              {renderStars(
                                testimonials[(currentTestimonial + 1) % testimonials.length].rating
                              )}
                            </div>
                            <blockquote
                              className="text-base leading-relaxed text-slate-700"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              &quot;
                              {testimonials[(currentTestimonial + 1) % testimonials.length].comment}
                              &quot;
                            </blockquote>
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="flex flex-col items-center space-y-3">
                          {testimonials[(currentTestimonial + 1) % testimonials.length].user
                            .picture ? (
                            <div className="relative h-12 w-12 overflow-hidden rounded-full">
                              <Image
                                src={
                                  testimonials[(currentTestimonial + 1) % testimonials.length].user
                                    .picture
                                }
                                alt={
                                  testimonials[(currentTestimonial + 1) % testimonials.length].user
                                    .name
                                }
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                              <span className="text-sm font-bold text-white">
                                {getUserInitials(
                                  testimonials[(currentTestimonial + 1) % testimonials.length].user
                                    .name
                                )}
                              </span>
                            </div>
                          )}
                          <div className="text-center">
                            <h4
                              className="text-base font-semibold text-slate-900"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {testimonials[(currentTestimonial + 1) % testimonials.length].user
                                .name}
                            </h4>
                            <p
                              className="text-sm text-slate-600"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              {
                                testimonials[(currentTestimonial + 1) % testimonials.length].program
                                  .title
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Carousel Indicators - Only show when testimonials are loaded */}
          {hasTestimonials && (
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
          )}
        </div>
      </div>
    </div>
    </section>
  );
}