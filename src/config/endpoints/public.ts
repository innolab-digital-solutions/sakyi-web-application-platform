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
} as const;
