import { site } from "@/content/site";
import { OG_SIZE, sheetImage } from "@/lib/og";

export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sheetImage({
    photo: "salt-archive/exterior.jpg",
    title: ["Aske", "Tarn"],
    sheet: "SHEET A-001",
    meta: ["±0.00", "Copenhagen · Porto", "Concept"],
  });
}
