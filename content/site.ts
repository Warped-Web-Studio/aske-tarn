export const site = {
  name: "Aske Tarn",
  legalName: "Aske Tarn Architects",
  monogram: "A/T",
  tagline: "Architecture for weight, light and a long time.",
  description:
    "Aske Tarn is an architecture practice working in concrete, earth, stone and light — archives, houses, hotels and rooms for art, drawn in section first.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  email: "studio@asketarn.example",
  concept: {
    by: "Warped Web Studio",
    note: "Aske Tarn is a fictional practice. This site is a concept project by Warped Web Studio; its buildings, people and texts are invented and its photographs are temporary.",
  },
} as const;

/** The site's sheets, in drawing-set order. The index is also the sheet number. */
export const sheets = [
  { number: "01", label: "Work", href: "/" },
  { number: "02", label: "Index", href: "/projects" },
  { number: "03", label: "Studio", href: "/studio" },
  { number: "04", label: "Contact", href: "/contact" },
] as const;

export type Sheet = (typeof sheets)[number];

export function sheetFor(pathname: string): Sheet {
  if (pathname.startsWith("/projects")) return sheets[1];
  return sheets.find((sheet) => sheet.href === pathname) ?? sheets[0];
}
