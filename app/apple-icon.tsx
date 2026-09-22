import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const display = await readFile(join(process.cwd(), "assets/fonts/archivo-condensed-700.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#161614",
          color: "#ece8e0",
          fontFamily: "Archivo",
          fontSize: 92,
        }}
      >
        <span style={{ lineHeight: 0.8 }}>A/T</span>
        <span style={{ display: "flex", width: 120, height: 3, background: "#ece8e0", marginTop: 14 }} />
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: display, weight: 700, style: "normal" }] },
  );
}
