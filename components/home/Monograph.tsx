import Link from "next/link";
import { getProject } from "@/content/projects";
import type { Photo, Project } from "@/lib/types";
import { formatArea, formatYears } from "@/lib/format";
import { CutImage } from "@/components/media/CutImage";
import { Dimension } from "@/components/drawing/Dimension";
import { SetLines } from "@/components/type/SetLines";
import styles from "./Monograph.module.css";

type Variant = "dominant" | "pair" | "quiet" | "band" | "offset" | "coda";

type Plate = {
  slug: string;
  variant: Variant;
  /** Authored line breaks for the title. */
  title: readonly string[];
  /** A second photograph, for compositions that use two. */
  second?: number;
};

/** The monograph's running order. Each project gets a different composition. */
const plates: readonly Plate[] = [
  { slug: "hollin-house", variant: "dominant", title: ["Hollin", "House"] },
  { slug: "refuge-bregaglia", variant: "pair", title: ["Refuge at", "Bregaglia"], second: 1 },
  { slug: "nave-gallery", variant: "quiet", title: ["Nave"] },
  { slug: "casa-umbra", variant: "band", title: ["Casa", "Umbra"] },
  { slug: "hotel-lanterna", variant: "offset", title: ["Hotel", "Lanterna"], second: 0 },
  { slug: "threshold-pavilion", variant: "coda", title: ["Threshold", "Pavilion"] },
];

const SIZES: Record<Variant, string> = {
  dominant: "100vw",
  pair: "(min-width: 1024px) 42vw, (min-width: 768px) 62vw, 100vw",
  quiet: "(min-width: 1024px) 24vw, (min-width: 768px) 38vw, 76vw",
  band: "(min-width: 1024px) 92vw, 100vw",
  offset: "(min-width: 1024px) 56vw, 100vw",
  coda: "(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 76vw",
};

const SECOND_SIZES = "(min-width: 1024px) 26vw, (min-width: 768px) 36vw, 60vw";

export function Monograph() {
  const entries = plates.flatMap((plate) => {
    const project = getProject(plate.slug);
    return project ? [{ plate, project }] : [];
  });

  return (
    <section className={styles.monograph} aria-labelledby="work-title">
      <header className={`sheet ${styles.head}`}>
        <p className={`label ${styles.headLabel}`} data-reveal>
          <span data-annotate>Sheet A-100 — Selected work</span>
        </p>
        <SetLines as="h2" id="work-title" lines={["Selected", "work"]} className={`display ${styles.headTitle}`} />
        <p className={styles.headNote} data-reveal>
          <span data-annotate>
            Six buildings, 2016–2025. Houses, a refuge, a hotel, a gallery and a pavilion, drawn from the same
            principles and built from very few materials.
          </span>
        </p>
      </header>

      {entries.map(({ plate, project }, index) => (
        <PlateView key={project.slug} plate={plate} project={project} index={index} />
      ))}

      <div className={`sheet ${styles.all}`}>
        <Link href="/projects" className={styles.allLink} transitionTypes={["sheet"]}>
          <span className="label text-slate">Sheet 02</span>
          <span className={styles.allTitle}>The full index</span>
          <span className="label">All projects →</span>
        </Link>
      </div>
    </section>
  );
}

function PlateView({ plate, project, index }: { plate: Plate; project: Project; index: number }) {
  const href = `/projects/${project.slug}`;
  const second: Photo | undefined = plate.second === undefined ? undefined : project.gallery[plate.second];
  const titleId = `plate-${project.slug}`;

  return (
    <article className={`sheet ${styles.plate} ${styles[plate.variant]}`} aria-labelledby={titleId}>
      <Link
        href={href}
        className={`${styles.media} frame-hover`}
        tabIndex={-1}
        aria-hidden="true"
        transitionTypes={["morph"]}
      >
        <CutImage
          photo={project.hero}
          sizes={SIZES[plate.variant]}
          morph={`project-${project.slug}`}
          parallax={plate.variant === "dominant" || plate.variant === "band"}
          quality={plate.variant === "dominant" || plate.variant === "band" ? 60 : 75}
          className={styles.frame}
        />
        <span className={styles.hoverNote}>
          <span>View project</span>
          <span>{project.number}</span>
        </span>
      </Link>

      {second ? (
        <div className={styles.second}>
          <CutImage photo={second} sizes={SECOND_SIZES} className={styles.frame} index={2} />
        </div>
      ) : null}

      <div className={styles.dimension}>
        <Dimension metres={project.dimension.metres} label={project.dimension.label} />
        <p className={`label ${styles.dimensionLabel}`}>{project.dimension.label}</p>
      </div>

      <div className={styles.text} data-reveal>
        <p className={`label ${styles.number}`}>
          <span data-annotate>
            {String(index + 1).padStart(2, "0")} / {project.number}
          </span>
        </p>
        <h3 id={titleId} className={`display ${styles.title}`}>
          <Link href={href} transitionTypes={["morph"]} className={styles.titleLink}>
            {plate.title.map((line, lineIndex) => (
              <span key={line} data-line style={{ "--line": lineIndex } as React.CSSProperties}>
                <span>
                  {line}
                  {lineIndex < plate.title.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </Link>
        </h3>
        <p className={styles.summary} data-annotate>
          {project.summary}
        </p>
        <dl className={styles.facts} data-annotate style={{ "--a": 2 } as React.CSSProperties}>
          <div>
            <dt>Place</dt>
            <dd>
              {project.region}, {project.country}
            </dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{project.type}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{formatYears(project)}</dd>
          </div>
          <div>
            <dt>Area</dt>
            <dd>{formatArea(project.area)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
