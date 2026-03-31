import { capitalize } from "@/helpers/capitalize";

export interface FAQItem {
  question: string;
  answer: string;
}

export const getFAQData = (t: (key: string) => string): FAQItem[] => [
  {
    question: t("question_1") || `How can I register at ${capitalize(import.meta.env.VITE_SITE_NAME)}?`,
    answer: t("answer_1") || "All you have to do is to click on the Register button and enter your email address and desired password. That's it. You will not be asked for additional personal information and you are in!",
  },
  {
    question: t("question_2") || "I forgot my password, How can I recover my account?",
    answer: t("answer_2") || "Click on Login from the top menu and than click on Forgot Password. Type your email address that you have used during registration and a new password will be sent.",
  },
  {
    question: t("question_3") || `How many accounts can I create at ${capitalize(import.meta.env.VITE_SITE_NAME)}?`,
    answer: t("answer_3") || "Only one account per person, email address, IP address, crypto wallet number and one electronic device. You can get banned for the creation of additional accounts and the funds on the account can be confiscated.",
  },
  {
    question: t("question_4") || "Can I open another account while I take a Time-out(Self Exclusion)?",
    answer: t("answer_4") || `${capitalize(import.meta.env.VITE_SITE_NAME)} is comitted to a Responsible Gaming and does not allow it's players to open up multiple accounts especially for Self Exclusion reasons. We aim to provide our customers with a safe and secure environment which will give you a pleasant and rewarding experience. We encourage our clients to use our services responsibly and in a reasonable manner.`,
  },
  {
    question: t("question_5") || `Is there an age restriction at ${capitalize(import.meta.env.VITE_SITE_NAME)}?`,
    answer: t("answer_5") || `You must be at least 18 years of age to register at ${capitalize(import.meta.env.VITE_SITE_NAME)}, provided that this is the minimum age requirement for online gaming within your jurisdiction. If higher, you must meet your local jurisdiction requirements.`,
  },
];

