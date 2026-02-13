import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { userState } from "@/state/userState";
import { setAxiosAuthToken } from "@/api/instance";
import { accessTokenState } from "@/state/accessTokenState";
import axios from "axios";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "preact-iso";
import { Link } from "@/components/common";
import { data } from "./data";
import { profileMenuOpenedState } from "@/state/profilemenuState";
import { ASSET_BASE_URL } from "@/config/constants";

export default function ProfileMenu() {
  const user = userState.value;
  const t = useTranslations("ProfileMenu");
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const isOpen = profileMenuOpenedState.value;

  // Calculate position based on ProfileButton
  useEffect(() => {
    if (isOpen) {
      const updatePosition = () => {
        const button = document.querySelector('[aria-label="Open profile"]') as HTMLElement;
        if (button) {
          const rect = button.getBoundingClientRect();
          setPosition({
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
          });
        }
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        profileMenuOpenedState.value = false;
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onLogout = useCallback(async () => {
    try {
      userState.value = null;
      setAxiosAuthToken("");
      accessTokenState.value = null;

      if (location.path.includes("agent")) {
        location.route("/");
      }
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.error(ex.message);
      }
    }
  }, [userState, setAxiosAuthToken, accessTokenState]);

  const onClickItem = (item?: { onClick?: () => void; href?: string }) => {
    profileMenuOpenedState.value = false;
    if (item?.onClick) {
      item.onClick();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99]"
        onClick={() => (profileMenuOpenedState.value = false)}
      />
      
      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed bg-white rounded-lg shadow-lg z-[100] min-w-[200px] py-2"
        style={{
          top: `${position.top}px`,
          right: `${position.right}px`,
        }}
      >
        {data.map((item) =>
          item.href ? (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer"
              onClick={() => onClickItem(item)}
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-5 h-5 object-contain brightness-0"
              />
              <span className="text-sm text-black font-medium">{t(item.title)}</span>
            </Link>
          ) : (
            <button
              key={item.title}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-300 transition-colors text-left cursor-pointer"
              onClick={() => onClickItem(item)}
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-5 h-5 object-contain brightness-0"
              />
              <span className="text-sm text-black font-medium">{t(item.title)}</span>
            </button>
          )
        )}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-300 transition-colors text-left cursor-pointer border-t border-gray-200 mt-1"
          onClick={
            () => {
              onLogout();
              profileMenuOpenedState.value = false;
            }
          }
        >
          <img
            src={`/images/icons/icons/logout.png`}
            alt="Logout"
            className="w-5 h-5 object-contain brightness-0"
          />
          <span className="text-sm text-black font-medium">{t("Logout")}</span>
        </button>
      </div>
    </>
  );
}
