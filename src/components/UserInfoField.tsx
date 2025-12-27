import { Checkbox } from "@heroui/checkbox";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";

interface UserInfoFieldProps {
  label: string;
  value?: string | number | null;
  type?: "text" | "checkbox" | "date" | "currency";
  isChecked?: boolean;
  className?: string;
}

export default function UserInfoField({
  label,
  value,
  type = "text",
  isChecked,
  className = "",
}: UserInfoFieldProps) {
  const t = useTranslations("Common");
  
  const renderValue = () => {
    switch (type) {
      case "checkbox":
        return (
          <div className="flex items-center gap-1">
            <Checkbox isSelected={isChecked} isReadOnly />
            <span className="text-sm">{isChecked ? t("Yes") : t("No")}</span>
          </div>
        );

      case "date":
        return (
          <span className="text-sm">
            {value ? new Date(value as string).toLocaleDateString() : t("N/A")}
          </span>
        );

      case "currency":
        return <span className="text-sm">{DEFAULT_CURRENCY_SYMBOL}{value || "0"}</span>;

      default:
        return (
          <span className="text-sm">
            {value === undefined || value === null ? t("N/A") : value}
          </span>
        );
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-default-600">{label}</label>
      {renderValue()}
    </div>
  );
}
