import * as React from "react";

/** Breakpoint for mobile devices (below 768px) */
const MOBILE_BREAKPOINT = 768;

/**
 * Detect if the current viewport is mobile size
 *
 * Uses matchMedia API to detect viewport width changes and determine
 * if the screen size is below the mobile breakpoint (768px).
 *
 * @returns True if viewport width is below 768px, false otherwise
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
};
