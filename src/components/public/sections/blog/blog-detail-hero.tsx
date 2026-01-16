"use client";

import dayjs from "dayjs";
import { Calendar, Clock, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PATHS } from "@/config/paths";
import { BlogPost } from "@/types/public/blog";


export default function BlogDetailHero({ post }: { post: BlogPost }) {
  const pathname = usePathname();
  const hideBackButton = pathname?.startsWith("/admin/");
  const hasThumbnail = post.thumbnail && post.thumbnail.trim() !== "";
  const [imageError, setImageError] = useState(false);
  const thumbnailSource = hasThumbnail && !imageError ? post.thumbnail : "/images/no-image.png";

  const handleShare = async () => {
  const url = globalThis.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: post.title,
        text: post.description,
        url,
      });
    } catch {
    }
  } else {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }
};

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation and Category */}
        {!hideBackButton && (
          <div
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            data-aos="fade-up"
          >
            {/* Back Button */}
            <Link
              href={PATHS.PUBLIC.BLOG}
              className="group inline-flex items-center gap-2 font-medium text-slate-600 transition-colors duration-300 hover:text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        )}

        {/* Article Header */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="200">

          {/* Title */}
          <h1
            className="mb-6 text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {post?.title}
          </h1>

          {/* Description */}
          <p
            className="mb-8 text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {post?.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
          <div className="inline-flex items-center rounded-md bg-brand-gradient px-3 py-1 text-sm font-medium text-white">
            {post?.category.name}
          </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span style={{ fontFamily: "Inter, sans-serif" }}>{dayjs(post?.published_at).format("DD-MMMM-YYYY")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span style={{ fontFamily: "Inter, sans-serif" }}>{post?.reading_time}</span>
            </div>
        <button
  onClick={handleShare}
  className="flex items-center gap-2 transition-colors duration-300 hover:text-[#35bec5] cursor-pointer"
>
  <Share2 className="h-4 w-4" />
  <span style={{ fontFamily: "Inter, sans-serif" }}>Share</span>
</button>

          </div>
        </div>

        {/* Featured Image */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl" data-aos="fade-up" data-aos-delay="400">
          <div className="aspect-[16/9] w-full">
            <Image
              src={thumbnailSource}
              alt={post.title}
              width={1600}
              height={900}
              quality={95}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className={`h-full w-full ${
                hasThumbnail && !imageError ? "object-cover" : "object-contain bg-gray-100"
              }`}
              priority
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
