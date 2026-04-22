import { Route, Router } from "preact-iso";
import CasinoLayout from "@/pages/casino";
import PromotionsPage from "@/pages/promotions";
import ArticlePage from "@/pages/promotions/ArticlePage";
import NotFound404 from "@/pages/not-found";
import GamePageComponent from "@/pages/game";
import AgentPage from "@/pages/agent";
import SuperAgentPage from "@/pages/superagent";
import AreaManagerPage from "@/pages/area_manager";
import AffiliatesLayout from "@/pages/affiliates";
import ContactUs from "@/pages/contact-us";
import OtherRules from "@/pages/other-rules";
import PrivacyPolicy from "@/pages/privacy-policy";
import FAQ from "@/pages/faq";
import ProvablyFairLayout from "@/pages/support/provably-fair";
import MyBetsLayout from "@/pages/betHistory";
import HelpCenterPage from "@/pages/support/help_center";
import ResponsibleGamblingPage from "@/pages/support/responsible_gambling";
import GamblingHelplinePage from "@/pages/support/gambling_helpline";
import SelfExclusionPage from "@/pages/support/self_exclusion";
import LawEnforcementRequestPage from "@/pages/support/law_enforcement_request";
import AMLPolicyPage from "@/pages/about-us/aml_policy";
import HomePage from "@/pages/home";
import SportPage from "@/pages/sport";
import AriesPaymentResult from "@/pages/payment/aries/AriesPaymentResult";
import CasinoCategoryPage from "@/pages/casino-category";

export default function AppRoute() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/casino-category" component={CasinoCategoryPage} />
      <Route path="/provably-fair" component={ProvablyFairLayout} />

      <Route path="/sports" component={SportPage} />

      <Route path="/casino/:pageType" component={CasinoLayout} />
      <Route path="/casino/:pageType/*" component={CasinoLayout} />
      <Route path="/game/:gameId" component={GamePageComponent} />

      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/promotions/:articleId" component={ArticlePage} />
      <Route path="/about-us/aml-policy" component={AMLPolicyPage} />
      <Route path="/contact-us" component={ContactUs} />
      <Route path="/other-rules" component={OtherRules} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/faq" component={FAQ} />
      {/* 
      <Route path="/support/fairness" component={ProvablyFairLayout} />
      <Route path="/support/fairness/*" component={ProvablyFairLayout} /> */}
      <Route path="/support/help-center" component={HelpCenterPage} />
      <Route path="/support/responsible-gambling" component={ResponsibleGamblingPage} />
      <Route path="/support/gambling-helpline" component={GamblingHelplinePage} />
      <Route path="/support/self-exclusion" component={SelfExclusionPage} />
      <Route path="/support/law-enforcement-request" component={LawEnforcementRequestPage} />

      <Route path="/payment/aries/result" component={AriesPaymentResult} />

      <Route path="/agent" component={AgentPage} />
      <Route path="/agent/*" component={AgentPage} />

      <Route path="/superagent" component={SuperAgentPage} />
      <Route path="/superagent/*" component={SuperAgentPage} />

      <Route path="/area_manager" component={AreaManagerPage} />
      <Route path="/area_manager/*" component={AreaManagerPage} />

      <Route path="/affiliate" component={AffiliatesLayout} />
      <Route path="/affiliate/*" component={AffiliatesLayout} />

      <Route path="/my-bets" component={MyBetsLayout} />
      <Route path="/my-bets/*" component={MyBetsLayout} />

      <Route path="*" component={NotFound404} />
    </Router>
  );
}

