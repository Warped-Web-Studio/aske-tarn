import type { Metadata } from "next";
import { ViewTransition } from "react";
import { studios } from "@/content/studio";
import { site } from "@/content/site";
import { formatCoordinates } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { SHEET_ENTER } from "@/lib/transitions";
import { SetLines } from "@/components/type/SetLines";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Write to Aske Tarn about a site, a brief or a question. Studios in Copenhagen and Porto.",
  path: "/contact",
});

const [local, domain] = site.email.split("@");

const enquiries = [
  { label: "New work", address: `${local}@${domain}`, note: "A site, a brief, or an early question. We reply to every letter." },
  { label: "Press and publication", address: `press@${domain}`, note: "Drawings, models and photographs are available on request." },
  { label: "Joining the studio", address: `work@${domain}`, note: "We read portfolios twice a year, in March and September." },
];

export default function ContactPage() {
  return (
    <ViewTransition {...SHEET_ENTER}>
      <div className={styles.contact}>
        <header className={`sheet ${styles.head}`}>
          <p className={`label text-slate ${styles.headLabel}`}>Sheet 04 — Contact</p>
          <SetLines as="h1" lines={["Write", "to us"]} className={`display ${styles.title}`} />
          <p className={`lede ${styles.lede}`}>
            We take on a small number of projects each year, and most begin with a letter. Tell us about the site first.
          </p>
        </header>

        <section className={`sheet ${styles.enquiries}`} aria-label="Enquiries">
          <ul className={styles.list}>
            {enquiries.map((enquiry, index) => (
              <li key={enquiry.label} className={styles.item} data-reveal style={{ "--i": index } as React.CSSProperties}>
                <span className={styles.rule} data-draw aria-hidden="true" />
                <p className="label text-slate" data-annotate>
                  {String(index + 1).padStart(2, "0")} — {enquiry.label}
                </p>
                <a href={`mailto:${enquiry.address}`} className={styles.address}>
                  {enquiry.address}
                </a>
                <p className={styles.note} data-annotate>
                  {enquiry.note}
                </p>
              </li>
            ))}
          </ul>
          <p className={styles.concept}>
            <span className={styles.conceptMark} aria-hidden="true" />
            Aske Tarn is fictional; these addresses use a reserved example domain and do not receive mail.
          </p>
        </section>

        <section className={`sheet ${styles.studios}`} aria-labelledby="studios-title">
          <h2 id="studios-title" className={`label text-slate ${styles.studiosTitle}`}>
            Studios
          </h2>
          {studios.map((studio, index) => (
            <article key={studio.city} className={styles.studio} data-reveal style={{ "--i": index } as React.CSSProperties}>
              <svg className={styles.crosshair} viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" data-draw />
                <path d="M60 0V120M0 60H120" stroke="currentColor" strokeDasharray="2 4" />
                <circle cx="60" cy="60" r="4" fill="var(--color-vermilion)" />
              </svg>
              <h3 className={`display ${styles.city}`}>{studio.city}</h3>
              <p className="label" data-annotate>
                {formatCoordinates(studio.coordinates)} — {studio.country}
              </p>
              <p className={styles.studioNote} data-annotate>
                {studio.role}
              </p>
            </article>
          ))}
        </section>
      </div>
    </ViewTransition>
  );
}
