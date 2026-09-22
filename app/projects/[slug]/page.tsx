import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { flagship, getNextProject, getProject, projects } from "@/content/projects";
import { cutRange, levels } from "@/content/models/salt-archive";
import { jsonLd, pageMetadata, projectLd } from "@/lib/seo";
import { SHEET_ENTER } from "@/lib/transitions";
import { TitleSheet } from "@/components/project/TitleSheet";
import { ProjectBody } from "@/components/project/ProjectBody";
import { Materials } from "@/components/project/Materials";
import { NextSheet } from "@/components/project/NextSheet";
import { SectionStudy } from "@/components/three/SectionStudy";
import { SectionDrawing } from "@/components/drawing/SectionDrawing";
import { PlanDrawing } from "@/components/drawing/PlanDrawing";
import { SetLines } from "@/components/type/SetLines";
import styles from "@/components/project/project.module.css";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.name,
    description: `${project.summary} ${project.programme}, ${project.region}, ${project.country}.`,
    path: `/projects/${project.slug}`,
    image: `/projects/${project.slug}/opengraph-image`,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const isFlagship = project.slug === flagship.slug;

  const drawings = isFlagship ? (
    <>
      <section className={styles.study} aria-labelledby="study-title">
        <SectionStudy
          levels={levels}
          range={cutRange}
          poster={<SectionDrawing />}
          heading={
            <>
              <p className={`label text-slate ${styles.studyLabel}`}>Model — section plane study</p>
              <SetLines as="h2" id="study-title" lines={["Cut through", "the archive"]} className={`display ${styles.studyTitle}`} />
            </>
          }
          caption={<p>Scroll, or use the slider, to lower the cutting plane from the roof to the lower vault.</p>}
        />
      </section>
      <section className={`sheet ${styles.drawings}`} aria-labelledby="drawings-title">
        <div className={styles.drawingsHead}>
          <p className="label text-slate">Drawings</p>
          <h2 id="drawings-title" className={styles.narrativeTitle}>
            Plan and section
          </h2>
        </div>
        <div className={styles.drawingBlock}>
          <p className={`label ${styles.drawingLabel}`}>
            <span>Ground-floor plan, cut at +1.00</span>
            <span className="text-slate">Hover or focus a room</span>
          </p>
          <PlanDrawing />
        </div>
        <div className={styles.drawingBlock}>
          <p className={`label ${styles.drawingLabel}`}>
            <span>Long section A–A</span>
            <span className="text-slate">1:500</span>
          </p>
          <SectionDrawing />
        </div>
      </section>
    </>
  ) : null;

  return (
    <ViewTransition {...SHEET_ENTER}>
      <article>
        <TitleSheet project={project} />
        <ProjectBody project={project} insertAfter="S-01" insert={drawings} />
        <Materials materials={project.materials} />
        <NextSheet project={getNextProject(project.slug)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(projectLd(project))} />
      </article>
    </ViewTransition>
  );
}
