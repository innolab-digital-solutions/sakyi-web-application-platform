"use client";

import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";

import { TRANSITION_PRESETS } from "@/lib/transitions/presets";
import { TransitionConfig, TransitionType } from "@/types/shared/transitions";

interface TransitionContextValue {
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
 * Provides transition context to child components, managing transition state.
 *
 * @param children - React child components to be wrapped by the provider
 * @param defaultTransition - The default transition type (used for configuration)
 * @returns JSX element providing transition context
 */
export const TransitionProvider: React.FC<TransitionProviderProperties> = ({
  children,
  defaultTransition = "fade",
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * Retrieves the configuration for a specific transition type.
   *
   * @param type - Optional transition type. If not provided, uses the default
   * @returns The transition configuration object
   */
  const getTransitionConfig = useCallback(
    (type?: TransitionType): TransitionConfig => {
      const transitionType = type || defaultTransition;
      return TRANSITION_PRESETS[transitionType];
    },
    [defaultTransition],
  );

  const value: TransitionContextValue = {
    getTransitionConfig,
    isTransitioning,
    setIsTransitioning,
  };

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
};

/**
 * Hook to access the transition context.
 *
 * @returns The transition context value containing transition state and methods
 * @throws Error if used outside of a TransitionProvider
 */
export const useTransition = (): TransitionContextValue => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
};
