import Link from "next/link";
import { flagship } from "@/content/projects";
import { site } from "@/content/site";
import { formatCoordinates } from "@/lib/format";
import { Axes } from "@/components/drawing/Axes";
import { SectionMarker } from "@/components/drawing/SectionMarker";
import { CutImage } from "@/components/media/CutImage";
import styles from "./Hero.module.css";

/**
 * Sheet A-001. The composition is a section: a building stands on the
 * ground line (±0.00), the practice's name is set on the same line and
 * cut by the photograph, and the earth lies hatched beneath.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Axes className={styles.axes} />

      <Link
        href={`/projects/${flagship.slug}`}
        className={`${styles.frameLink} frame-hover`}
        transitionTypes={["morph"]}
        aria-label={`${flagship.name}, ${flagship.region} — view project`}
      >
        <CutImage
          photo={flagship.hero}
          sizes="(min-width: 1024px) 48vw, (min-width: 768px) 60vw, 76vw"
          preload
          morph={`project-${flagship.slug}`}
          className={styles.frame}
        >
          <span className={styles.knockout} aria-hidden="true">
            {site.name}
          </span>
        </CutImage>
        <span className={styles.frameTag} aria-hidden="true">
          {flagship.number} · {flagship.name}
        </span>
      </Link>

      <h1 id="hero-title" className={styles.wordmark}>
        <span className={styles.wordmarkLine}>
          <span>{site.name}</span>
        </span>
        <span className="sr-only"> — Architects</span>
      </h1>

      <div className={styles.datum} aria-hidden="true">
        <span className={styles.datumLine} />
        <span className={styles.datumLabel}>±0.00 Ground line</span>
      </div>
      <div className={`${styles.poche} poche`} aria-hidden="true" />

      <div className={`sheet ${styles.below}`}>
        <p className={styles.intro}>
          An architecture practice in Copenhagen and Porto. We make archives, houses, hotels and rooms for art — in
          concrete, earth, stone and light.
        </p>

        <dl className={styles.meta}>
          <div>
            <dt>Sheet</dt>
            <dd>A-001</dd>
          </div>
          <div>
            <dt>Shown</dt>
            <dd>{flagship.name}</dd>
          </div>
          <div>
            <dt>Grid ref.</dt>
            <dd>{formatCoordinates(flagship.coordinates)}</dd>
          </div>
        </dl>

        <p className={styles.thesis}>{site.tagline}</p>

        <a href="#section-study" className={styles.descend}>
          <SectionMarker cut="A" sheet="02" />
          <span>
            <span className={styles.descendTitle}>Section A–A</span>
            <span className={styles.descendHint}>Descend through the archive</span>
          </span>
        </a>
      </div>
    </section>
  );
}
