import styles from "./drawing.module.css";

type DatumProps = {
  level?: string;
  label?: string;
  className?: string;
};

/** A level line with the ▽ datum symbol. Draws in from the left margin. */
export function Datum({ level = "±0.00", label, className }: DatumProps) {
  return (
    <div className={`${styles.datum} ${className ?? ""}`} data-reveal aria-hidden="true">
      <span className={styles.datumLine} data-draw />
      <span className={styles.datumMarker} data-annotate>
        <svg className={styles.datumSymbol} viewBox="0 0 13 12">
          <path d="M0.5 0.5h12L6.5 11.5z" fill="none" stroke="currentColor" />
          <path d="M3.2 0.5h6.6L6.5 6.4z" fill="currentColor" />
        </svg>
        <span className={styles.datumLevel}>{level}</span>
        {label ? <span className={styles.datumLabel}>{label}</span> : null}
      </span>
    </div>
  );
}
