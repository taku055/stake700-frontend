import type { Metadata } from "next";
import NotFound404 from "@/site/not-found";

// Next.js adds <meta name="robots" content="noindex"> to not-found responses automatically
export const metadata: Metadata = {
  title: "404",
};

export default function NotFound() {
  return <NotFound404 />;
}
