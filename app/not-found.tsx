import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beyond the site boundary",
  robots: { index: false },
};

/*
  Styled with utilities rather than a CSS module: the root not-found boundary's
  stylesheet would otherwise be preloaded on every page.
*/
export default function NotFound() {
  return (
    <div className="sheet min-h-[calc(100svh-var(--sheetbar-h))] content-start gap-y-6 pt-6 lg:pt-[calc(16px+var(--titleblock-h)+40px)]">
      <p className="label col-span-full text-slate">Sheet 404 — Site plan</p>

      <svg
        className="col-span-full h-auto w-full max-w-180 lg:col-start-6 lg:-col-end-1 lg:row-start-2 lg:row-span-3 lg:self-center"
        viewBox="0 0 600 360"
        role="img"
        aria-label="A site plan: a dashed boundary, the building inside it, and a marker outside the boundary."
      >
        <defs>
          <pattern id="nf-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--color-stone)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="40" y="40" width="360" height="260" fill="none" stroke="var(--color-carbon)" strokeDasharray="10 6 2 6" />
        <rect x="120" y="120" width="180" height="70" fill="var(--color-carbon)" />
        <rect x="120" y="190" width="180" height="40" fill="url(#nf-hatch)" stroke="var(--color-carbon)" />
        <line x1="40" y1="330" x2="400" y2="330" stroke="var(--color-carbon)" />
        <line x1="40" y1="322" x2="40" y2="338" stroke="var(--color-carbon)" />
        <line x1="400" y1="322" x2="400" y2="338" stroke="var(--color-carbon)" />
        <circle cx="510" cy="96" r="16" fill="none" stroke="var(--color-vermilion)" strokeWidth="1.5" />
        <circle cx="510" cy="96" r="3.5" fill="var(--color-vermilion)" />
        <line x1="510" y1="60" x2="510" y2="132" stroke="var(--color-vermilion)" strokeDasharray="2 4" />
        <line x1="474" y1="96" x2="546" y2="96" stroke="var(--color-vermilion)" strokeDasharray="2 4" />
      </svg>

      <h1 className="display relative z-1 col-span-full text-[clamp(3.5rem,1rem+10vw,11rem)] lg:col-span-6 lg:row-start-2">
        Beyond the <br />
        site boundary
      </h1>
      <p className="col-span-full max-w-[34ch] text-(length:--fs-body) lg:col-span-4">
        This sheet isn&rsquo;t part of the drawing set. The page may have moved, or it was never drawn.
      </p>
      <Link href="/" className="col-span-full justify-self-start text-(length:--fs-body) lg:col-span-4">
        <span className="link-line">Return to sheet 01</span>
        <span aria-hidden="true"> →</span>
      </Link>
    </div>
  );
}
