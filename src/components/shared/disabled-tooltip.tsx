"use client";

import * as React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/shared/cn";

type DisabledTooltipProperties = React.ComponentPropsWithoutRef<"span"> & {
  reason?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

const DisabledTooltip = React.forwardRef<HTMLSpanElement, DisabledTooltipProperties>(
  (
    { reason, children, side = "top", align = "center", className, ...restProperties },
    reference,
  ) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span ref={reference} className={cn(className)} {...restProperties}>
            {children}
          </span>
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
  },
);

DisabledTooltip.displayName = "DisabledTooltip";

export default DisabledTooltip;
