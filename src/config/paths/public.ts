/**
 * Public route paths
 *
 * Routes accessible without authentication.
 */
export const PUBLIC_PATHS = {
  /** Public homepage */
  HOME: "/",

  /** Public about page */
  ABOUT: "/about",

  /** Public programs page */
  PROGRAMS: "/programs",

  /** Public blog page */
  BLOG: "/blog",

  /** Public blog detail page */
  BLOG_DETAIL: (slug: string) => `/blog/${slug}`,

  /** Public contact page */
  CONTACT: "/contact",
} as const;
