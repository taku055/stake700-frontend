import ResetPasswordPage from "@/site/reset-password";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("reset_password", "/reset-password", { noindex: true });

export default function Page() {
  return <ResetPasswordPage />;
}
