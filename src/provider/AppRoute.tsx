import { Route, Router } from "preact-iso";
import LivePage from "@/pages/live";
import SportPage from "@/pages/sport";
import CasinoLayout from "@/pages/casino";
import PromotionsPage from "@/pages/promotions";
import TrebuchetPage from "@/pages/trebuchet";
import HomePage from "@/pages/home";
import NotFound404 from "@/pages/not-found";
import GamePageComponent from "@/pages/game";
import AgentPage from "@/pages/agent";
import SuperAgentPage from "@/pages/superagent";
import TombalaPage from "@/pages/tombala";
import AffiliatesLayout from "@/pages/affiliates";

export default function AppRoute() {
  return (
    <Router>
      <Route path="/" component={HomePage} />

      <Route path="/live" component={LivePage} />
      <Route path="/sport" component={SportPage} />

      <Route path="/casino/:pageType" component={CasinoLayout} />
      <Route path="/casino/:pageType/*" component={CasinoLayout} />
      <Route path="/game/:gameId" component={GamePageComponent} />

      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/trebuchet" component={TrebuchetPage} />
      <Route path="/tombala" component={TombalaPage} />

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
