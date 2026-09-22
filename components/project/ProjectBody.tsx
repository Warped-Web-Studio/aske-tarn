import type { ReactNode } from "react";
import type { NarrativeSection, Photo, Project } from "@/lib/types";
import { CutImage } from "@/components/media/CutImage";
import { SetLines } from "@/components/type/SetLines";
import styles from "./project.module.css";

type Composition = "full" | "pair" | "offset";

/** The order in which photographs are laid out between narrative sections. */
const RHYTHM: readonly Composition[] = ["full", "pair", "offset"];
const TAKES: Record<Composition, number> = { full: 1, pair: 2, offset: 1 };

type Block = { section?: NarrativeSection; composition?: Composition; photos: Photo[] };

/** Interleave narrative and photographs: each section is followed by one composition. */
function arrange(project: Project): { blocks: Block[]; leftover: Photo[] } {
  const photos = [...project.gallery];
  const blocks: Block[] = project.narrative.map((section, index) => {
    const composition = RHYTHM[index % RHYTHM.length];
    const take = Math.min(TAKES[composition], photos.length);
    const taken = photos.splice(0, take);
    return { section, composition: taken.length === 0 ? undefined : taken.length === 1 && composition === "pair" ? "offset" : composition, photos: taken };
  });
  return { blocks, leftover: photos };
}

export function ProjectBody({
  project,
  /** Inserted after the section with this ref (the flagship's drawings). */
  insertAfter,
  insert,
}: {
  project: Project;
  insertAfter?: string;
  insert?: ReactNode;
}) {
  const { blocks, leftover } = arrange(project);

  return (
    <>
      {blocks.map((block, index) => (
        <div key={block.section?.ref ?? index}>
          {block.section ? <Narrative section={block.section} /> : null}
          {block.composition ? <Plate composition={block.composition} photos={block.photos} /> : null}
          {insert && block.section?.ref === insertAfter ? insert : null}
        </div>
      ))}
      {leftover.map((photo, index) => (
        <Plate key={index} composition={index % 2 === 0 ? "full" : "offset"} photos={[photo]} />
      ))}
    </>
  );
}

function Narrative({ section }: { section: NarrativeSection }) {
  return (
    <section className={`sheet ${styles.narrative}`} aria-labelledby={`n-${section.ref}`}>
      <div className={styles.narrativeHead} data-reveal>
        <p className="label text-slate" data-annotate>
          {section.ref}
        </p>
        <SetLines as="h2" id={`n-${section.ref}`} lines={[section.heading]} className={styles.narrativeTitle} reveal={false} />
      </div>
      <div className={`prose ${styles.narrativeBody}`}>
        {section.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function Plate({ composition, photos }: { composition: Composition; photos: Photo[] }) {
  const [first, second] = photos;
  if (!first) return null;

  if (composition === "full") {
    return (
      <figure className={`sheet ${styles.plate} ${styles.full}`}>
        <CutImage photo={first} sizes="100vw" quality={60} parallax className={styles.fullFrame} />
        <figcaption className={`label ${styles.caption}`}>{first.alt}</figcaption>
      </figure>
    );
  }

  if (composition === "pair" && second) {
    return (
      <div className={`sheet ${styles.plate} ${styles.pair}`}>
        <figure className={styles.pairFirst}>
          <CutImage photo={first} sizes="(min-width: 1024px) 56vw, 100vw" className={styles.pairFirstFrame} />
          <figcaption className={`label ${styles.caption}`}>{first.alt}</figcaption>
        </figure>
        <figure className={styles.pairSecond}>
          <CutImage photo={second} sizes="(min-width: 1024px) 32vw, 66vw" className={styles.pairSecondFrame} index={2} />
          <figcaption className={`label ${styles.caption}`}>{second.alt}</figcaption>
        </figure>
      </div>
    );
  }

  return (
    <figure className={`sheet ${styles.plate} ${styles.offset}`}>
      <CutImage photo={first} sizes="(min-width: 1024px) 64vw, 100vw" className={styles.offsetFrame} />
      <figcaption className={`label ${styles.caption} ${styles.offsetCaption}`}>{first.alt}</figcaption>
    </figure>
  );
}
