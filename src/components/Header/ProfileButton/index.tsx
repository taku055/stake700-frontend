import { userState } from "@/state/userState";
import { profileOpenedState } from "@/state/profileOpenedState";
import { User } from "lucide-preact";
import { useState } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";

export default function ProfileButton() {
  const t = useTranslations("Header");
  const userAvatar = userState.value?.avatar;
  const defaultIcon = "/images/icons/others/user-default.svg";
  const [showFallbackIcon, setShowFallbackIcon] = useState(false);

  const handleClick = () => {
    profileOpenedState.value = true;
  };

  const handleImageError = () => {
    setShowFallbackIcon(true);
  };

  return (
    <button
      onClick={handleClick}
      className="w-[44px] h-[44px] rounded-full p-1 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
      aria-label={t("Open profile")}
    >
      {showFallbackIcon ? (
        <User size={18} color="white" />
      ) : userAvatar ? (
        <img
          src={userAvatar}
          alt={t("User avatar")}
          className="w-full h-full object-cover rounded-full"
          onError={handleImageError}
        />
      ) : (
        <img
          src={defaultIcon}
          alt={t("Default user icon")}
          className="w-[20px] h-[20px] object-cover"
          onError={handleImageError}
        />
      )}
    </button>
  );
}

