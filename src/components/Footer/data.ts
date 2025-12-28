import { BASE_URL } from "@/config/constants";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";
import { vipOpenedState } from "@/state/vipOpenedState";
import { depositDialogOpenedState } from "@/state/walletDialogState";


export const FOOTER_LINK_DATA = [
  {
    title: "Casino",
    links: [
      { title: "Casino Games", href: "/casino/slots?custom=1&category=home"},
      { title: "Slots", href: "/casino/slots" },
      { title: "Live Casino", href: "/casino/live-casino" },
      { title: "Roulette", href: "/casino/live-casino?custom=2&category=rouletteglobal" },
      { title: "Blackjack", href: "/casino/live-casino?custom=2&category=blackjacks" },
      { title: "Poker", href: "/casino/live-casino?custom=2&category=videopoker" },
      { title: "Publishers", href: "/publishers" },
      { title: "Promos & Competitions", href: "/promotions" },
      { title: "Betalarab Engine", href: "/Betalarab-engine" },
      { title: "Betalarab Vendors", href: "/Betalarab-vendors" },
    ],
  },
  {
    title: "Sports",
    links: [
      { title: "Sportsbook", href: "/sportsbook" },
      { title: "Live Sports", href: "/live-sports" },
      { title: "Soccer", href: "/sports/soccer" },
      { title: "Basketball", href: "/sports/basketball" },
      { title: "Tennis", href: "/sports/tennis" },
      { title: "eSports", href: "/sports/esports" },
      { title: "Bet Bonuses", href: "/sports/bonuses" },
      { title: "Sports Rules", href: "/sports/rules" },
      { title: "Racing Rules", href: "/sports/racing-rules" },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "Help Center", href: "/help-center" },
      { title: "Fairness", href: "/fairness" },
      { title: "Responsible Gambling", href: "/responsible-gambling" },
      { title: "Gambling Helpline", href: "/gambling-helpline" },
      { title: "Live Support", onClick: () => {
        liveSupportExpandedState.value = true;
      } },
      { title: "Self Exclusion", href: "/self-exclusion" },
      { title: "Law Enforcement Request", href: "/law-enforcement-request" },
    ],
  },
  {
    title: "About Us",
    links: [
      { title: "VIP Club", onClick: () => {
        vipOpenedState.value = true;
      } },
      { title: "Affiliate", href: "/affiliate" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "AML Policy", href: "/aml-policy" },
      { title: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Payment Info",
    links: [
      { title: "Deposit & Withdrawals", onClick: () => {
        depositDialogOpenedState.value = true;
      } },
      { title: "Currency Guide", href: "/payments/currency-guide" },
      { title: "Crypto Guide", href: "/payments/crypto-guide" },
      { title: "Supported Crypto", href: "/payments/supported-crypto" },
      { title: "How Much to Bet With", href: "/payments/how-much-to-bet" },
    ],
  },
  {
    title: "FAQ",
    links: [
      { title: "question_1", href: "/faq" },
      { title: "question_2", href: "/faq" },
      { title: "question_3", href: "/faq" },
      { title: "question_4", href: "/faq" },
      { title: "question_5", href: "/faq" },
    ],
  },
];

export const FOOTER_SOCIAL_DATA = [
  {
    title: "Blog",
    icon: `${BASE_URL}/images/icons/blog.svg`,
    href: "https://betalarab.com/blog",
  },
  {
    title: "Forum",
    icon: `${BASE_URL}/images/icons/forum.svg`,
    href: "https://betalarab.com/forum",
  },
  {
    title: "Facebook",
    icon: `${BASE_URL}/images/icons/facebook.svg`,
    // href: "https://www.facebook.com/betalarab",
    href: "#"
  },
  {
    title: "Twitter",
    icon: `${BASE_URL}/images/icons/twitter.svg`,
    href: "#"
  },
  {
    title: "Instagram",
    icon: `${BASE_URL}/images/icons/instagram.svg`,
    href: "#"
  },
  {
    title: "Youtube",
    icon: `${BASE_URL}/images/icons/youtube.svg`,
    href: "#"
  },
  {
    title: "Shop",
    icon: `${BASE_URL}/images/icons/shop.svg`,
    href: "https://betalarab.com/shop"
  },
];
