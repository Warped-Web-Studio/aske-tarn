import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const OG_SIZE = { width: 1200, height: 630 } as const;

const root = process.cwd();
const fonts = Promise.all([
  readFile(join(root, "assets/fonts/archivo-condensed-700.ttf")),
  readFile(join(root, "assets/fonts/plex-mono-400.ttf")),
]);

const PLASTER = "#ece8e0";
const CARBON = "#161614";
const SLATE = "#5e5a53";
const VERMILION = "#c23b22";

async function photoData(file: string, width: number, height: number): Promise<string> {
  const buffer = await sharp(join(root, "content/images", file))
    .resize(width, height, { fit: "cover", position: "attention" })
    .jpeg({ quality: 78 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

type SheetImage = {
  /** Path under content/images. */
  photo: string;
  title: readonly string[];
  sheet: string;
  meta: readonly string[];
};

/** Open Graph card, drawn as a drawing sheet: photograph, title on a ground line, title block. */
export async function sheetImage({ photo, title, sheet, meta }: SheetImage): Promise<ImageResponse> {
  const [[display, mono], image] = await Promise.all([fonts, photoData(photo, 470, 630)]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: PLASTER, color: CARBON }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "44px 48px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Plex", fontSize: 18, color: SLATE }}>
            <span>ASKE TARN — ARCHITECTS</span>
            <span>{sheet}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", fontFamily: "Archivo", fontSize: title.length > 1 ? 132 : 164, lineHeight: 0.86, textTransform: "uppercase" }}>
            {title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div style={{ display: "flex", height: 2, background: CARBON, marginTop: 22 }} />
          <div
            style={{
              display: "flex",
              height: 18,
              backgroundImage: `repeating-linear-gradient(-45deg, #a39e93 0 1px, transparent 1px 7px)`,
            }}
          />
          <div style={{ display: "flex", gap: 28, marginTop: 20, fontFamily: "Plex", fontSize: 18, textTransform: "uppercase" }}>
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
            <span style={{ display: "flex", marginLeft: "auto", width: 12, height: 12, background: VERMILION, alignSelf: "center" }} />
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by next/og */}
        <img src={image} width={470} height={630} alt="" style={{ objectFit: "cover" }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo", data: display, weight: 700, style: "normal" },
        { name: "Plex", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
