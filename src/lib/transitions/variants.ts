import { TransitionConfig, TransitionVariants } from "@/types/shared/transitions";

/**
 * Generates framer-motion animation variants based on the provided transition configuration.
 *
 * This function creates standardized animation variants for different transition types including
 * fade, slide, scale, and directional slide animations. Each variant includes initial, animate,
 * and exit states for smooth page transitions.
 *
 * @param config - The transition configuration object containing type, duration, and easing
 * @param config.type - The type of transition (fade, slide, scale, slideUp, slideDown, slideLeft, slideRight)
 * @param config.duration - The duration of the animation in seconds
 * @param config.ease - The easing function for the animation
 * @returns The complete transition variants object with initial, animate, exit, and transition properties
 */
export const getTransitionVariants = (config: TransitionConfig): TransitionVariants => {
  const { type, duration, ease } = config;

  const baseTransition = {
    duration,
    ease,
    type: "tween" as const,
  };

  const variantMap: Record<string, Omit<TransitionVariants, "transition">> = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 },
    },
    slideDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 30 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -30 },
    },
    slideRight: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 30 },
    },
  };

  const variants = variantMap[type] || variantMap.fade;
  return {
    ...variants,
    transition: baseTransition,
  };
};
