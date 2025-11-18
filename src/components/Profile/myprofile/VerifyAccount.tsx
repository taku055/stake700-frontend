import { useTranslations } from "@/context/I18nContext";
import { Input } from "@heroui/react";
const VerfyAccountPage = () => {
  const t = useTranslations("PersonalDetails");
  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-5 boder-b border-[#FFFFFF1A] bg-[#FFFFFF1A]">Time-Out</div>
      <div className="w-full p-5 flex-1">
        <div className="flex flex-row items-center gap-1 pb-2 text-[#FFFFFFCC]">
          Dear user, to validate your account, you need to upload your identification document. While uploading, make sure it corresponds to the following criteria: • The
          file is in JPG, PNG, GIF, or PDF format and doesn't exceed 10MB. • The document in its validity period.• The picture should be in natural colors, not black and
          white. • The picture should be taken from the original document. No digital photoshop is acceptable. • The photocopy of the documents, personal data, the
          signature, the seal, and other information should be clear and readable. • If necessary, the company can request to present additional documents.
        </div>
        <div className="flex flex-row items-center gap-1 pb-2 text-[#FFFFFFCC]">
          <Input type="file" />
        </div>
        <div className="flex mt-20">
          <button className="bg-[#2A8038] text-[#FFFFFF] px-4 py-2 rounded-md">
            {t("Verify Account")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerfyAccountPage;