import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { projects, projectTypes } from "@/content/projects";
import { formatArea, formatYears } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { SHEET_ENTER } from "@/lib/transitions";
import { SetLines } from "@/components/type/SetLines";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Index",
  description:
    "Every project by Aske Tarn as a drawing schedule — an archive, houses, a refuge, a hotel, a gallery and a pavilion, with place, year, status and area.",
  path: "/projects",
});

const FILTERS = ["All", ...projectTypes] as const;

/**
 * The filter is a native radio group; :has() hides rows of other types and
 * shows the preview of the row under the pointer or focus. No client JS.
 */
const filterCss = [
  ...projectTypes.map(
    (type) =>
      `.${styles.index}:has(input[value="${type}"]:checked) [data-type]:not([data-type="${type}"]){display:none}`,
  ),
  ...projects.map(
    (project) =>
      `.${styles.index}:has([data-row="${project.slug}"]:is(:hover,:focus-within)) [data-preview="${project.slug}"]{opacity:1;clip-path:inset(0);transition-delay:0s;z-index:1}`,
  ),
  `.${styles.index}:not(:has([data-row]:is(:hover,:focus-within))) [data-preview="${projects[0].slug}"]{opacity:1;clip-path:inset(0);transition-delay:0s}`,
].join("");

export default function IndexPage() {
  const counts = new Map<string, number>(
    FILTERS.map((type) => [type, type === "All" ? projects.length : projects.filter((p) => p.type === type).length]),
  );

  return (
    <ViewTransition {...SHEET_ENTER}>
      <div className={styles.index}>
        <style>{filterCss}</style>

        <header className={`sheet ${styles.head}`}>
          <p className={`label text-slate ${styles.headLabel}`}>Sheet 02 — Drawing schedule</p>
          <SetLines as="h1" lines={["Index"]} className={`display ${styles.title}`} />
          <p className={styles.headNote}>
            {projects.length} projects, {Math.min(...projects.map((p) => p.years.start))}–
            {Math.max(...projects.map((p) => p.years.end ?? p.years.start))}. Listed as the practice lists them: by job
            number, place and what was built.
          </p>
        </header>

        <div className="sheet">
          <fieldset className={styles.filters}>
            <legend className="label text-slate">Filter by type</legend>
            <div className={styles.filterOptions}>
              {FILTERS.map((type) => (
                <label key={type} className={styles.filter}>
                  <input type="radio" name="type" value={type} defaultChecked={type === "All"} />
                  <span>{type}</span>
                  <span className={styles.filterCount} aria-label={`${counts.get(type)} projects`}>
                    {counts.get(type)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className={`sheet ${styles.body}`}>
          {/* Explicit roles keep table semantics when rows are restyled as cards on small screens. */}
          <table className={styles.table} role="table">
            <caption className="sr-only">Projects by Aske Tarn</caption>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Project</th>
                <th scope="col">Place</th>
                <th scope="col">Type</th>
                <th scope="col">Year</th>
                <th scope="col">Status</th>
                <th scope="col" className={styles.num}>
                  Area
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.slug} role="row" data-row={project.slug} data-type={project.type}>
                  <td role="cell" className={styles.number}>{project.number}</td>
                  <th scope="row" role="rowheader" className={styles.name}>
                    <Link href={`/projects/${project.slug}`} className={styles.rowLink} transitionTypes={["sheet"]}>
                      <span className={styles.thumb} aria-hidden="true">
                        <Image src={project.hero.src} alt="" fill sizes="96px" placeholder="blur" style={{ objectPosition: project.hero.focus }} />
                      </span>
                      <span className={styles.nameText}>{project.name}</span>
                    </Link>
                  </th>
                  <td role="cell" className={styles.place}>
                    {project.region}, {project.country}
                  </td>
                  <td role="cell" className={styles.type}>{project.type}</td>
                  <td role="cell" className={styles.year}>{formatYears(project)}</td>
                  <td role="cell" className={styles.status}>{project.status}</td>
                  <td role="cell" className={`${styles.num} ${styles.area}`}>{formatArea(project.area)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.preview} aria-hidden="true">
            <div className={styles.previewFrame}>
              {projects.map((project) => (
                <div key={project.slug} className={styles.previewImage} data-preview={project.slug} data-type={project.type}>
                  <Image
                    src={project.hero.src}
                    alt=""
                    fill
                    sizes="30vw"
                    loading="eager"
                    fetchPriority="low"
                    placeholder="blur"
                    style={{ objectPosition: project.hero.focus }}
                  />
                  <span className={styles.previewCaption}>
                    <span>{project.number}</span>
                    <span>{project.dimension.metres.toFixed(2)} m — {project.dimension.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
