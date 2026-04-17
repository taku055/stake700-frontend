// Sportsbook Configuration
// Replace these values with the actual credentials provided by your account manager

export const SPORTSBOOK_CONFIG = {
  // Your personal sportsbook URL
  HOST: import.meta.env.VITE_SPORTSBOOK_URL || "",

  // Partner ID provided by the account manager
  PARTNER_ID: import.meta.env.VITE_SPORTSBOOK_PARTNER_ID || "",

  // Sub-partner ID (optional)
  SUB_PARTNER_ID: import.meta.env.VITE_SPORTSBOOK_SUB_PARTNER_ID || "",

  // Theme editor data (optional)
  //THEME_EDITOR_DATA: import.meta.env.VITE_SPORTSBOOK_THEME_DATA || '',
  THEME_EDITOR_DATA: import.meta.env.VITE_SPORTSBOOK_THEME_DATA || "{}",
  // Custom styles URL (optional)
  CUSTOM_STYLES: import.meta.env.VITE_SPORTSBOOK_CUSTOM_STYLES || "",

  // SDK script URL
  get SDK_SCRIPT_URL() {
    return `${this.HOST}/assets/sdk/shadow/init.js`;
  },
};

// Default configuration for the sportsbook initialization
export const getDefaultSportsbookConfig = (
  lang: string,
  token: string | undefined
) => ({
  host: SPORTSBOOK_CONFIG.HOST,
  cid: SPORTSBOOK_CONFIG.PARTNER_ID,
  allowToChangeParentStyles: true,
  lang,
  token,
  containerId: "sportsbook-placeholder",
  themeEditorData: SPORTSBOOK_CONFIG.THEME_EDITOR_DATA,
  customStyles: SPORTSBOOK_CONFIG.CUSTOM_STYLES,
  sub_partner_id: SPORTSBOOK_CONFIG.SUB_PARTNER_ID,
  loginUrl: "sendPostMessage" as const,
  depositUrl: "sendPostMessage" as const,
  lineFilter: "sport" as const,
});

export const checkTurbostarsSDKLoaded = () => {
  if (typeof window !== "undefined" && (window as any).Sportsbook) {
    return true;
  }
  return false;
};
