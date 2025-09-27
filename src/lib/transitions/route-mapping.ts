import { TransitionType } from "@/types/shared/transitions";

/**
 * Determines the appropriate transition type based on the current route pathname.
 *
 * This function maps specific route patterns to their corresponding transition animations
 * to provide contextually appropriate page transitions. Different routes use different
 * transition types to enhance the user experience and provide visual continuity.
 *
 * Route mappings:
 * - `/create` - slideUp transition for creation flows
 * - `/edit/*` - slide transition for editing flows
 * - `/detail/*` or `/view/*` - scale transition for detail views
 * - `/admin/overview` - fade transition for overview pages
 * - `/admin/roles` - slideLeft transition for role management
 * - `/admin/programs` - slideRight transition for program management
 *
 * @param pathname - The current route pathname to match against
 * @returns The transition type to use for the given route, defaults to "fade" if no pattern matches
 */
export const getRouteTransition = (pathname: string): TransitionType => {
  // Route-based transition mapping
  const routeMap: Array<{ pattern: RegExp; transition: TransitionType }> = [
    { pattern: /\/create$/, transition: "slideUp" },
    { pattern: /\/edit\//, transition: "slide" },
    { pattern: /\/(detail|view)\//, transition: "scale" },
    { pattern: /\/admin\/overview/, transition: "fade" },
    { pattern: /\/admin\/roles/, transition: "slideLeft" },
    { pattern: /\/admin\/programs/, transition: "slideRight" },
  ];

  for (const { pattern, transition } of routeMap) {
    if (pattern.test(pathname)) {
      return transition;
    }
  }

  return "fade";
};
