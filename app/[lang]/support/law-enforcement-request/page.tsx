import LawEnforcementPage from "@/site/support/law_enforcement_request";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("law_enforcement", "/support/law-enforcement-request");

export default function Page() {
  return <LawEnforcementPage />;
}
