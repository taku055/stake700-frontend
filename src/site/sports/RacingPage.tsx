import BBSportsbook from "@/components/BBSportsbook";
import {
  BBBET_LAUNCH_URLS,
  type BbbetRacingKey,
} from "@/config/bbbetSportsbook";

const RACING_LAUNCH_URLS: Record<BbbetRacingKey, string> = {
  horseRacing: BBBET_LAUNCH_URLS.horseRacing,
  greyhound: BBBET_LAUNCH_URLS.greyhound,
  harness: BBBET_LAUNCH_URLS.harness,
};

export default function RacingPage({ racing }: { racing: BbbetRacingKey }) {
  return <BBSportsbook launchUrl={RACING_LAUNCH_URLS[racing]} />;
}
