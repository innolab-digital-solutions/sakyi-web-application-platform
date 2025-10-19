import { TransitionConfig, TransitionType } from "@/types/shared/transitions";

/**
 * Pre-configured transition settings for page animations.
 *
 * Contains standardized transition configurations with consistent
 * duration and easing for smooth page transitions.
 */
export const TRANSITION_PRESETS: Record<TransitionType, TransitionConfig> = {
  fade: {
    type: "fade",
    duration: 0.3,
    ease: "easeInOut",
  },
  slide: {
    type: "slide",
    duration: 0.3,
    ease: "easeInOut",
  },
  scale: {
    type: "scale",
    duration: 0.3,
    ease: "easeInOut",
  },
  slideUp: {
    type: "slideUp",
    duration: 0.3,
    ease: "easeInOut",
  },
  slideDown: {
    type: "slideDown",
    duration: 0.3,
    ease: "easeInOut",
  },
  slideLeft: {
    type: "slideLeft",
    duration: 0.3,
    ease: "easeInOut",
  },
  slideRight: {
    type: "slideRight",
    duration: 0.3,
    ease: "easeInOut",
  },
};
