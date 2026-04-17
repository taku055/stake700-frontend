import WageringPage from "@/pages/wagering";
import { userState } from "@/state/userState";

export const BonusPage = () => {
  return (
    <div className="w-full h-full relative min-h-[90vh]!">
      {/* <iframe
        src={`https://betwaytrbonus.com/?userID=${userState.value?.id}`}
        className="w-full h-full absolute top-0 left-0"
      ></iframe> */}
      <WageringPage />
    </div>
  );
};
