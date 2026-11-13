import { sectionLobby } from "@/lib/catalog-routes";

const route = sectionLobby("live-casino");

export const generateMetadata = route.generateMetadata;
export default route.Page;
