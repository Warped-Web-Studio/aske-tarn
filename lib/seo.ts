import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Project } from "./types";
import { yearLabel } from "./format";

/** Serialise JSON-LD safely for inline <script> use. */
export function jsonLd(data: Record<string, unknown>): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export function absoluteUrl(path: string): string {
  return `${site.url}${path}`;
}

/** Shared page metadata: canonical, Open Graph and Twitter in one place. */
export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
}: {
  title?: string;
  description: string;
  path: string;
  /** Social card. Project sheets pass their own; the rest share the site's. */
  image?: string;
}): Metadata {
  const images = [{ url: image, width: 1200, height: 630, alt: title ?? site.name }];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} — ${site.name}` : site.name,
      description,
      url: path,
      siteName: site.name,
      locale: "en_GB",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} — ${site.name}` : site.name,
      description,
      images,
    },
  };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: absoluteUrl("/icon.svg"),
  description: `${site.description} ${site.concept.note}`,
  creator: { "@type": "Organization", name: site.concept.by },
};

export function projectLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(`/projects/${project.slug}#work`),
    name: project.name,
    headline: project.name,
    abstract: project.summary,
    description: project.intro,
    genre: `${project.type} architecture`,
    dateCreated: String(yearLabel(project)),
    creativeWorkStatus: project.status,
    image: absoluteUrl(project.hero.src.src),
    locationCreated: {
      "@type": "Place",
      name: `${project.region}, ${project.country}`,
    },
    author: { "@id": `${site.url}/#organization` },
    isPartOf: { "@type": "CreativeWorkSeries", name: `${site.name} — concept portfolio by ${site.concept.by}` },
  };
}
