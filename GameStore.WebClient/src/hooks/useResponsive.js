// GameStore.WebClient/src/hooks/useResponsive.js
import { useState, useEffect } from "react";

const queries = {
  xs: "(max-width: 639px)",
  sm: "(min-width: 640px) and (max-width: 1023px)",
  md: "(min-width: 1024px) and (max-width: 1279px)",
  lg: "(min-width: 1280px)",
  mobile: "(max-width: 639px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
};

function getBreakpoint() {
  if (typeof window === "undefined") return "lg";
  if (window.matchMedia(queries.xs).matches) return "xs";
  if (window.matchMedia(queries.sm).matches) return "sm";
  if (window.matchMedia(queries.md).matches) return "md";
  return "lg";
}

export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint);

  useEffect(() => {
    const mqls = Object.entries(queries).map(([key, query]) => {
      const mql = window.matchMedia(query);
      const handler = () => setBreakpoint(getBreakpoint());
      mql.addEventListener("change", handler);
      return { mql, handler };
    });
    return () =>
      mqls.forEach(({ mql, handler }) =>
        mql.removeEventListener("change", handler),
      );
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "xs",
    isTablet: breakpoint === "sm" || breakpoint === "md",
    isDesktop: breakpoint === "lg",
    isMobileOrTablet: breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md",
    xs: breakpoint === "xs",
    sm: breakpoint === "sm",
    md: breakpoint === "md",
    lg: breakpoint === "lg",
    /** Get a responsive value based on breakpoint */
    value: (xs, sm, md, lg) => {
      if (breakpoint === "xs") return xs;
      if (breakpoint === "sm") return sm;
      if (breakpoint === "md") return md;
      return lg;
    },
  };
}
