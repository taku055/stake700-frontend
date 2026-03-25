export type tProvider = {
  id: string;
  platform_id?: string;
  name: string;
  img?: string;
  order: number;
  added_slot: boolean;
  count: number;
  gameSource: "IGP" | "SOFT" | "GROUP998" | "SLOTER" | "GSS" | "BETCONSTRUCT";
  gameType: string[];
};
