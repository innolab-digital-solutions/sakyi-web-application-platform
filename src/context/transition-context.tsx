"use client";

import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";

import { TRANSITION_PRESETS } from "@/lib/transitions/presets";
import { TransitionConfig, TransitionType } from "@/types/shared/transitions";

interface TransitionContextValue {
  currentTransition: TransitionType;
  setTransition: (type: TransitionType) => void;
  getTransitionConfig: (type?: TransitionType) => TransitionConfig;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
}

const TransitionContext = createContext<TransitionContextValue | undefined>(undefined);

interface TransitionProviderProperties {
  children: ReactNode;
  defaultTransition?: TransitionType;
}

/**
 * Provides transition context to child components, managing global transition state.
 *
 * @param children - React child components to be wrapped by the provider
 * @param defaultTransition - The default transition type to use (defaults to "fade")
 * @returns JSX element providing transition context
 */
export function TransitionProvider({
  children,
  defaultTransition = "fade",
}: TransitionProviderProperties) {
  const [currentTransition, setCurrentTransition] = useState<TransitionType>(defaultTransition);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * Sets the current transition type.
   *
   * @param type - The transition type to set as current
   */
  const setTransition = useCallback((type: TransitionType) => {
    setCurrentTransition(type);
  }, []);

  /**
   * Retrieves the configuration for a specific transition type.
   *
   * @param type - Optional transition type. If not provided, uses the current transition
   * @returns The transition configuration object
   */
  const getTransitionConfig = useCallback(
    (type?: TransitionType): TransitionConfig => {
      const transitionType = type || currentTransition;

      return TRANSITION_PRESETS[transitionType];
    },
    [currentTransition],
  );

  const value: TransitionContextValue = {
    currentTransition,
    setTransition,
    getTransitionConfig,
    isTransitioning,
    setIsTransitioning,
  };

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}

/**
 * Hook to access the transition context.
 *
 * @returns The transition context value containing current transition state and methods
 * @throws Error if used outside of a TransitionProvider
 */
export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
};
