import { TargetAndTransition, Transition, VariantLabels } from "framer-motion";

export type TransitionType =
  | "fade"
  | "slide"
  | "scale"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight";

export interface TransitionConfig {
  type: TransitionType;
  duration: number;
  delay?: number;
  ease: string;
}

export interface TransitionVariants {
  initial: TargetAndTransition | VariantLabels;
  animate: TargetAndTransition | VariantLabels;
  exit: TargetAndTransition | VariantLabels;
  transition: {
    duration: number;
    ease: string;
    type?: "tween" | "spring" | "keyframes" | "inertia" | "just";
  };
}
