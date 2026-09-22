import Link from "next/link";
import { sheets, site } from "@/content/site";
import { studios } from "@/content/studio";
import { formatCoordinates } from "@/lib/format";
import { Datum } from "@/components/drawing/Datum";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-labelledby="footer-title">
      <Datum level="−12.00" label="Foundation" className={styles.datum} />
      <div className={`sheet ${styles.grid}`} data-reveal>
        <div className={styles.lead}>
          <h2 id="footer-title" className="label text-slate">
            Enquiries
          </h2>
          <a href={`mailto:${site.email}`} className={styles.email}>
            <span data-line>
              <span>Write to</span>
            </span>
            <span data-line>
              <span>the studio</span>
            </span>
          </a>
          <p className={`${styles.address} label`} data-annotate>
            {site.email}
          </p>
        </div>

        <ul className={styles.studios} aria-label="Studios">
          {studios.map((studio, index) => (
            <li key={studio.city} data-annotate style={{ "--a": index } as React.CSSProperties}>
              <p className={styles.city}>{studio.city}</p>
              <p className="label text-slate">{formatCoordinates(studio.coordinates)}</p>
            </li>
          ))}
        </ul>

        <nav className={styles.sheets} aria-label="Footer">
          <ul>
            {sheets.map((sheet) => (
              <li key={sheet.href}>
                <Link href={sheet.href} transitionTypes={["sheet"]} className={styles.sheetLink}>
                  <span className="label text-slate" aria-hidden="true">
                    {sheet.number}
                  </span>
                  <span className="link-line">{sheet.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.stamp}>
        <p className={styles.concept}>
          <span className={styles.conceptMark} aria-hidden="true" />
          Aske Tarn is a fictional practice — a concept project by {site.concept.by}.
        </p>
        <dl className={styles.block}>
          <div>
            <dt>Drawing set</dt>
            <dd>{site.legalName}</dd>
          </div>
          <div>
            <dt>Scale</dt>
            <dd>1:1</dd>
          </div>
          <div>
            <dt>Rev.</dt>
            <dd>C</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>© {year}</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
