import EpayclubCardCheckout from "@/site/payment/epayclub/EpayclubCardCheckout";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("payment", "/payment/epayclub/card/checkout", { noindex: true });

export default function Page() {
  return <EpayclubCardCheckout />;
}
