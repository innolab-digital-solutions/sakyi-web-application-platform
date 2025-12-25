/**
 * Public API endpoints
 *
 * Endpoints accessible without authentication.
 */
export const PUBLIC_ENDPOINTS = {
  BLOG_CATEGORIES: "/public/blog-categories",

  BLOG_POSTS: "/public/blog-posts",
  BLOG_POST: (slug: string) => `/public/blog-posts/${slug}`,
  RELATED_BLOG_POSTS: (slug: string) => `/public/blog-posts/${slug}/related`,

  HOME_BLOG_POSTS: "/public/home/blog-posts",
  HOME_TESTIMONIALS: "/public/home/testimonials",
  HOME_PROGRAMS: "/public/home/programs",

  PROGRAMS: "/public/programs",
  PROGRAM: (slug: string) => `/public/programs/${slug}`,
  PROGRAM_FAQS: "/public/programs/faqs",
} as const;
