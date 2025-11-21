import { userState } from "@/state/userState";
import { profileOpenedState } from "@/state/profileOpenedState";
import { User } from "lucide-preact";
import { useState } from "preact/hooks";

export default function ProfileButton() {
  const userAvatar = userState.value?.avatar;
  const defaultIcon = "/images/user-default.png";
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
      className="w-[42px] h-[42px] rounded-full bg-[var(--bar-background-color)] p-1 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
      aria-label="Open profile"
    >
      {showFallbackIcon ? (
        <User size={18} color="white" />
      ) : userAvatar ? (
        <img
          src={userAvatar}
          alt="User avatar"
          className="w-full h-full object-cover rounded-full"
          onError={handleImageError}
        />
      ) : (
        <img
          src={defaultIcon}
          alt="Default user icon"
          className="w-full h-full object-cover rounded-full"
          onError={handleImageError}
        />
      )}
    </button>
  );
}

