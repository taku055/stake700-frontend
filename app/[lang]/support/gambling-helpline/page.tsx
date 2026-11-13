import GamblingHelplinePage from "@/site/support/gambling_helpline";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("helpline", "/support/gambling-helpline");

export default function Page() {
  return <GamblingHelplinePage />;
}
