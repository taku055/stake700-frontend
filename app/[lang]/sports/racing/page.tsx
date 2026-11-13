import RacingPage from "@/site/sports/RacingPage";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("racing", "/sports/racing");

export default function Page() {
  return <RacingPage racing="horseRacing" />;
}
