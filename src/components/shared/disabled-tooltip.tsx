"use client";

import * as React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DisabledTooltipProperties {
  reason?: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

export default function DisabledTooltip({
  reason,
  children,
  side = "top",
  align = "center",
  className,
}: DisabledTooltipProperties) {
  // Always render Tooltip wrapper for consistent layout; only show content when reason provided
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* span wrapper lets tooltip work with disabled elements */}
        <span className={className}>{children}</span>
      </TooltipTrigger>
      {reason ? (
        <TooltipContent
          side={side}
          align={align}
          className="bg-popover text-popover-foreground border-border max-w-xs rounded-md border px-3 py-2 shadow-lg"
        >
          {reason}
        </TooltipContent>
      ) : undefined}
    </Tooltip>
  );
}
