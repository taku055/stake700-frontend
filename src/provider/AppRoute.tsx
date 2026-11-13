import { Route, Router } from "@/router";
import CasinoLayout from "@/site/casino";
import PromotionsPage from "@/site/promotions";
import ArticlePage from "@/site/promotions/ArticlePage";
import NotFound404 from "@/site/not-found";
import GamePageComponent from "@/site/game";
import AgentPage from "@/site/agent";
import SuperAgentPage from "@/site/superagent";
import AreaManagerPage from "@/site/area_manager";
import AffiliatesLayout from "@/site/affiliates";
import ContactUs from "@/site/contact-us";
import OtherRules from "@/site/other-rules";
import PrivacyPolicy from "@/site/privacy-policy";
import FAQ from "@/site/faq";
import ProvablyFairLayout from "@/site/support/provably-fair";
import MyBetsLayout from "@/site/betHistory";
import HelpCenterPage from "@/site/support/help_center";
import ResponsibleGamblingPage from "@/site/support/responsible_gambling";
import GamblingHelplinePage from "@/site/support/gambling_helpline";
import SelfExclusionPage from "@/site/support/self_exclusion";
import LawEnforcementRequestPage from "@/site/support/law_enforcement_request";
import AMLPolicyPage from "@/site/about-us/aml_policy";
import HomePage from "@/site/home";
import SportPage from "@/site/sport";
import RacingPage from "@/site/sports/RacingPage";
import AriesPaymentResult from "@/site/payment/aries/AriesPaymentResult";
import DepositPaymentResultPage from "@/site/profile/deposit";
import CasinoCategoryPage from "@/site/casino-category";
import VipPage from "@/site/vip";
import EpayclubCardCheckout from "@/site/payment/epayclub/EpayclubCardCheckout";
import EpayclubPaymentResult from "@/site/payment/epayclub/EpayclubPaymentResult";
import FavoritesPage from "@/site/favorites";
import VerifyEmailPage from "@/site/verify-email";
import ResetPasswordPage from "@/site/reset-password";

export default function AppRoute() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/casino-category" component={CasinoCategoryPage} />
      <Route path="/provably-fair" component={ProvablyFairLayout} />
      <Route path="/verify-email" component={VerifyEmailPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />

      <Route path="/sports" component={SportPage} />
      <Route
        path="/sports/racing"
        component={() => <RacingPage racing="horseRacing" />}
      />
      <Route
        path="/sports/racing/greyhound"
        component={() => <RacingPage racing="greyhound" />}
      />
      <Route
        path="/sports/racing/harness"
        component={() => <RacingPage racing="harness" />}
      />

      <Route path="/casino/:pageType" component={CasinoLayout} />
      <Route path="/casino/:pageType/*" component={CasinoLayout} />
      <Route path="/game/:gameId" component={GamePageComponent} />
      <Route path="/favorites" component={FavoritesPage} />

      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/promotions/:articleId" component={ArticlePage} />
      <Route path="/vip" component={VipPage} />
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
      <Route path="/payment/epayclub/card/checkout" component={EpayclubCardCheckout} />
      <Route path="/payment/epayclub/result" component={EpayclubPaymentResult} />
      <Route path="/profile/deposit" component={DepositPaymentResultPage} />

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

