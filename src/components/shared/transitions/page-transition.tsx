"use client";

import { AnimatePresence, motion } from "framer-motion";
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

export default function PageTransition({
  children,
  transitionType,
  className = "",
}: PageTransitionProperties) {
  const pathname = usePathname();
  const { getTransitionConfig, setIsTransitioning } = useTransition();

  const config = getTransitionConfig(transitionType);
  const variants = getTransitionVariants(config);

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
        transition={variants.transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
