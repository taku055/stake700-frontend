export type HelpArticle = {
  id: string;
  title: string;
  body: string;
  tags?: string[];
};

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  articles: HelpArticle[];
};

export const BRAND_NAME = "Betalarab";

export const HELP_CATEGORY_DATA = [
  {
    id: "getting-started",
    title: "Getting started",
    description: "Account setup, verification, and first deposit.",
    icon: "🚀",
    articles: [
      {
        id: "create-account",
        title: "How do I create an account?",
        body:
          `To create an account on ${BRAND_NAME}, select “Sign Up”, enter your details, and confirm your email. ` +
          "For security, choose a strong password and enable 2FA if available.",
        tags: ["account", "signup"],
      },
      {
        id: "kyc",
        title: "Why do you need verification (KYC)?",
        body:
          "Verification helps protect you and prevents fraud. You may be asked for proof of identity and address " +
          "before withdrawals are processed.",
        tags: ["verification", "security"],
      },
      {
        id: "responsible-gaming",
        title: "Responsible gaming tools",
        body:
          "You can set deposit limits, cooling-off periods, or self-exclusion in your account settings. " +
          "If you feel gaming is no longer fun, please use these tools or contact support.",
        tags: ["limits", "safety"],
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & withdrawals",
    description: "Deposits, withdrawals, fees, and processing times.",
    icon: "💳",
    articles: [
      {
        id: "deposit-methods",
        title: "What deposit methods are supported?",
        body:
          "Supported methods vary by region. In the cashier, you’ll see the options available to you, along with " +
          "any minimum/maximum deposit limits.",
        tags: ["deposit", "cashier"],
      },
      {
        id: "withdrawal-times",
        title: "How long do withdrawals take?",
        body:
          "Withdrawal times depend on verification status and payment method. After approval, processing can range " +
          "from minutes to several business days.",
        tags: ["withdrawals", "processing"],
      },
      {
        id: "chargebacks",
        title: "What is a chargeback and why is it important?",
        body:
          "A chargeback is a payment reversal initiated by your bank or card provider. Excessive chargebacks can " +
          "lead to restrictions. Please contact support first if you need help with a transaction.",
        tags: ["billing", "policy"],
      },
    ],
  },
  {
    id: "bonuses",
    title: "Bonuses & promotions",
    description: "Bonus eligibility, wagering, and common rules.",
    icon: "🎁",
    articles: [
      {
        id: "wagering",
        title: "What are wagering requirements?",
        body:
          "Wagering requirements indicate how many times a bonus must be played through before it becomes withdrawable. " +
          "Check the promotion terms for the exact multiplier and eligible games.",
        tags: ["bonus", "terms"],
      },
      {
        id: "bonus-issues",
        title: "My bonus didn’t activate—what should I do?",
        body:
          "First, ensure you opted-in and met the minimum deposit requirement. If everything looks correct, contact support " +
          "with your transaction ID and the promotion name.",
        tags: ["bonus", "troubleshooting"],
      },
      {
        id: "promo-terms",
        title: "Where can I find promotion terms?",
        body:
          "Promotion terms are shown in the Promotions section and may also appear in the cashier during deposit. " +
          "We recommend reviewing terms before opting in.",
        tags: ["terms", "promotions"],
      },
    ],
  },
  {
    id: "security",
    title: "Security & privacy",
    description: "2FA, account protection, and privacy questions.",
    icon: "🛡️",
    articles: [
      {
        id: "2fa",
        title: "How do I enable 2-factor authentication (2FA)?",
        body: "Go to Account → Security → 2FA, then follow the steps to pair your authenticator app. Store backup codes safely.",
        tags: ["security", "2fa"],
      },
      {
        id: "locked-account",
        title: "My account is locked—what now?",
        body:
          "Accounts may lock after multiple failed login attempts. Use “Forgot Password” or contact support to regain access. " +
          "Never share your password with anyone.",
        tags: ["login", "security"],
      },
      {
        id: "privacy",
        title: "How is my data used?",
        body:
          "We use your data to provide the service, comply with legal obligations, and prevent fraud. For details, review " +
          "the Privacy Policy linked in the footer of the site.",
        tags: ["privacy", "policy"],
      },
    ],
  },
];
