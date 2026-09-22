import { formatMetres } from "@/lib/format";
import styles from "./drawing.module.css";

type DimensionProps = {
  metres: number;
  /** Accessible description of what is being measured. */
  label: string;
  className?: string;
};

/**
 * A dimension string: extension lines, 45° ticks, and the value in mono.
 * The value is exposed to assistive tech with its meaning; the drawing is not.
 */
export function Dimension({ metres, label, className }: DimensionProps) {
  return (
    <div
      className={`${styles.dimension} ${className ?? ""}`}
      data-reveal
    >
      <span className={styles.dimensionLine} data-draw aria-hidden="true" />
      <span className={`${styles.dimensionTick} ${styles.tickStart}`} aria-hidden="true" />
      <span className={`${styles.dimensionTick} ${styles.tickEnd}`} aria-hidden="true" />
      <span className={styles.dimensionValue} data-annotate>
        <span className="sr-only">{label}: </span>
        {formatMetres(metres)}
        <span className="sr-only"> metres</span>
      </span>
    </div>
  );
}
