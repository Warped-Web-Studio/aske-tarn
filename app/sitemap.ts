import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { sheets, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...sheets.map((sheet) => ({
      url: `${site.url}${sheet.href === "/" ? "" : sheet.href}`,
      changeFrequency: "monthly" as const,
      priority: sheet.href === "/" ? 1 : 0.7,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
