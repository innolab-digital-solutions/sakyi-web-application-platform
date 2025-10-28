import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogEditorsPick() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2
            className="text-3xl leading-tight font-bold sm:text-4xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Editor&apos;s{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Pick
            </span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Our team&apos;s favorite article this month—curated just for you. Discover why this
            feature stands out with its practical tips and expert insights for your wellness
            journey.
          </p>
        </div>

        {/* Featured Article */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="group relative h-80 lg:h-auto overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Editor's pick article"
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              {/* Subtle dark overlay that disappears on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-slate-800/10 transition-opacity duration-300 group-hover:opacity-0"></div>
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-white">
                  Editor&apos;s Choice
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="mb-4">
                <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  Mindfulness
                </span>
              </div>

              <h3
                className="mb-4 text-2xl font-bold leading-tight text-slate-900 lg:text-3xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                5 Small Daily Habits That Transform Your Mental Health
              </h3>

              <p
                className="mb-6 text-slate-600 leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Discover how simple micro-actions—like mindful breathing or gratitude journaling—can make a powerful impact on your mental wellbeing. Uncover practical tips designed for everyday life to help you enhance focus, resilience, and happiness.
              </p>

              <div className="mb-8 flex items-center gap-4 text-sm text-slate-500">
                <span>FEB 15, 2024</span>
                <span>•</span>
                <span>5 min read</span>
              </div>

              <Link
                href="/blog/5-small-daily-habits-transform-mental-health"
                className="group inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Read Full Article
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
