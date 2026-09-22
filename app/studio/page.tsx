import type { Metadata } from "next";
import { ViewTransition } from "react";
import { founders, method, principles, studioFacts, studioImages, studios } from "@/content/studio";
import { site } from "@/content/site";
import sources from "@/content/images/sources.json";
import { formatCoordinates } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { SHEET_ENTER } from "@/lib/transitions";
import { CutImage } from "@/components/media/CutImage";
import { SetLines } from "@/components/type/SetLines";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Studio",
  description:
    "How Aske Tarn works: light, proportion, use, landscape, material and permanence — and the people and studios behind the practice.",
  path: "/studio",
});

/** Unique photographers, for the colophon. */
const credits = [...new Map(sources.images.map((image) => [image.by, image])).values()].sort((a, b) =>
  a.by.localeCompare(b.by),
);

export default function StudioPage() {
  return (
    <ViewTransition {...SHEET_ENTER}>
      <div className={styles.studio}>
        <header className={`sheet ${styles.head}`}>
          <p className={`label text-slate ${styles.headLabel}`}>Sheet 03 — Studio</p>
          <SetLines as="h1" lines={["Studio"]} className={`display ${styles.title}`} />
          <p className={`lede ${styles.lede}`}>
            Aske Tarn was founded in Copenhagen in 2011 by Ingrid Aske and Samuel Tarn. We are a small practice of
            architects, an engineer and a model maker, working in two studios. We take on few projects and stay with
            them for a long time.
          </p>
        </header>

        <div className={`sheet ${styles.opening}`}>
          <CutImage photo={studioImages.court} sizes="(min-width: 1024px) 66vw, 100vw" preload className={styles.openingFrame} />
          <dl className={styles.facts}>
            {studioFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <section className={`sheet ${styles.principles}`} aria-labelledby="principles-title">
          <div className={styles.principlesHead}>
            <p className="label text-slate">Section through a practice</p>
            <SetLines as="h2" id="principles-title" lines={["What we", "hold to"]} className={`display ${styles.sectionTitle}`} />
            <p className={styles.principlesNote}>
              Six positions, arranged as levels. Above the ground line, what a building gives; below it, what holds it
              up.
            </p>
          </div>
          <ol className={styles.levels}>
            {principles.map((principle, index) => {
              const below = principle.level.startsWith("−");
              const ground = principle.level === "±0.00";
              return (
                <li
                  key={principle.title}
                  className={`${styles.level} ${below ? styles.below : ""} ${ground ? styles.ground : ""}`}
                  data-reveal
                  style={{ "--i": index % 2 } as React.CSSProperties}
                >
                  <span className={styles.levelRule} data-draw aria-hidden="true" />
                  <p className={styles.levelValue} data-annotate>
                    <span className="sr-only">Level </span>
                    {principle.level}
                  </p>
                  <h3 className={styles.levelTitle} data-annotate>
                    {principle.title}
                  </h3>
                  <p className={styles.levelText} data-annotate style={{ "--a": 1 } as React.CSSProperties}>
                    {principle.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className={`sheet ${styles.method}`} aria-labelledby="method-title">
          <div className={styles.methodHead}>
            <p className="label text-slate">Method</p>
            <h2 id="method-title" className={styles.serifTitle}>
              Four drawings, in order
            </h2>
          </div>
          <ol className={styles.steps}>
            {method.map((step, index) => (
              <li key={step.step} className={styles.step} data-reveal style={{ "--i": index } as React.CSSProperties}>
                <span className={styles.stepAxis} data-draw aria-hidden="true" />
                <p className="label text-slate" data-annotate>
                  {step.step}
                </p>
                <h3 className={styles.stepName} data-annotate>
                  {step.name}
                </h3>
                <p className={styles.stepText} data-annotate>
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`sheet ${styles.people}`} aria-labelledby="people-title">
          <div className={styles.peopleHead}>
            <p className="label text-slate">Partners</p>
            <h2 id="people-title" className={styles.serifTitle}>
              The practice
            </h2>
          </div>
          <CutImage photo={studioImages.slot} sizes="(min-width: 1024px) 25vw, 50vw" className={styles.peopleFrame} />
          <ul className={styles.founders}>
            {founders.map((founder) => (
              <li key={founder.name} className={styles.founder} data-reveal>
                <p className={`display ${styles.founderName}`}>
                  <span data-line>
                    <span>{founder.name}</span>
                  </span>
                </p>
                <p className="label text-slate" data-annotate>
                  {founder.role}
                </p>
                <p className={styles.founderNote} data-annotate>
                  {founder.note}
                </p>
              </li>
            ))}
          </ul>
          <ul className={styles.studios} aria-label="Studios">
            {studios.map((studio) => (
              <li key={studio.city}>
                <p className={styles.studioCity}>{studio.city}</p>
                <p className="label text-slate">{formatCoordinates(studio.coordinates)}</p>
                <p className={styles.studioRole}>{studio.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="colophon" className={`sheet ${styles.colophon}`} aria-labelledby="colophon-title">
          <div className={styles.colophonHead}>
            <p className="label text-slate">Colophon</p>
            <h2 id="colophon-title" className={styles.serifTitle}>
              About this site
            </h2>
          </div>
          <div className={styles.colophonBody}>
            <p className={styles.conceptNote}>
              <span className={styles.conceptMark} aria-hidden="true" />
              {site.concept.note}
            </p>
            <dl className={styles.colophonList}>
              <div>
                <dt>Design and build</dt>
                <dd>{site.concept.by}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>Archivo (display), Newsreader (text), IBM Plex Mono (annotation)</dd>
              </div>
              <div>
                <dt>Model</dt>
                <dd>The section study is a real-time model drawn with three.js, generated from the same data as the plan and section.</dd>
              </div>
              <div>
                <dt>Temporary photography</dt>
                <dd>
                  Via Unsplash, graded as one set. Photographs by{" "}
                  {credits.map((credit, index) => (
                    <span key={credit.by}>
                      <a
                        className="link-line"
                        href={`https://unsplash.com/photos/${credit.page}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {credit.by}
                      </a>
                      {index < credits.length - 2 ? ", " : index === credits.length - 2 ? " and " : "."}
                    </span>
                  ))}{" "}
                  The buildings shown are not the projects described.
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </ViewTransition>
  );
}
