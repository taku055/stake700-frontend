export type tGame = {
  id: string;
  platform_id?: string;
  name: string;
  img: string;
  device?: number;
  igp_title?: string;
  igp_categories?: string;
  soft_url?: string;
  soft_mobile_url?: string;
  soft_categories: number[];
  soft_merchant_id?: number;
  soft_sub_merchant_id?: number;
  soft_table_id?: number;
  soft_rtp?: number;
  bonus_buy?: number;
  megaways?: number;
  freespins?: number;
  freebonus?: number;
  demo?: boolean;
  is_deleted?: boolean;
  img_custom?: string;
  providerId: string;
  gameSource: "IGP" | "SOFT" | "GSS" | "BETCONSTRUCT" | "SLOTER" | "EVENBET" | "DATABETRIX";
  gameType?: "SPORT" | "SLOT" | "LIVECASINO";
  img_vertical?: string;
  /** When set, card links here instead of /game/:id (e.g. BBBet racing routes). */
  href?: string;
};
