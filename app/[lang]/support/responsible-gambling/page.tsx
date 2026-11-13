import ResponsibleGamblingPage from "@/site/support/responsible_gambling";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("responsible", "/support/responsible-gambling");

export default function Page() {
  return <ResponsibleGamblingPage />;
}
