import VerifyEmailPage from "@/site/verify-email";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("verify_email", "/verify-email", { noindex: true });

export default function Page() {
  return <VerifyEmailPage />;
}
