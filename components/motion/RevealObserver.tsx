"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The single trigger for every scroll reveal on the site. Elements opt in
 * with `data-reveal`; when they cross into view they receive
 * `data-revealed`, and CSS (globals.css → MOTION) does the rest.
 * Re-scans on every route change. Renders nothing.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    const targets = document.querySelectorAll("[data-reveal]:not([data-revealed])");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
