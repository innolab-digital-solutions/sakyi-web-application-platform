"use client";

import { ArrowRight, BookOpen, FileText } from "lucide-react";
import Link from "next/link";

import BlogCard from "@/components/public/shared/blog-card";
import BlogCardSkeleton from "@/components/public/shared/blog-card-skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { BlogPost } from "@/types/public/blog";

export default function ArticleInsights() {
  const {
    data: blogPostsResponse,
    loading: blogPostsLoading,
    isFetching: blogPostsFetching,
  } = useRequest({
    url: ENDPOINTS.PUBLIC.HOME_BLOG_POSTS,
    queryKey: ["home-blog-posts"],
  });

  const blogPosts = (blogPostsResponse?.data as BlogPost[]) ?? [];
  const isBlogPostsLoading = blogPostsLoading || blogPostsFetching;
  const hasPosts = blogPosts.length > 0;
  return (
          <section id="blog" className="relative overflow-hidden bg-slate-50 py-24">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
            <div className="absolute bottom-1/3 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
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
                <BookOpen className="h-4 w-4 text-[#35bec5]" />
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
                className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Discover evidence-based wellness tips, expert advice, and inspiring stories to support
                your health and wellness goals.
              </p>
            </div>
  
            {/* Blog Cards */}
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              {isBlogPostsLoading ? (
                <>
                  <BlogCardSkeleton index={0} />
                  <BlogCardSkeleton index={1} />
                </>
              ) : hasPosts ? (
                blogPosts.map((post, index) => (
                  <BlogCard key={post.id || index} blog={post} index={index} />
                ))
              ) : (
                <div
                  className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm"
                  data-aos="zoom-in"
                >
                  <div className="bg-brand-gradient mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3
                    className="mb-4 text-2xl font-bold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    No Articles Available Yet
                  </h3>
                  <p
                    className="mx-auto max-w-md text-slate-600"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    We&apos;re working on creating valuable wellness content for you. Check back
                    soon for expert insights and tips.
                  </p>
                </div>
              )}
            </div>
  
            {/* CTA */}
            <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="600">
              <Link
                href={PATHS.PUBLIC.BLOG}
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