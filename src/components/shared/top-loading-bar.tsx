"use client";

import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { useTransition } from "@/context/transition-context";
import { cn } from "@/utils/shared/cn";

export default function TopLoadingBar() {
  const { isTransitioning } = useTransition();
  const isFetching = useIsFetching();

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const active = isTransitioning || isFetching > 0;

    let intervalId: ReturnType<typeof setInterval> | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (active) {
      setVisible(true);
      setProgress((previous) => (previous === 0 ? 10 : previous));

      intervalId = setInterval(() => {
        setProgress((previous) => {
          if (previous >= 95) return previous;
          return previous + 3;
        });
      }, 150);
    } else {
      // Finish bar and then hide it
      setProgress(100);
      timeoutId = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isTransitioning, isFetching]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-60",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
      aria-hidden="true"
    >
      {/* Top bar */}
      <div className="bg-background/80 h-1 w-full">
        <div
          className="from-primary/95 via-primary to-primary/80 h-full bg-linear-to-r shadow-[0_0_10px_rgba(0,0,0,0.45)] transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Spinner slightly below the bar, right aligned */}
      <div className="flex w-full justify-end px-4 py-1">
        <div className="bg-background/80 rounded-full p-1 shadow-sm">
          <Spinner className="text-primary bg-transparent" />
        </div>
      </div>
    </div>
  );
}
