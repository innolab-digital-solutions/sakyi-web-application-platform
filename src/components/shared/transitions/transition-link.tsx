"use client";

import Link from "next/link";
import React from "react";

import { usePageTransition } from "@/hooks/use-page-transition";
import { TransitionType } from "@/types/shared/transitions";

interface TransitionLinkProperties {
  href: string;
  children: React.ReactNode;
  transitionType?: TransitionType;
  className?: string;
  onClick?: () => void;
}

export default function TransitionLink({
  href,
  children,
  transitionType,
  className = "",
  onClick,
}: TransitionLinkProperties) {
  const { navigateWithTransition } = usePageTransition();

  const handleClick = (event_: React.MouseEvent) => {
    event_.preventDefault();
    onClick?.();
    navigateWithTransition(href, transitionType);
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
