import { ArrowRight, BookOpen, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

import BlogArticles from "@/components/public/sections/blog/blog-articles";
import BlogEditorsPick from "@/components/public/sections/blog/blog-editors-pick";
import BlogHero from "@/components/public/sections/blog/blog-hero";
import CallToAction from "@/components/public/sections/call-to-action";

export default function BlogPage() {
  return (
    <>
      <BlogHero />

      <BlogArticles />

      <BlogEditorsPick />

      <CallToAction
        title="Ready to Apply What You've Learned?"
        description="You've read our expert insights and wellness tips. Now it's time to put this knowledge into action with our personalized programs. Let our doctors help you implement these strategies for lasting results."
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
              <span>Discuss Your Goals</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </>
  );
}
