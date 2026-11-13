import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@/styles/index.css";
import "@/styles/globals.scss";

const FAVICON = "https://tekio.s3.eu-north-1.amazonaws.com/stake700/logos";

export const metadata: Metadata = {
  title: "stake700",
  description:
    "stake700 is operated by Aries Processing Ltd (Registered address, Thiseos, 7, Flat/Office 001 Strovolos 2042, Lefkosia, Cyprus).",
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#232323",
  },
  icons: {
    shortcut: `${FAVICON}/favicon.ico`,
    apple: `${FAVICON}/apple-touch-icon.png`,
    icon: [
      { url: `${FAVICON}/favicon.ico` },
      { url: `${FAVICON}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${FAVICON}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${FAVICON}/favicon-192x192.png`, sizes: "192x192", type: "image/png" },
      { url: `${FAVICON}/favicon-512x512.png`, sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1a2c38",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css"
        />
      </head>
      <body>
        {children}
        <Script
          src="https://ta-betinovio-wr5yui56.btgpub.online/assets/sdk/shadow/init.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
