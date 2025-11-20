import { ArrowRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PATHS } from "@/config/paths";
import { BlogPost } from "@/types/public/blog";

interface BlogCardProperties {
  blog: BlogPost;
  index?: number;
  className?: string;
}

export default function BlogCard({ blog, index = 0, className = "" }: BlogCardProperties) {
  const hasThumbnail = blog.thumbnail && blog.thumbnail.trim() !== "";

  return (
    <div
      className={`group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
      data-aos="fade-up"
      data-aos-delay={`${index * 200}`}
    >
      {/* Image */}
      <div className="mb-6 overflow-hidden rounded-xl">
        <div className="group/image relative aspect-[16/10] w-full">
          {hasThumbnail ? (
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              width={600}
              height={375}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#35bec5]/20 via-[#4bc4db]/20 to-[#0c96c4]/20">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4] text-white">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                  No image
                </p>
              </div>
            </div>
          )}
          {/* Subtle dark overlay that disappears on hover */}
          {hasThumbnail && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-slate-800/10 transition-opacity duration-300 group-hover:opacity-0"></div>
          )}
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
            {blog.category.name}
          </span>
          <span className="text-sm text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>
            {blog.reading_time || "5 min read"}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-2xl leading-tight font-bold text-slate-900"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {blog.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 line-clamp-3" style={{ fontFamily: "Inter, sans-serif" }}>
          {blog.description}
        </p>

        {/* CTA */}
        <div className="pt-2">
          <Link
            href= {PATHS.PUBLIC.BLOG_DETAIL(blog.slug)}
            className="group/link inline-flex items-center text-base font-medium text-slate-900 transition-all duration-300 hover:text-[#35bec5]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <span>Read more</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
