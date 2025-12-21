import { useState } from "preact/hooks";
import { Input } from "@/components/common/Input";
import { Textarea } from "@heroui/react";
import { Button } from "@heroui/react";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";

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
        <h1 className="text-[var(--primary-color)] text-3xl md:text-4xl font-bold">
          {t("title") || "CONTACT US"}
        </h1>

        <p className="text-[var(--passive-color)] text-base md:text-lg">
          {t("description") || "For any questions, comments, or suggestions, please feel free to contact us."}
        </p>

        <div className="flex flex-col gap-4">
          <h2 className="text-[var(--primary-color)] text-xl font-semibold">
            {t("email_section_title") || "EMAIL"}
          </h2>
          <p className="text-[var(--passive-color)] text-base">
            {t("customer_queries_text") || "For customer queries, write to us at"}{" "}
            <a
              href="mailto:support@ichancy.com"
              className="text-[var(--primary-color)] hover:underline"
            >
              support@ichancy.com
            </a>
            . {t("other_questions_text") || "For other questions or offers, drop us a line at"}{" "}
            <a
              href="mailto:info@ichancy.com"
              className="text-[var(--primary-color)] hover:underline"
            >
              info@ichancy.com
            </a>{" "}
            {t("email_receipt_text") || "and we will make sure the right person receives your email."}
          </p>
        </div>
      </div>

      {/* Right Side - Contact Form */}
      <div className="flex flex-col gap-6 md:w-1/2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Input
            // label={t("name_label") || "Name"}
            type="text"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            required
            classNames={{
              container: "w-full",
            }}
          />

          <Input
            // label={t("email_label") || "Email"}
            type="email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            required
            classNames={{
              container: "w-full",
            }}
          />

          <div className="w-full">
            <Textarea
              // label={t("message_label") || "Message"}
              value={message}
              onValueChange={setMessage}
              placeholder=" "
              minRows={6}
              required
              classNames={{
                base: "w-full",
                input: "text-white",
                inputWrapper:
                  "bg-[#fff1] border-none rounded-sm hover:bg-[#fff2] focus-within:hover:bg-[#fff2]",
                //  label: "text-white/80 text-xs",
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
