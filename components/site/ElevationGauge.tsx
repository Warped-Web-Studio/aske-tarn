import styles from "./ElevationGauge.module.css";

/**
 * A level readout in the left margin: as the page scrolls, you descend
 * through the section. Pure CSS (scroll-driven animation + counters);
 * hidden where unsupported, and decorative for assistive technology.
 */
export function ElevationGauge() {
  return (
    <div className={styles.gauge} aria-hidden="true">
      <span className={styles.caption}>Depth</span>
      <span className={styles.value} />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
    </div>
  );
}
