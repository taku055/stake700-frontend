import { instance } from "../instance";

export type tBBBetStartPayload = {
  currency: string;
  language: string;
  launchUrl?: string;
  customTheme?: string;
};

export type tBBBetStartResponse = {
  iframeUrl?: string;
};

export const apiGetBBBetUrl = async (
  guest: boolean,
  payload: tBBBetStartPayload,
) => {
  const res = await instance.post<tBBBetStartResponse>(
    guest ? `/game/start-bbbet-guest` : `/game/start-bbbet`,
    payload,
  );
  return res.data;
};
