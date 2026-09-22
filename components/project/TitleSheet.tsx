import type { Project } from "@/lib/types";
import { formatArea, formatCoordinates, formatYears } from "@/lib/format";
import { CutImage } from "@/components/media/CutImage";
import { Dimension } from "@/components/drawing/Dimension";
import { SetLines } from "@/components/type/SetLines";
import styles from "./project.module.css";

/** Split a name into display lines: two words per line at most. */
function titleLines(name: string): string[] {
  const words = name.split(" ");
  if (words.length <= 2) return words.length === 2 && name.length > 11 ? words : [name];
  const middle = Math.ceil(words.length / 2);
  return [words.slice(0, middle).join(" "), words.slice(middle).join(" ")];
}

export function TitleSheet({ project }: { project: Project }) {
  const facts = [
    { label: "Location", value: `${project.region}, ${project.country}` },
    { label: "Grid ref.", value: formatCoordinates(project.coordinates) },
    { label: "Programme", value: project.programme },
    { label: "Year", value: formatYears(project) },
    { label: "Status", value: project.status },
    { label: "Area", value: formatArea(project.area) },
    { label: "Levels", value: project.levels },
    { label: "Structure", value: project.structure },
  ];

  return (
    <header className={styles.titleSheet}>
      <div className={`sheet ${styles.titleTop}`} data-reveal>
        <p className={`label ${styles.titleNumber}`} data-annotate>
          {project.number} — {project.type}
        </p>
        <SetLines as="h1" lines={titleLines(project.name)} className={`display ${styles.title}`} reveal={false} />
      </div>

      <CutImage
        photo={project.hero}
        sizes="100vw"
        preload
        morph={`project-${project.slug}`}
        className={styles.heroFrame}
      />

      <div className="sheet">
        <div className={styles.heroDimension}>
          <Dimension metres={project.dimension.metres} label={project.dimension.label} />
          <p className={`label ${styles.caption}`}>{project.dimension.label}</p>
        </div>
      </div>

      <div className={`sheet ${styles.intro}`}>
        <dl className={styles.titleBlock} data-reveal>
          {facts.map((fact, index) => (
            <div key={fact.label} data-annotate style={{ "--a": index } as React.CSSProperties}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className={`lede ${styles.introText}`}>{project.intro}</p>
      </div>
    </header>
  );
}
