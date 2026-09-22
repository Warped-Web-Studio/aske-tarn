import Link from "next/link";
import { principles } from "@/content/studio";
import { SetLines } from "@/components/type/SetLines";
import styles from "./Approach.module.css";

const EXCERPT = new Set(["Light", "Landscape", "Permanence"]);

/** Three of the practice's positions, set as levels in a section. */
export function Approach() {
  const excerpt = principles.filter((principle) => EXCERPT.has(principle.title));

  return (
    <section className={`sheet ${styles.approach}`} aria-labelledby="approach-title">
      <div className={styles.head}>
        <p className="label text-slate">Sheet A-200 — Approach</p>
        <SetLines as="h2" id="approach-title" lines={["Drawn in", "section first"]} className={`display ${styles.title}`} />
      </div>

      <ol className={styles.levels}>
        {excerpt.map((principle, index) => (
          <li
            key={principle.title}
            className={`${styles.level} ${principle.level === "±0.00" ? styles.ground : ""}`}
            data-reveal
            style={{ "--i": index } as React.CSSProperties}
          >
            <span className={styles.rule} data-draw aria-hidden="true" />
            <p className={styles.value} data-annotate>
              <span className="sr-only">Level </span>
              {principle.level}
            </p>
            <h3 className={styles.name} data-annotate>
              {principle.title}
            </h3>
            <p className={styles.text} data-annotate style={{ "--a": 1 } as React.CSSProperties}>
              {principle.text}
            </p>
          </li>
        ))}
      </ol>

      <Link href="/studio" className={styles.more} transitionTypes={["sheet"]}>
        <span className="link-line">The studio and its approach</span>
        <span aria-hidden="true"> →</span>
      </Link>
    </section>
  );
}
