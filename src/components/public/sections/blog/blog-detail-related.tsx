import { ArrowRight } from "lucide-react";
import Link from "next/link";

import BlogCard from "@/components/public/shared/blog-card";

interface RelatedPost {
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  imageAlt: string;
  slug: string;
}

interface BlogDetailRelatedProperties {
  posts: RelatedPost[];
}

export default function BlogDetailRelated({ posts }: BlogDetailRelatedProperties) {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Related{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Articles
            </span>
          </h2>
          <p
            className="mx-auto max-w-2xl text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Continue your wellness journey with these handpicked articles that complement your reading.
          </p>
        </div>

        {/* Related Posts Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {posts.map((post, index) => (
            <BlogCard
              key={index}
              blog={{
                title: post.title,
                description: post.description,
                category: post.category,
                readTime: post.readTime,
                image: post.image,
                imageAlt: post.imageAlt,
                href: `/blog/${post.slug}`,
              }}
              index={index}
            />
          ))}
        </div>

        {/* View All Button */}
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
