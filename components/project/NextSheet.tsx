import Link from "next/link";
import type { Project } from "@/lib/types";
import { formatYears } from "@/lib/format";
import { CutImage } from "@/components/media/CutImage";
import styles from "./project.module.css";

/** The next project, as the next sheet in the set. Its photograph carries across. */
export function NextSheet({ project }: { project: Project }) {
  return (
    <nav className={`sheet ${styles.next}`} aria-label="Next project">
      <Link href={`/projects/${project.slug}`} className={`${styles.nextLink} frame-hover`} transitionTypes={["morph"]}>
        <span className={styles.nextMeta} data-reveal>
          <span className="label" data-annotate>
            Next sheet — {project.number}
          </span>
          <span className="label text-slate" data-annotate>
            {project.region} · {formatYears(project)}
          </span>
        </span>
        <span className={`display ${styles.nextTitle}`}>{project.name}</span>
        <CutImage
          photo={project.hero}
          sizes="100vw"
          quality={60}
          morph={`project-${project.slug}`}
          className={styles.nextFrame}
        />
      </Link>
    </nav>
  );
}
