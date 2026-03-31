import { useState } from "preact/hooks";
import { Textarea, Button, Input } from "@heroui/react";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";
import { toast } from "@/helpers/toast";
import { getRootDomain } from "@/helpers/getRootDomain";

export default function ContactUs() {
  const t = useTranslations("ContactUs");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRTL = RTL_LANGUAGES.includes(localeState.value);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement form submission logic
    console.log("Form submitted:", { name, email, message });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      toast.success(t("success_message") || "Message sent successfully");
    }, 1000);
  };

  return (
    <div
      className={`w-full flex flex-col md:flex-row gap-8 md:h-dvh px-4 py-10 md:px-24 md:py-24 items-center justify-center ${
        isRTL ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Left Side - Contact Information */}
      <div
        className={`flex flex-col gap-6 md:w-1/2 ${
          isRTL ? "md:text-right" : "md:text-left"
        } text-center md:text-left`}
      >
        <h1 className="text-[var(--primary-color)] text-3xl md:text-4xl font-semibold">
          {t("title") || "CONTACT US"}
        </h1>

        <p className="text-[var(--passive-color)] text-base md:text-lg">
          {t("description") ||
            "For any questions, comments, or suggestions, please feel free to contact us."}
        </p>

        <div className="flex flex-col gap-4">
          <h2 className="text-[var(--primary-color)] text-xl font-semibold">
            {t("email_section_title") || "EMAIL"}
          </h2>
          <p className="text-[var(--passive-color)] text-base">
            {t("customer_queries_text") ||
              "For customer queries, write to us at"}{" "}
            <a
              href={`mailto:support@${getRootDomain(import.meta.env.VITE_SITE_DOMAIN)}`}
              className="text-[var(--primary-color)] hover:underline"
            >
              support@{getRootDomain(import.meta.env.VITE_SITE_DOMAIN)}
            </a>
            .{" "}
            {t("other_questions_text") ||
              "For other questions or offers, drop us a line at"}{" "}
            <a
              href={`mailto:info@${getRootDomain(import.meta.env.VITE_SITE_DOMAIN)}`}
              className="text-[var(--primary-color)] hover:underline"
            >
              info@{getRootDomain(import.meta.env.VITE_SITE_DOMAIN)}
            </a>{" "}
            {t("email_receipt_text") ||
              "and we will make sure the right person receives your email."}
          </p>
        </div>
      </div>

      {/* Right Side - Contact Form */}
      <div className="flex flex-col gap-6 w-full md:w-1/2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Input
            label={t("name_label") || "Name"}
            type="text"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            required
            classNames={{
              input: "text-[16px]",
            }}
          />

          <Input
            label={t("email_label") || "Email"}
            type="email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            required
            classNames={{
              input: "text-[16px]",
            }}
          />

          <div className="w-full">
            <Textarea
              label={t("message_label") || "Message"}
              value={message}
              onValueChange={setMessage}
              placeholder=" "
              minRows={6}
              required
              classNames={{
                base: "w-full",
                input: "text-[16px]",
                inputWrapper:
                  "bg-[#fff1] border-none rounded-sm hover:bg-[#fff2] focus-within:hover:bg-[#fff2]",
              }}
            />
          </div>

          <Button
            type="submit"
            className="bg-[var(--primary-color)] text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {t("submit_button") || "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
