import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ArticleInsights() {
  
  const blogPosts = [
    {
      title: "5 Small Daily Habits That Transform Your Mental Health",
      description:
        "Discover how simple micro-actions—like mindful breathing or gratitude journaling—can make a powerful impact on your mental wellbeing. Uncover practical tips designed for everyday life to help you enhance focus, resilience, and happiness. Start your journey to a healthier mind with easy, actionable habits you can adopt today.",
      category: "Mind Wellness",
      date: "FEB 15, 2024",
    },
    {
      title: "How to Eat Mindfully: A Doctor's Approach to Nutrition",
      description:
        "Explore how awareness and intention at the table lead to better nutrition and improved mood. Learn real strategies from physicians to cultivate mindful eating, prevent overeating, and savor every meal. Transform your relationship with food for lasting mental and physical wellness.",
      category: "Healthy Living",
      date: "FEB 10, 2024",
    },
  ];

  return (
          <section id="blog" className="relative overflow-hidden bg-slate-50 py-24">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
            <div className="absolute bottom-1/3 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
          </div>
  
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-[#35bec5]" />
                <span
                  className="text-sm font-medium text-[#35bec5]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Wellness Insights
                </span>
              </div>
  
              <h2
                className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Expert Insights for{" "}
                <span
                  className="text-brand-gradient bg-clip-text text-transparent"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Your Wellness Journey
                </span>
              </h2>
  
              <p
                className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Discover evidence-based wellness tips, expert advice, and inspiring stories to support
                your health and wellness goals.
              </p>
            </div>
  
            {/* Blog Cards */}
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              {blogPosts.map((post, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                  data-aos="fade-up"
                  data-aos-delay={`${index * 200}`}
                >
                  {/* Image */}
                  <div className="mb-6 overflow-hidden rounded-xl">
                    <div className="aspect-[16/10] w-full">
                      <Image
                        src={
                          index === 0
                            ? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                            : index === 1
                              ? "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                              : "https://images.unsplash.com/photo-1541781774459-1c4f39c59df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                        }
                        alt={post.title}
                        width={600}
                        height={375}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
  
                  {/* Content */}
                  <div className="space-y-6">
                    {/* Metadata Row */}
                    <div className="flex items-center space-x-4">
                      <span
                        className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {post.category}
                      </span>
                      <span
                        className="text-sm text-slate-500"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        5 min read
                      </span>
                    </div>
  
                    {/* Title */}
                    <h3
                      className="text-2xl leading-tight font-bold text-slate-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {post.title}
                    </h3>
  
                    {/* Description */}
                    <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                      {post.description}
                    </p>
  
                    {/* CTA */}
                    <div className="pt-2">
                      <Link
                        href="#blog"
                        className="group/link inline-flex items-center text-base font-medium text-slate-900 transition-all duration-300 hover:text-[#35bec5]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <span>Read more</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
  
            {/* CTA */}
            <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="600">
              <Link
                href="#blog"
                className="group inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="relative z-10">View All Articles</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
  );
}