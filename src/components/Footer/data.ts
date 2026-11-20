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
    title: "Games",
    links: [
      { title: "Casino", href: "/casino" },
      { title: "Slots", href: "/casino/games" },
      { title: "Live Casino", href: "/live-casino" },
      { title: "Sports", href: "/sports" },
      { title: "Publishers", href: "/providers" },
      { title: "Best Slots This Month", href: "/best-slots" },
    ],
  },
  {
    title: "Promotions",
    links: [
      { title: "Promos & Competitions", href: "/promotions" },
      { title: "VIP Club", href: "/vip" },
      { title: "Affiliate", href: "/affiliate" },
      { title: "General Bonus Terms and Conditions", href: "/promotions/terms" },
      { title: "Blog & Reviews", href: "/blog" },
    ],
  },
  {
    title: "Help",
    links: [
      { title: "Help Center", href: "/support/help-center" },
      { title: "FAQ", href: "/faq" },
      { title: "Fairness", href: "/provably-fair" },
      { title: "Contact Us", href: "/contact-us" },
      {
        title: "Live Support",
        onClick: () => {
          liveSupportExpandedState.value = true;
        },
      },
    ],
  },
  {
    title: "About Us",
    links: [
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "AML Policy", href: "/about-us/aml-policy" },
      { title: "Other Rules", href: "/other-rules" },
      { title: "Self Exclusion", href: "/support/self-exclusion" },
      { title: "Gambling Helpline", href: "/support/gambling-helpline" },
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
