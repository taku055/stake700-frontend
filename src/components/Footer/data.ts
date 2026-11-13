import { ASSET_BASE_URL } from "@/config/constants";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";

export const FOOTER_LINK_DATA : Array<{
  title: string;
  links: Array<{
    title: string;
    href?: string;
    onClick?: () => void;
    icon?: string;
  }>;
}> = [
  {
    title: "Casino",
    links: [
      { title: "Casino Games", href: "/casino" },
      { title: "Slots", href: "/casino/games" },
      { title: "Live Casino", href: "/live-casino" },
      { title: "Roulette", href: "/live-casino/roulette" },
      { title: "Blackjack", href: "/live-casino/blackjack" },
      { title: "Baccarat", href: "/live-casino/baccarat" },
      { title: "Promos & Competitions", href: "/promotions" },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "Help Center", href: "/support/help-center" },
      // { title: "Fairness", href: "/support/fairness" },
      { title: "Responsible Gambling", href: "/support/responsible-gambling" },
      { title: "Gambling Helpline", href: "/support/gambling-helpline" },
      { title: "Live Support", onClick: () => {
        liveSupportExpandedState.value = true;
      } },
      // { title: "Self Exclusion", href: "/support/self-exclusion" },
      // { title: "Law Enforcement Request", href: "/support/law-enforcement-request" },
    ],
  },
  {
    title: "About Us",
    links: [
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "AML Policy", href: "/about-us/aml-policy" },
      { title: "Contact Us", href: "/contact-us" },
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
    icon: `${ASSET_BASE_URL}/images/icons/blog.svg`,
    href: `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}/blog`,
  },
  {
    title: "Forum",
    icon: `${ASSET_BASE_URL}/images/icons/forum.svg`,
    href: `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}/forum`,
  },
  {
    title: "Facebook",
    icon: `${ASSET_BASE_URL}/images/icons/facebook.svg`,
    // href: `https://www.facebook.com/${process.env.NEXT_PUBLIC_SITE_NAME}`,
    href: "#"
  },
  {
    title: "Twitter",
    icon: `${ASSET_BASE_URL}/images/icons/twitter.svg`,
    href: "#"
  },
  {
    title: "Instagram",
    icon: `${ASSET_BASE_URL}/images/icons/instagram.svg`,
    href: "#"
  },
  {
    title: "Youtube",
    icon: `${ASSET_BASE_URL}/images/icons/youtube.svg`,
    href: "#"
  },
  {
    title: "Shop",
    icon: `${ASSET_BASE_URL}/images/icons/shop.svg`,
    href: `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}/shop`
  },
];
