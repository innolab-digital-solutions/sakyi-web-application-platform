import { TransitionConfig, TransitionType } from "@/types/shared/transitions";

/**
 * Pre-configured transition settings for different animation types.
 *
 * This object contains standardized transition configurations that can be used
 * throughout the application for consistent page transitions. Each preset includes
 * the transition type, duration, and easing function.
 *
 * Available transition types:
 * - fade: Simple opacity fade in/out
 * - slide: Horizontal slide with opacity
 * - scale: Scale animation with opacity
 * - slideUp: Vertical slide upward
 * - slideDown: Vertical slide downward
 * - slideLeft: Horizontal slide from right to left
 * - slideRight: Horizontal slide from left to right
 */
export const TRANSITION_PRESETS: Record<TransitionType, TransitionConfig> = {
  fade: {
    type: "fade",
    duration: 0.3,
    ease: "easeInOut",
  },
  slide: {
    type: "slide",
    duration: 0.4,
    ease: "easeInOut",
  },
  scale: {
    type: "scale",
    duration: 0.3,
    ease: "easeInOut",
  },
  slideUp: {
    type: "slideUp",
    duration: 0.4,
    ease: "easeOut",
  },
  slideDown: {
    type: "slideDown",
    duration: 0.4,
    ease: "easeOut",
  },
  slideLeft: {
    type: "slideLeft",
    duration: 0.4,
    ease: "easeInOut",
  },
  slideRight: {
    type: "slideRight",
    duration: 0.4,
    ease: "easeInOut",
  },
};
