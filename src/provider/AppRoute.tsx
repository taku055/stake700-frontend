import { Route, Router } from "preact-iso";
import LivePage from "@/pages/live";
import SportPage from "@/pages/sport";
import CasinoLayout from "@/pages/casino";
import PromotionsPage from "@/pages/promotions";
import ArticlePage from "@/pages/promotions/ArticlePage";
import TrebuchetPage from "@/pages/trebuchet";
import HomePage from "@/pages/home";
import NotFound404 from "@/pages/not-found";
import GamePageComponent from "@/pages/game";
import AgentPage from "@/pages/agent";
import SuperAgentPage from "@/pages/superagent";
import TombalaPage from "@/pages/tombala";
import AffiliatesLayout from "@/pages/affiliates";
import AboutUs from "@/pages/about-us";
import ContactUs from "@/pages/contact-us";
import OtherRules from "@/pages/other-rules";
import PrivacyPolicy from "@/pages/privacy-policy";
import FAQ from "@/pages/faq";

export default function AppRoute() {
  return (
    <Router>
      <Route path="/" component={HomePage} />

      <Route path="/live" component={LivePage} />
      <Route path="/live-casino" component={LivePage} />
      <Route path="/sport" component={SportPage} />

      <Route path="/casino/:pageType" component={CasinoLayout} />
      <Route path="/casino/:pageType/*" component={CasinoLayout} />
      <Route path="/game/:gameId" component={GamePageComponent} />

      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/promotions/:articleId" component={ArticlePage} />
      <Route path="/trebuchet" component={TrebuchetPage} />
      <Route path="/tombala" component={TombalaPage} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/about-us/*" component={AboutUs} />
      <Route path="/contact-us" component={ContactUs} />
      <Route path="/other-rules" component={OtherRules} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/faq" component={FAQ} />

      <Route path="/agent" component={AgentPage} />
      <Route path="/agent/*" component={AgentPage} />

      <Route path="/superagent" component={SuperAgentPage} />
      <Route path="/superagent/*" component={SuperAgentPage} />

      <Route path="/affiliates" component={AffiliatesLayout} />
      <Route path="/affiliates/*" component={AffiliatesLayout} />

      <Route path="*" component={NotFound404} />
    </Router>
  );
}

