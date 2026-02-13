import EmulateBetting from "@/components/EmulateBetting";
import SearchWidget from "@/components/Header/SearchWidget";
import { CasinoGameGrid } from "./components/CasinoGameGrid";
import ProviderGroup from "@/components/ProviderGroup";
import { useLocation } from "preact-iso";
import { tPageType } from "./data";
import { ProviderSelection } from "./components/ProviderSelection";
import { providerState } from "@/state/providerState";
import { useState } from "preact/hooks";

export default function CasinoPageComponent({
  pageType,
}: {
  pageType: tPageType;
}) {
  const location = useLocation();
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const onSelectedProvidersChange = (providers: string[]) => {
    setSelectedProviders(providers);
    location.route(`/casino/search?providerId=${providers.join(",")}`);
  };

  return (
    <div className="w-full flex flex-col gap-3 p-2">
      <div className="flex gap-3">
        <div className="max-w-[1200px] w-full h-full flex flex-col mx-auto">
          <SearchWidget />

          <div className={`w-full flex flex-col gap-6 mt-[20px]`}>
            <ProviderSelection
              providers={providerState.value.array}
              value={selectedProviders}
              onChange={onSelectedProvidersChange}
            />
            <CasinoGameGrid
              isCustom={location.query.custom === "1"}
              category={location.query.category as string}
              gameType={
                pageType === "live-casino"
                  ? "LIVECASINO"
                  : pageType === "slots"
                  ? "SLOT"
                  : null
              }
              provider={location.query.providerId as string}
            />
          </div>
          <ProviderGroup />
          <div className="flex flex-col pb-4">
            <EmulateBetting />
          </div>
        </div>
      </div>
    </div>
  );
}
