import styles from "./drawing.module.css";

const LETTERS = "ABCDEFGHIJKLM";

/**
 * The structural grid, drawn: one axis per column line, lettered A–M.
 * It matches the live layout grid exactly (4 / 8 / 12 columns), so every
 * composition on the site visibly sits on it.
 */
export function Axes({ className, bubbles = true }: { className?: string; bubbles?: boolean }) {
  return (
    <div className={`${styles.axes} ${className ?? ""}`} aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <div key={index} className={styles.axis} data-axis style={{ "--i": index } as React.CSSProperties}>
          {bubbles ? <span className={styles.axisBubble}>{LETTERS[index]}</span> : null}
        </div>
      ))}
      <div className={styles.axisEnd} data-axis>
        {bubbles ? (
          <span className={styles.axisBubble}>
            <span className={styles.endLabel4}>{LETTERS[4]}</span>
            <span className={styles.endLabel8}>{LETTERS[8]}</span>
            <span className={styles.endLabel12}>{LETTERS[12]}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
