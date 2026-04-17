import { capitalize } from "@/helpers/capitalize";

export type HelpArticle = {
  id: string;
  titleKey: string;
  bodyKey: string;
  tagsKey: string;
};

export type HelpCategory = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  articles: HelpArticle[];
};

export const BRAND_NAME = capitalize(import.meta.env.VITE_SITE_NAME);

export const HELP_CATEGORY_DATA: HelpCategory[] = [
  {
    id: "getting-started",
    titleKey: "category_getting_started_title",
    descriptionKey: "category_getting_started_description",
    icon: "🚀",
    articles: [
      {
        id: "create-account",
        titleKey: "article_create_account_title",
        bodyKey: "article_create_account_body",
        tagsKey: "article_create_account_tags",
      },
      {
        id: "kyc",
        titleKey: "article_kyc_title",
        bodyKey: "article_kyc_body",
        tagsKey: "article_kyc_tags",
      },
      {
        id: "responsible-gaming",
        titleKey: "article_responsible_gaming_title",
        bodyKey: "article_responsible_gaming_body",
        tagsKey: "article_responsible_gaming_tags",
      },
    ],
  },
  {
    id: "payments",
    titleKey: "category_payments_title",
    descriptionKey: "category_payments_description",
    icon: "💳",
    articles: [
      {
        id: "deposit-methods",
        titleKey: "article_deposit_methods_title",
        bodyKey: "article_deposit_methods_body",
        tagsKey: "article_deposit_methods_tags",
      },
      {
        id: "withdrawal-times",
        titleKey: "article_withdrawal_times_title",
        bodyKey: "article_withdrawal_times_body",
        tagsKey: "article_withdrawal_times_tags",
      },
      {
        id: "chargebacks",
        titleKey: "article_chargebacks_title",
        bodyKey: "article_chargebacks_body",
        tagsKey: "article_chargebacks_tags",
      },
    ],
  },
  {
    id: "bonuses",
    titleKey: "category_bonuses_title",
    descriptionKey: "category_bonuses_description",
    icon: "🎁",
    articles: [
      {
        id: "wagering",
        titleKey: "article_wagering_title",
        bodyKey: "article_wagering_body",
        tagsKey: "article_wagering_tags",
      },
      {
        id: "bonus-issues",
        titleKey: "article_bonus_issues_title",
        bodyKey: "article_bonus_issues_body",
        tagsKey: "article_bonus_issues_tags",
      },
      {
        id: "promo-terms",
        titleKey: "article_promo_terms_title",
        bodyKey: "article_promo_terms_body",
        tagsKey: "article_promo_terms_tags",
      },
    ],
  },
  {
    id: "security",
    titleKey: "category_security_title",
    descriptionKey: "category_security_description",
    icon: "🛡️",
    articles: [
      {
        id: "2fa",
        titleKey: "article_2fa_title",
        bodyKey: "article_2fa_body",
        tagsKey: "article_2fa_tags",
      },
      {
        id: "locked-account",
        titleKey: "article_locked_account_title",
        bodyKey: "article_locked_account_body",
        tagsKey: "article_locked_account_tags",
      },
      {
        id: "privacy",
        titleKey: "article_privacy_title",
        bodyKey: "article_privacy_body",
        tagsKey: "article_privacy_tags",
      },
    ],
  },
];
