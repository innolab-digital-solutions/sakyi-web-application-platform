"use client";

import { BookOpen, FileQuestion } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import BlogCard from "@/components/public/shared/blog-card";
import BlogCardSkeleton from "@/components/public/shared/blog-card-skeleton";
import Pagination from "@/components/public/shared/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { BlogCategory, BlogPost } from "@/types/public/blog";
import { Pagination as PaginationMeta } from "@/types/shared/common";

export default function BlogArticles() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesSectionReference = useRef<HTMLElement>(null);
  const isInitialMount = useRef(true);

  const {
    data: categoriesResponse,
    loading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useRequest({
    url: ENDPOINTS.PUBLIC.BLOG_CATEGORIES,
    queryKey: ["blog-categories"],
    staleTime: 1000 * 60 * 5,
  });

  const postsQueryParameters = useMemo(() => {
    const parameters: Record<string, string> = {
      page: currentPage.toString(),
    };

    if (selectedCategory) {
      parameters.category = selectedCategory;
    }

    return parameters;
  }, [currentPage, selectedCategory]);

  const {
    data: postsResponse,
    loading: postsLoading,
    isFetching: postsFetching,
  } = useRequest({
    url: ENDPOINTS.PUBLIC.BLOG_POSTS,
    queryKey: ["blog-posts", selectedCategory ?? "all", currentPage.toString()],
    data: postsQueryParameters,
    staleTime: 1000 * 60 * 5,
  });

  const categories = (categoriesResponse?.data as BlogCategory[]) ?? [];
  const posts = (postsResponse?.data as BlogPost[]) ?? [];
  const pagination = postsResponse?.meta?.pagination as PaginationMeta | undefined;
  const totalAvailablePosts = pagination?.total ?? posts.length;
  const hasPosts = totalAvailablePosts > 0;
  const isPostsLoading = postsLoading || postsFetching;
  const isAllCategoryActive = selectedCategory === undefined;
  const shouldShowAllFilter = hasPosts || !isAllCategoryActive;
  const totalPages = Math.max(pagination?.last_page ?? 1, 1);

  const scrollToArticles = useCallback((immediate = false) => {
    if (articlesSectionReference.current) {
      if (immediate) {
        // Immediate scroll without animation for instant positioning
        // Use scrollIntoView for more reliable positioning
        articlesSectionReference.current.scrollIntoView({
          behavior: "auto",
          block: "start",
        });
        // Apply offset manually after scrollIntoView
        window.scrollBy({
          top: -100, // Offset for navbar/spacing
          behavior: "auto",
        });
      } else {
        // Smooth scroll for better UX
        const offset = 100; // Offset for navbar/spacing
        const elementPosition = articlesSectionReference.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const handleCategorySelect = (categorySlug?: string) => {
    // Scroll immediately before state update to prevent any unwanted scrolling
    scrollToArticles(true);
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) {
      return;
    }

    // Scroll immediately before state update to prevent any unwanted scrolling
    scrollToArticles(true);
    setCurrentPage(page);
  };

  // Scroll to articles section when data finishes loading after filter/page change
  // This ensures we're at the correct position after content updates
  useEffect(() => {
    // Skip scroll on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Scroll when data has finished loading to ensure accurate positioning
    if (!isPostsLoading) {
      const timeoutId = setTimeout(() => {
        scrollToArticles();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isPostsLoading, scrollToArticles]);

  return (
    <section id="articles" ref={articlesSectionReference} className="relative overflow-hidden bg-white py-24">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <BookOpen className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Latest Articles
            </span>
          </div>

          <h2
            className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Latest{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Articles
            </span>
          </h2>
          <p
            className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Stay updated with our latest expert insights on wellness, nutrition, mindfulness, and
            healthy living. Get practical tips and inspiring stories to help you thrive on your
            wellness journey.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
          {categoriesLoading && !categoriesFetching ? (
            <>
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </>
          ) : (
            <>
              {shouldShowAllFilter && (
                <button
                  key="All"
                  onClick={() => handleCategorySelect()}
                  className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-500 ease-out ${
                    isAllCategoryActive
                      ? "bg-brand-gradient text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:scale-105 hover:bg-gradient-to-r hover:from-[#35bec5] hover:to-[#0c96c4] hover:text-white hover:shadow-lg"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                  aria-pressed={isAllCategoryActive}
                >
                  All
                </button>
              )}
              {categories.map((category: BlogCategory) => (
                <button
                  key={category.id || category.slug}
                  onClick={() => handleCategorySelect(category.slug)}
                  className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-500 ease-out ${
                    selectedCategory === category.slug
                      ? "bg-brand-gradient text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:scale-105 hover:bg-gradient-to-r hover:from-[#35bec5] hover:to-[#0c96c4] hover:text-white hover:shadow-lg"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                  aria-pressed={selectedCategory === category.slug}
                >
                  {category.name}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Blog Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {isPostsLoading ? (
            Array.from({ length: 4 }).map((_, index) => <BlogCardSkeleton key={index} index={index} />)
          ) : hasPosts ? (
            posts.map((post: BlogPost, index: number) => (
              <BlogCard key={post.id || index} blog={post} index={index} />
            ))
          ) : (
            <div
              className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-12 text-center shadow-sm"
              data-aos="zoom-in"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#35bec5] to-[#0c96c4] text-white">
                <FileQuestion className="h-8 w-8" />
              </div>
              <h3
                className="mb-4 text-2xl font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Fresh insights are on the way
              </h3>
              <p
                className="mx-auto mb-6 max-w-2xl text-base text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                We&apos;re curating expert articles right now. Check back soon or let us know what
                topics you&apos;d love to read about.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-[#35bec5] hover:text-[#35bec5] hover:shadow-lg"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Request a topic
              </Link>
            </div>
          )}
        </div>
      </div>

      {hasPosts && !isPostsLoading && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </section>
  );
}
