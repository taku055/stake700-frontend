import FavoritesPage from "@/site/favorites";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("favorites", "/favorites", { noindex: true });

export default function Page() {
  return <FavoritesPage />;
}
