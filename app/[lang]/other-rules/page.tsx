import OtherRulesPage from "@/site/other-rules";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("rules", "/other-rules");

export default function Page() {
  return <OtherRulesPage />;
}
