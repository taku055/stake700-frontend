import { useEffect, useState } from "react";
import axios from "axios";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "@/router";
import { setAxiosAuthToken } from "@/api/instance";
import { accessTokenState } from "@/state/accessTokenState";
import { userState } from "@/state/userState";
import { scrollToTop } from "@/helpers/scrollToTop";
import PersonalDetailsPage from "../myprofile/PersonalDetails";
import ChangePasswordPage from "../myprofile/ChangePassword";
import {
  PROFILE_TAB,
  profilePanelState,
  type ProfileTab,
} from "@/state/accountDialogs";
import SiteDialog from "./SiteDialog";
import { Link } from "@/components/common";

const TABS: { key: ProfileTab; labelKey: string }[] = [
  { key: PROFILE_TAB.details, labelKey: "Personal Details" },
  { key: PROFILE_TAB.password, labelKey: "Change Password" },
];

export default function ProfileAccountDialog() {
  const panel = profilePanelState.value;
  const t = useTranslations("Profile");
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const user = userState.value;
  const isOpen = panel.isOpen && user != null;
  const userName = user?.userName || "";
  const initials = userName.substring(0, 2).toUpperCase() || "U";

  useEffect(() => {
    if (!copied) return;
    navigator.clipboard.writeText(user?.id || "");
    const timer = setTimeout(() => setCopied(false), 1000);
    return () => clearTimeout(timer);
  }, [copied, user?.id]);

  const onClose = () => {
    profilePanelState.value = { ...profilePanelState.value, isOpen: false };
  };

  const selectTab = (tab: ProfileTab) => {
    profilePanelState.value = { ...profilePanelState.value, tab };
  };

  const onLogout = async () => {
    try {
      userState.value = null;
      setAxiosAuthToken("");
      accessTokenState.value = null;
      onClose();
      if (location.path.includes("agent")) {
        location.route("/");
      }
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.error(ex.message);
      }
    }
  };

  return (
    <SiteDialog
      isOpen={isOpen}
      onClose={onClose}
      title={t("My Profile")}
      titleId="profile-dialog-title"
      widthClass="md:max-w-3xl"
    >
      <div className="flex items-center gap-3 border-b border-[#2f4553] bg-[#0f212e] px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2f4553] text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">
            {userName || t("My Profile")}
          </p>
          {user?.email && (
            <p className="truncate text-xs text-[#b1bad3]">{user.email}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCopied(true)}
          className="inline-flex max-w-[46%] items-center gap-1.5 text-xs text-[#b1bad3] hover:text-white"
        >
          <span className="truncate">ID {user?.id || ""}</span>
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>

      <div className="flex gap-2 border-b border-[#2f4553] px-4 py-3">
        {TABS.map((tab) => {
          const selected = panel.tab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              aria-pressed={selected}
              onClick={() => selectTab(tab.key)}
              className={`h-9 rounded-md px-4 text-sm font-semibold ${
                selected
                  ? "bg-[#1475e1] text-white"
                  : "bg-[#0f212e] text-[#b1bad3] hover:bg-[#213743] hover:text-white"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isOpen && panel.tab === PROFILE_TAB.details && <PersonalDetailsPage />}
        {isOpen && panel.tab === PROFILE_TAB.password && <ChangePasswordPage />}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-[#2f4553] px-4 py-3">
        {user?.isCallGroup ? (
          <Link
            href="/affiliate"
            className="text-sm font-semibold text-[#b1bad3] hover:text-white"
            onClick={() => {
              onClose();
              scrollToTop();
            }}
          >
            Referrals
          </Link>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onLogout}
          className="text-sm font-semibold text-[#b1bad3] hover:text-white"
        >
          {t("Logout")}
        </button>
      </div>
    </SiteDialog>
  );
}
