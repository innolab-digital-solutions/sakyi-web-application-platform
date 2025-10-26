import React from "react";

import BlogArticles from "@/components/public/sections/blog/blog-articles";
import BlogCTA from "@/components/public/sections/blog/blog-cta";
import BlogEditorsPick from "@/components/public/sections/blog/blog-editors-pick";
import BlogHero from "@/components/public/sections/blog/blog-hero";

export default function BlogPage() {
  return (
    <>
      <BlogHero />

      <BlogArticles />

      <BlogEditorsPick />

      <BlogCTA />
    </>
  );
}
