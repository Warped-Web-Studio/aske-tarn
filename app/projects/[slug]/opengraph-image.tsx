import { getProject, projects } from "@/content/projects";
import { formatYears } from "@/lib/format";
import { heroFiles } from "@/content/images/heroes";
import { OG_SIZE, sheetImage } from "@/lib/og";

export const alt = "Project sheet — Aske Tarn";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug) ?? projects[0];
  const words = project.name.split(" ");
  const title = words.length > 1 && project.name.length > 10 ? [words.slice(0, -1).join(" "), words.at(-1) ?? ""] : [project.name];

  return sheetImage({
    photo: heroFiles[project.slug],
    title,
    sheet: `SHEET ${project.number}`,
    meta: [project.region, formatYears(project), project.type],
  });
}
