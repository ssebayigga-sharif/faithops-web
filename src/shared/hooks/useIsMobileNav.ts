import { useEffect, useState } from "react";

/**
 * Breakpoints matching globals.css:
 *   - MOBILE: ≤ 49rem (784px)
 *   - TABLET: 49rem – 65.98rem (784px – 1056px)
 *   - DESKTOP: > 65.98rem (1056px)
 */
const MOBILE_NAV_QUERY = "(max-width: 65.98rem)";
const TABLET_NAV_QUERY = "(min-width: 49rem) and (max-width: 65.98rem)";

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

export function useIsTabletNav(): boolean {
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(TABLET_NAV_QUERY).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(TABLET_NAV_QUERY);
    const onChange = () => setIsTablet(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isTablet;
}
