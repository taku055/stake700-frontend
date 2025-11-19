import CasinoPageComponent from "./CasinoPageComponent";
import { FunctionalComponent } from "preact";
import { tPageType } from "./data";

interface ICasinoPageProps {
  pageType: tPageType;
}

const CasinoPage: FunctionalComponent<ICasinoPageProps> = ({ pageType }) => {
  return <CasinoPageComponent />;
};

export default CasinoPage;
