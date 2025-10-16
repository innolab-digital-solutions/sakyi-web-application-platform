"use client";

import { AnimatePresence, motion, Transition } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

import { useTransition } from "@/context/transition-context";
import { getTransitionVariants } from "@/lib/transitions/variants";
import { TransitionType } from "@/types/shared/transitions";

interface PageTransitionProperties {
  children: ReactNode;
  transitionType?: TransitionType;
  className?: string;
}

/**
 * Page transition wrapper component
 *
 * Wraps page content with Framer Motion animations for smooth transitions
 * between routes. Tracks transition state in context.
 */
export default function PageTransition({
  children,
  transitionType,
  className = "",
}: PageTransitionProperties) {
  const pathname = usePathname();
  const { getTransitionConfig, setIsTransitioning } = useTransition();

  const config = getTransitionConfig(transitionType);
  const variants = getTransitionVariants(config);

  // Track transition state for loading indicators
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, config.duration * 1000);

    return () => clearTimeout(timer);
  }, [pathname, config.duration, setIsTransitioning]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={variants.transition as Transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
