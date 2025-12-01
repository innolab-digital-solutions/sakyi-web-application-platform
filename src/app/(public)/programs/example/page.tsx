import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Grid3X3,
  Heart,
  Play,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import CallToAction from "@/components/public/sections/call-to-action";

export const metadata: Metadata = {
  title: "SaKyi Body Recomposition Program | Transform Your Body Composition",
  description:
    "A personalized transformation journey designed to help you achieve your ideal body composition — whether your goal is weight loss, weight gain, or muscle toning. Science-based approach with expert guidance.",
  keywords: [
    "body recomposition",
    "fitness transformation",
    "weight loss",
    "muscle building",
    "personalized health",
    "nutrition coaching",
    "wellness programs",
    "health transformation",
    "body composition",
    "fitness programs",
  ],
  authors: [{ name: "SaKyi Health & Wellness Team" }],
  creator: "SaKyi Health & Wellness",
  publisher: "SaKyi Health & Wellness",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sakyihealthandwellness.com"),
  alternates: {
    canonical: "/programs/body-recomposition",
  },
  openGraph: {
    title: "SaKyi Body Recomposition Program | Transform Your Body Composition",
    description:
      "A personalized transformation journey designed to help you achieve your ideal body composition — whether your goal is weight loss, weight gain, or muscle toning. Science-based approach with expert guidance.",
    url: "https://sakyihealthandwellness.com/programs/body-recomposition",
    siteName: "SaKyi Health & Wellness",
    images: [
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Body recomposition program - fitness transformation",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaKyi Body Recomposition Program | Transform Your Body Composition",
    description:
      "A personalized transformation journey designed to help you achieve your ideal body composition — whether your goal is weight loss, weight gain, or muscle toning. Science-based approach with expert guidance.",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    ],
    creator: "@sakyiwellness",
    site: "@sakyiwellness",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function BodyRecompositionProgramPage() {
  const program = {
    title: "SaKyi Body Recomposition Program",
    subtitle: "Transform Your Body Composition with Science-Based Approach",
    category: "Fitness & Body Transformation",
    duration: "12-16 weeks",
    difficulty: "Intermediate",
    rating: 4.8,
    participants: 1247,
    price: "From $299/month",
    image: "/images/program-3.jpg",
    imageAlt: "Body recomposition program - fitness transformation",
    overview:
      "A personalized transformation journey designed to help you achieve your ideal body composition — whether your goal is weight loss, weight gain, or muscle toning. This program integrates resistance training, cardio, and HIIT, guided by SaKyi's technical and nutritional experts.",
    idealFor: [
      "Clients aged below 50 with BMI 18-25",
      "Individuals ready for one-on-one guidance",
      "Those seeking sustainable body transformation",
      "People wanting to improve body composition",
    ],
    keyFeatures: [
      "Personalized nutrition plan with 10-20% calorie adjustment",
      "Balanced protein intake (1-1.5g per kg body weight)",
      "Integrated resistance training and cardio",
      "HIIT workouts for maximum efficiency",
      "Weekly progress tracking and adjustments",
      "24/7 expert support via mobile app",
    ],
    expectedOutcomes: [
      "Body fat reduction by 6-10%",
      "Waist-to-hip ratio improvement",
      "Lean muscle gain of around 2kg",
      "Visible body transformation",
      "Enhanced energy levels",
      "Improved metabolic health",
    ],
    programStructure: [
      {
        week: "Weeks 1-4",
        title: "Foundation Building",
        description:
          "Establish baseline fitness, learn proper form, and adapt to new nutrition plan",
      },
      {
        week: "Weeks 5-8",
        title: "Progressive Training",
        description: "Increase workout intensity and fine-tune nutrition based on initial results",
      },
      {
        week: "Weeks 9-12",
        title: "Peak Performance",
        description: "Maximize results with advanced training techniques and optimized nutrition",
      },
      {
        week: "Weeks 13-16",
        title: "Maintenance & Transition",
        description: "Consolidate gains and establish long-term sustainable habits",
      },
    ],
    requirements: [
      "Commitment to 4-5 workouts per week",
      "Access to basic gym equipment or home workout space",
      "Willingness to track food intake and progress",
      "Regular communication with your wellness coach",
      "Mobile app for tracking and communication",
    ],
    successStories: [
      {
        name: "Sarah M.",
        age: 28,
        result: "Lost 8kg body fat, gained 3kg muscle in 14 weeks",
        quote:
          "The personalized approach made all the difference. I finally achieved the body I always wanted.",
      },
      {
        name: "David L.",
        age: 35,
        result: "Improved body composition by 12% in 16 weeks",
        quote: "The combination of training and nutrition guidance was exactly what I needed.",
      },
    ],
    faq: [
      {
        question: "What if I can't commit to 4-5 workouts per week?",
        answer:
          "We can adjust the program to fit your schedule. Even 3 workouts per week can yield significant results with proper nutrition and consistency.",
      },
      {
        question: "Do I need gym equipment?",
        answer:
          "While gym equipment is ideal, we can adapt the program for home workouts using bodyweight exercises and minimal equipment.",
      },
      {
        question: "How quickly will I see results?",
        answer:
          "Most participants see initial changes within 2-3 weeks, with significant transformation visible by 6-8 weeks.",
      },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-linear-to-br from-[#35bec5]/10 to-[#4bc4db]/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-linear-to-br from-[#4bc4db]/10 to-[#0c96c4]/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-linear-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Clean Content */}
            <div
              className="space-y-8"
              data-aos="zoom-in"
              data-aos-duration="1200"
              data-aos-easing="ease-out-cubic"
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2 text-sm font-medium text-[#35bec5]"
                data-aos="slide-down"
                data-aos-delay="200"
                data-aos-duration="800"
                data-aos-easing="ease-out-back"
              >
                <Zap className="h-4 w-4" />
                <span style={{ fontFamily: "Inter, sans-serif" }}>{program.category}</span>
              </div>

              {/* Program Title */}
              <div className="space-y-6">
                <h1
                  className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-cubic"
                >
                  {program.title}
                </h1>

                <p
                  className="max-w-2xl text-lg leading-relaxed text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                  data-aos="slide-up"
                  data-aos-delay="500"
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-cubic"
                >
                  {program.overview}
                </p>
              </div>

              {/* Program Stats */}
              <div
                className="grid grid-cols-2 gap-4"
                data-aos="fade-up"
                data-aos-delay="700"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
              >
                <div className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10 transition-all duration-300 group-hover:scale-110">
                    <Clock className="h-5 w-5 text-[#35bec5]" />
                  </div>
                  <div>
                    <div
                      className="text-sm text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Duration
                    </div>
                    <div
                      className="font-semibold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {program.duration}
                    </div>
                  </div>
                </div>

                <div className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10 transition-all duration-300 group-hover:scale-110">
                    <Users className="h-5 w-5 text-[#35bec5]" />
                  </div>
                  <div>
                    <div
                      className="text-sm text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Participants
                    </div>
                    <div
                      className="font-semibold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {program.participants.toLocaleString()}+
                    </div>
                  </div>
                </div>

                <div className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10 transition-all duration-300 group-hover:scale-110">
                    <Star className="h-5 w-5 text-[#35bec5]" />
                  </div>
                  <div>
                    <div
                      className="text-sm text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Rating
                    </div>
                    <div
                      className="font-semibold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {program.rating}/5.0
                    </div>
                  </div>
                </div>

                <div className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10 transition-all duration-300 group-hover:scale-110">
                    <Heart className="h-5 w-5 text-[#35bec5]" />
                  </div>
                  <div>
                    <div
                      className="text-sm text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Price
                    </div>
                    <div
                      className="font-semibold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {program.price}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean CTA Buttons */}
              <div
                className="mt-12 flex flex-col gap-4 sm:flex-row"
                data-aos="fade-up"
                data-aos-delay="900"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
              >
                <Link
                  href="/contact"
                  className="group bg-brand-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start This Program
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/programs"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:border-[#35bec5] hover:text-[#35bec5] hover:shadow-lg"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <Grid3X3 className="mr-2 h-5 w-5" />
                  View All Programs
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Column - Image */}
            <div
              className="relative"
              data-aos="zoom-in"
              data-aos-duration="1200"
              data-aos-delay="400"
              data-aos-easing="ease-out-cubic"
            >
              <div className="group relative overflow-hidden rounded-3xl shadow-2xl">
                <div className="aspect-4/5 w-full sm:aspect-3/4">
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={100}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {/* Subtle dark overlay that disappears on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-900/20 to-slate-800/10 transition-opacity duration-300 group-hover:opacity-0"></div>
                {/* Brand gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#35bec5]/5 to-[#0c96c4]/5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Program Overview */}
          <div
            className="mb-16"
            data-aos="slide-up"
            data-aos-duration="1200"
            data-aos-easing="ease-out-cubic"
          >
            <h2
              className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              About This Program
            </h2>
            <div
              className="mt-6 max-w-4xl text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="slide-up"
              data-aos-delay="400"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              <p>{program.overview}</p>
            </div>
          </div>

          {/* Features and Target Audience */}
          <div className="mb-16 grid gap-12 lg:grid-cols-2">
            {/* What's Included */}
            <div
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              <h3
                className="mb-6 text-2xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                What&apos;s Included
              </h3>
              <div className="space-y-4">
                {program.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10">
                      <CheckCircle className="h-5 w-5 text-[#35bec5]" />
                    </div>
                    <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Who This Is For */}
            <div
              data-aos="fade-up"
              data-aos-delay="800"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              <h3
                className="mb-6 text-2xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Who This Is For
              </h3>
              <div className="space-y-4">
                {program.idealFor.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-[#35bec5]/10 to-[#0c96c4]/10">
                      <CheckCircle className="h-5 w-5 text-[#35bec5]" />
                    </div>
                    <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Results */}
      <section className="relative overflow-hidden bg-slate-50 py-24">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-linear-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-linear-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div
            className="mb-16 text-center"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-easing="ease-out-cubic"
          >
            <h2
              className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              What You Can{" "}
              <span
                className="text-brand-gradient bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Expect
              </span>
            </h2>
            <p
              className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="slide-up"
              data-aos-delay="500"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              Our evidence-based programs deliver real, measurable results tailored to your specific
              goals and needs
            </p>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {program.expectedOutcomes.map((outcome, index) => (
              <div
                key={index}
                className="group flex items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#35bec5]/50 hover:shadow-lg"
                data-aos="slide-up"
                data-aos-delay={`${index * 100 + 400}`}
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-[#35bec5] to-[#0c96c4] transition-all duration-300 group-hover:scale-105">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p
                    className="text-xl font-semibold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className="mb-16 text-center"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-easing="ease-out-cubic"
          >
            <h2
              className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              Program{" "}
              <span
                className="text-brand-gradient bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Structure
              </span>
            </h2>
            <p
              className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="slide-up"
              data-aos-delay="400"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              A structured journey designed for maximum results and sustainable progress
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {program.programStructure.map((phase, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#35bec5]/50 hover:shadow-lg sm:p-8"
                data-aos="slide-up"
                data-aos-delay={`${index * 200 + 400}`}
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
              >
                {/* Mobile Layout - Stacked */}
                <div className="flex flex-col gap-4 sm:hidden">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-[#35bec5] to-[#0c96c4] font-bold text-white transition-all duration-300 group-hover:scale-105">
                      {index + 1}
                    </div>
                    <span
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {phase.week}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="mb-2 text-lg font-semibold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {phase.title}
                    </h3>
                    <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* Desktop/Tablet Layout - Horizontal */}
                <div className="hidden sm:flex sm:items-start sm:gap-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-r from-[#35bec5] to-[#0c96c4] font-bold text-white transition-all duration-300 group-hover:scale-105">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-4">
                      <h3
                        className="text-xl font-semibold text-slate-900"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {phase.title}
                      </h3>
                      <span
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {phase.week}
                      </span>
                    </div>
                    <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                      {phase.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="relative overflow-hidden bg-slate-50 py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className="mb-16 text-center"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-easing="ease-out-cubic"
          >
            <h2
              className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              Success{" "}
              <span
                className="text-brand-gradient bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Stories
              </span>
            </h2>
            <p
              className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="slide-up"
              data-aos-delay="400"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              Real results from real people who transformed their lives with this program
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {program.successStories.map((story, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#35bec5]/50 hover:shadow-lg"
                data-aos="flip-up"
                data-aos-delay={`${index * 200 + 400}`}
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
              >
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-[#35bec5] to-[#0c96c4] font-bold text-white">
                      {story.name.charAt(0)}
                    </div>
                    <div>
                      <h4
                        className="font-semibold text-slate-900"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {story.name}
                      </h4>
                      <p
                        className="text-sm text-slate-600"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Age {story.age}
                      </p>
                    </div>
                  </div>
                  <p
                    className="mb-4 font-medium text-[#35bec5]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {story.result}
                  </p>
                  <blockquote
                    className="text-slate-600 italic"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    &quot;{story.quote}&quot;
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
          <div
            className="mb-16 text-center"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-easing="ease-out-cubic"
          >
            <h2
              className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              Frequently Asked{" "}
              <span
                className="text-brand-gradient bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Questions
              </span>
            </h2>
            <p
              className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-aos="slide-up"
              data-aos-delay="400"
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
            >
              Everything you need to know about this program
            </p>
          </div>

          <div className="space-y-6">
            {program.faq.map((item, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#35bec5]/50 hover:shadow-lg"
                data-aos="slide-up"
                data-aos-delay={`${index * 100 + 400}`}
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
              >
                <h3
                  className="mb-4 text-lg font-semibold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {item.question}
                </h3>
                <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CallToAction
        title="Ready to Transform Your Body?"
        description="Join thousands of people who have achieved their body composition goals with our science-based approach. Start your transformation journey today with personalized guidance from certified experts."
        actions={
          <>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Heart className="mr-2 h-5 w-5" />
              <span className="relative z-10">Start This Program</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Calendar className="mr-2 h-5 w-5" />
              <span>Explore All Programs</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </div>
  );
}
