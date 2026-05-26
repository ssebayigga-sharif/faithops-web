import { useEffect, useRef } from "react";
export function useFadeIn<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    );

    // Observe all children with data-animate
    const children = el.querySelectorAll<HTMLElement>("[data-animate]");
    children.forEach((child) => observer.observe(child));

    // Also observe the container itself if it has data-animate
    if (el.hasAttribute("data-animate")) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
