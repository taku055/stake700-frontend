import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

/**
 * Default 1200x630 social-preview image (/og.png) for pages without their own
 * artwork. Self-contained (no remote assets, so it can be built offline); text
 * stays Latin because the built-in font has no Arabic glyphs.
 */
export const revalidate = 86400;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 70% 0%, #1d4f8a 0%, #0f212e 55%, #0b1822 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -2, display: "flex" }}>{SITE_NAME}</div>
        <div style={{ marginTop: 40, fontSize: 40, fontWeight: 700, letterSpacing: 2, color: "#b1bad3", display: "flex" }}>
          Casino · Live Casino · Sports
        </div>
        <div
          style={{
            marginTop: 28,
            width: 120,
            height: 6,
            borderRadius: 3,
            background: "#1475e1",
            display: "flex",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
