import styles from "./drawing.module.css";

/** The section callout: a split circle — cut reference above, sheet below — with a vermilion view arrow. */
export function SectionMarker({ cut, sheet, className }: { cut: string; sheet: string; className?: string }) {
  return (
    <span className={`${styles.marker} ${className ?? ""}`} aria-hidden="true">
      <span className={styles.markerTop}>{cut}</span>
      <span className={styles.markerBottom}>{sheet}</span>
    </span>
  );
}
