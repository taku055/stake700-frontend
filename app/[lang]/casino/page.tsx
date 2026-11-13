import { sectionLobby } from "@/lib/catalog-routes";

const route = sectionLobby("casino");

export const generateMetadata = route.generateMetadata;
export default route.Page;
