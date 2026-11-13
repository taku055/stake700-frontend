import DepositResultPage from "@/site/profile/deposit";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("payment", "/profile/deposit", { noindex: true });

export default function Page() {
  return <DepositResultPage />;
}
