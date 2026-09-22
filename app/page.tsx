import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { flagship } from "@/content/projects";
import { cutRange, levels } from "@/content/models/salt-archive";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { formatLevel } from "@/lib/format";
import { Hero } from "@/components/home/Hero";
import { Monograph } from "@/components/home/Monograph";
import { Approach } from "@/components/home/Approach";
import { SectionStudy } from "@/components/three/SectionStudy";
import { SectionDrawing } from "@/components/drawing/SectionDrawing";
import { CutImage } from "@/components/media/CutImage";
import { SetLines } from "@/components/type/SetLines";
import { SHEET_ENTER } from "@/lib/transitions";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  description: site.description,
  path: "/",
});

export default function HomePage() {
  const [ramp] = flagship.gallery;

  return (
    <ViewTransition {...SHEET_ENTER}>
      <div>
        <Hero />

        <section id="section-study" className={styles.study} aria-labelledby="study-title">
          <SectionStudy
            levels={levels}
            range={cutRange}
            poster={<SectionDrawing />}
            heading={
              <>
                <p className={`label text-slate ${styles.studyLabel}`}>
                  Sheet A-002 — {flagship.name}, {flagship.number}
                </p>
                <SetLines
                  as="h2"
                  id="study-title"
                  lines={["Section", "A–A"]}
                  className={`display ${styles.studyTitle}`}
                />
                <p className={styles.studyIntro}>
                  The archive is a building in two halves. Above the ground line, public rooms open to the fjord. Below
                  it, the collection is held in the earth&rsquo;s own slow climate. Scroll to lower the cutting plane
                  through the building, from the roof at {formatLevel(10.4)} to the lower vault.
                </p>
              </>
            }
            caption={
              <p>
                A working model, cut in plan. Material in section is shown solid; the earth around the concrete tank is
                hatched.
              </p>
            }
          />
        </section>

        <section className={`sheet ${styles.handoff}`} aria-labelledby="handoff-title">
          <Link href={`/projects/${flagship.slug}`} className={`${styles.handoffMedia} frame-hover`} tabIndex={-1} aria-hidden="true">
            <CutImage photo={ramp} sizes="(min-width: 1024px) 66vw, 100vw" quality={60} className={styles.handoffFrame} parallax />
          </Link>
          <div className={styles.handoffText} data-reveal>
            <p className="label text-slate" data-annotate>
              {formatLevel(-4.2)} — The ramp to the collection
            </p>
            <h2 id="handoff-title" className={styles.handoffTitle}>
              <span data-line>
                <span>The same room, built.</span>
              </span>
            </h2>
            <p className={styles.handoffNote} data-annotate>
              {flagship.summary}
            </p>
            <Link href={`/projects/${flagship.slug}`} className={styles.handoffLink} transitionTypes={["morph"]} data-annotate>
              <span className="link-line">Read the project — {flagship.name}</span>
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </section>

        <Monograph />
        <Approach />
      </div>
    </ViewTransition>
  );
}
