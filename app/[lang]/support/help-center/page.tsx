import HelpCenterPage from "@/site/support/help_center";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("help_center", "/support/help-center");

export default function Page() {
  return <HelpCenterPage />;
}
