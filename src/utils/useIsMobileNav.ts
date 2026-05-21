import { useEffect, useState } from "react";

/** Matches app-shell breakpoint in globals.css (65.98rem ≈ 1056px). */
const MOBILE_NAV_QUERY = "(max-width: 65.98rem)";

export function useIsMobileNav(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_NAV_QUERY).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(MOBILE_NAV_QUERY);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
