import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  title: string;
  description: string;
  category: string;
  readTime?: string;
  image: string;
  imageAlt: string;
  href?: string;
}

interface BlogCardProperties {
  blog: BlogPost;
  index?: number;
  className?: string;
}

export default function BlogCard({ blog, index = 0, className = "" }: BlogCardProperties) {
  return (
    <div
      className={`group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
      data-aos="fade-up"
      data-aos-delay={`${index * 200}`}
    >
      {/* Image */}
      <div className="mb-6 overflow-hidden rounded-xl">
        <div className="aspect-[16/10] w-full">
          <Image
            src={blog.image}
            alt={blog.imageAlt}
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
            {blog.category}
          </span>
          <span className="text-sm text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>
            {blog.readTime || "5 min read"}
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
        <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
          {blog.description}
        </p>

        {/* CTA */}
        <div className="pt-2">
          <Link
            href={blog.href || "#blog"}
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
