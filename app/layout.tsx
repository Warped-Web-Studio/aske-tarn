import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { site } from "@/content/site";
import { jsonLd, organizationLd } from "@/lib/seo";
import { SiteChrome } from "@/components/site/SiteChrome";
import { Footer } from "@/components/site/Footer";
import { ElevationGauge } from "@/components/site/ElevationGauge";
import { RevealObserver } from "@/components/motion/RevealObserver";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Architects`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.concept.by }],
  creator: site.concept.by,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.name,
    locale: "en_GB",
    type: "website",
    url: "/",
    title: `${site.name} — Architects`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Architects`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#ece8e0",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Runs before first paint: marks JS as available (so reveal states apply)
 * and decides whether the home intro sequence plays — once per session.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');var k='at-intro';var seen=false;try{seen=sessionStorage.getItem(k)==='1';sessionStorage.setItem(k,'1');}catch(e){}d.dataset.intro=seen?'skip':'play';if(!seen){setTimeout(function(){d.dataset.intro='skip';},3200);}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteChrome />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <ElevationGauge />
        <RevealObserver />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationLd)} />
      </body>
    </html>
  );
}
