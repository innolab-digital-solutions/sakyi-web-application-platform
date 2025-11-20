"use client";

import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  FileQuestion,
  FileText,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import BlogDetailContent from "@/components/public/sections/blog/blog-detail-content";
import BlogDetailHero from "@/components/public/sections/blog/blog-detail-hero";
import BlogDetailRelated from "@/components/public/sections/blog/blog-detail-related";
import CallToAction from "@/components/public/sections/call-to-action";
import BlogCardSkeleton from "@/components/public/shared/blog-card-skeleton";
import BlogDetailSkeleton from "@/components/public/shared/blog-detail-skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { BlogPost } from "@/types/public/blog";

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParameters = React.use(params);
  const { slug } = resolvedParameters;

  const { data: postResponse, loading: postLoading } = useRequest({
    url: ENDPOINTS.PUBLIC.BLOG_POST(slug),
    queryKey: ["blog-post", slug],
  });

  const {
    data: relatedPostsResponse,
    loading: relatedPostsLoading,
    isFetching: relatedPostsFetching,
  } = useRequest({
    url: ENDPOINTS.PUBLIC.RELATED_BLOG_POSTS(slug),
    queryKey: ["related-blog-posts", slug],
  });

  const post = postResponse?.data as BlogPost | undefined;
  const relatedPosts = relatedPostsResponse?.data as BlogPost[] | undefined;
  const isRelatedPostsLoading = relatedPostsLoading || relatedPostsFetching;

  // Show skeleton while loading
  if (postLoading) {
    return <BlogDetailSkeleton />;
  }

  // Show not found only after loading is complete
  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="bg-brand-gradient mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white">
            <FileQuestion className="h-8 w-8" />
          </div>
          <h2
            className="mb-4 text-2xl font-bold text-slate-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Post Not Found
          </h2>
          <p
            className="mx-auto mb-8 max-w-md text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="bg-brand-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BlogDetailHero post={post} />

      <BlogDetailContent content={post?.content ?? ""} />

      {isRelatedPostsLoading ? (
        <section className="relative overflow-hidden bg-slate-50 py-16">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <h2
                className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Related{" "}
                <span
                  className="text-brand-gradient bg-clip-text text-transparent"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Articles
                </span>
              </h2>
              <p
                className="mx-auto max-w-2xl text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Continue your wellness journey with these handpicked articles that complement your
                reading.
              </p>
            </div>

            {/* Skeleton Cards Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              <BlogCardSkeleton index={0} />
              <BlogCardSkeleton index={1} />
            </div>
          </div>
        </section>
      ) : relatedPosts && relatedPosts.length > 0 ? (
        <BlogDetailRelated posts={relatedPosts} />
      ) : (
        <section className="relative overflow-hidden bg-slate-50 py-16">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <h2
                className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Related{" "}
                <span
                  className="text-brand-gradient bg-clip-text text-transparent"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Articles
                </span>
              </h2>
              <p
                className="mx-auto max-w-2xl text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Continue your wellness journey with these handpicked articles that complement your
                reading.
              </p>
            </div>

            {/* Empty State */}
            <div
              className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm"
              data-aos="zoom-in"
            >
              <div className="bg-brand-gradient mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white">
                <FileText className="h-8 w-8" />
              </div>
              <h3
                className="mb-4 text-2xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                No Related Articles Yet
              </h3>
              <p
                className="mx-auto mb-8 max-w-md text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                We&apos;re working on curating related articles for this post. Check back soon or
                explore our other articles.
              </p>
              <Link
                href="/blog"
                className="bg-brand-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <BookOpen className="h-5 w-5" />
                Explore All Articles
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CallToAction
        title="Ready to Put This Knowledge Into Action?"
        description="You've just learned valuable insights about mental health and wellness. Now it's time to implement these strategies with our personalized programs. Our doctors can help you create a customized plan based on what you've learned."
        actions={
          <>
            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              <span className="relative z-10">Start Your Program</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              <span>Discuss This Article</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </div>
  );
}
