import { TransitionConfig, TransitionVariants } from "@/types/shared/transitions";

/**
 * Generates Framer Motion animation variants for page transitions.
 *
 * Creates standardized animation variants with initial, animate, and exit states
 * for smooth page transitions using opacity and transform animations.
 *
 * @param config - Transition configuration with type, duration, and easing
 * @returns Complete transition variants for Framer Motion
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

  return {
    ...(variantMap[type] || variantMap.fade),
    transition: baseTransition,
  };
};
