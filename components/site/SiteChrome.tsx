"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { sheetFor, sheets, site } from "@/content/site";
import styles from "./SiteChrome.module.css";

const SHEET_TRANSITION = ["sheet"];

/**
 * Navigation, drawn as a title block.
 * ≥1024px: a fixed title block, top right, one cell per sheet.
 * <1024px: a sheet bar at thumb height that opens the sheet index (native popover).
 */
export function SiteChrome() {
  const pathname = usePathname();
  const current = sheetFor(pathname);
  const indexRef = useRef<HTMLDivElement>(null);

  // A route change closes the sheet index.
  useEffect(() => {
    const index = indexRef.current;
    if (index?.matches(":popover-open")) index.hidePopover();
  }, [pathname]);

  // Move focus into the index when it opens, for keyboard and screen-reader users.
  useEffect(() => {
    const index = indexRef.current;
    if (!index) return;
    const onToggle = (event: Event) => {
      if ((event as ToggleEvent).newState === "open") {
        index.querySelector<HTMLAnchorElement>("a[aria-current='page'], a")?.focus();
      }
    };
    index.addEventListener("toggle", onToggle);
    return () => index.removeEventListener("toggle", onToggle);
  }, []);

  return (
    <>
      <header className={styles.titleblock} style={{ viewTransitionName: "chrome" }}>
        <Link href="/" className={styles.mark} transitionTypes={SHEET_TRANSITION} aria-label={`${site.name}, home`}>
          <span className={styles.monogram} aria-hidden="true">
            {site.monogram}
          </span>
          <span className={styles.name} aria-hidden="true">
            {site.name}
            <span className={styles.discipline}>Architects</span>
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className={styles.cells}>
            {sheets.map((sheet) => {
              const active = sheet === current;
              return (
                <li key={sheet.href}>
                  <Link
                    href={sheet.href}
                    className={styles.cell}
                    aria-current={active ? "page" : undefined}
                    transitionTypes={SHEET_TRANSITION}
                  >
                    <span className={styles.cellNumber} aria-hidden="true">
                      {sheet.number}
                    </span>
                    <span className={styles.cellLabel}>{sheet.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <div className={styles.bar} style={{ viewTransitionName: "chrome-bar" }}>
        <Link href="/" className={styles.barMark} transitionTypes={SHEET_TRANSITION} aria-label={`${site.name}, home`}>
          <span aria-hidden="true">{site.monogram}</span>
        </Link>
        <p className={styles.barSheet} aria-hidden="true">
          <span className={styles.barNumber}>{current.number}</span>
          {current.label}
        </p>
        <button type="button" className={styles.barButton} popoverTarget="sheet-index">
          Sheets
          <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true">
            <path d="M0.5 3.5h15v10h-15z M4.5 0.5h15v10" fill="none" stroke="currentColor" />
          </svg>
        </button>
      </div>

      <div id="sheet-index" popover="auto" ref={indexRef} className={styles.index} aria-label="Sheet index">
        <div className={styles.indexHead}>
          <p className="label">Sheet index — {site.legalName}</p>
          <button type="button" className={styles.close} popoverTarget="sheet-index" popoverTargetAction="hide">
            Close
          </button>
        </div>
        <nav aria-label="Sheets">
          <ol className={styles.indexList}>
            {sheets.map((sheet) => (
              <li key={sheet.href}>
                <Link
                  href={sheet.href}
                  className={styles.indexLink}
                  aria-current={sheet === current ? "page" : undefined}
                  transitionTypes={SHEET_TRANSITION}
                >
                  <span className={styles.indexNumber} aria-hidden="true">
                    {sheet.number}
                  </span>
                  <span className={styles.indexLabel}>{sheet.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.indexFoot}>
          <a className="link-line" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <p className={styles.concept}>A concept by {site.concept.by}</p>
        </div>
      </div>
    </>
  );
}
