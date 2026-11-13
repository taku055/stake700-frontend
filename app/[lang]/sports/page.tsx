import SportPage from "@/site/sport";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("sports", "/sports");

export default function Page() {
  return <SportPage />;
}
