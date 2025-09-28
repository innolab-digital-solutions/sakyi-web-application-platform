"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useTransition } from "@/context/transition-context";
import { getRouteTransition } from "@/lib/transitions/route-mapping";
import { TransitionType } from "@/types/shared/transitions";

/**
 * Custom hook for managing page transitions.
 *
 * This hook provides functionality to navigate between pages with customizable
 * transition animations. It integrates with the transition context to manage
 * global transition state and automatically determines appropriate transitions
 * based on route patterns.
 *
 * @returns An object containing navigation and transition management functions
 * @returns navigateWithTransition - Function to navigate to a route with a specific transition
 * @returns setTransitionType - Function to manually set the current transition type
 * @returns currentTransition - The currently active transition type
 * @returns isTransitioning - Boolean indicating if a transition is currently in progress
 */
export const usePageTransition = () => {
  const router = useRouter();
  const { setTransition, currentTransition, isTransitioning } = useTransition();

  /**
   * Navigates to a specified route with an optional transition animation.
   *
   * If no transition type is provided, it automatically determines the appropriate
   * transition based on the target route using route mapping patterns.
   *
   * @param href - The destination route to navigate to
   * @param transitionType - Optional transition type to use for the navigation
   */
  const navigateWithTransition = useCallback(
    (href: string, transitionType?: TransitionType) => {
      const transition = transitionType || getRouteTransition(href);
      setTransition(transition);
      router.push(href);
    },
    [router, setTransition],
  );

  /**
   * Sets the current transition type without navigating.
   *
   * Useful for pre-configuring the transition type before a navigation
   * or for updating the transition style based on user preferences.
   *
   * @param type - The transition type to set as current
   */
  const setTransitionType = useCallback(
    (type: TransitionType) => {
      setTransition(type);
    },
    [setTransition],
  );

  return {
    navigateWithTransition,
    setTransitionType,
    currentTransition,
    isTransitioning,
  };
};
