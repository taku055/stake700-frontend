import EmulateBetting from "@/components/EmulateBetting";
import SearchWidget from "@/components/Header/SearchWidget";
import { CasinoGameGrid } from "./components/CasinoGameGrid";
import ProviderGroup from "@/components/ProviderGroup";
import { useLocation } from "preact-iso";
import { tPageType } from "./data";
import { ProviderSelection } from "./components/ProviderSelection";
import { providerState } from "@/state/providerState";
import { useEffect, useState } from "preact/hooks";
import { tProvider } from "@/types/tProvider";
import { apiGetCustomCategoryProviders } from "@/api/common/apiGetCustomCategoryProviders";

export default function CasinoPageComponent({
  pageType,
}: {
  pageType: tPageType;
}) {
  const location = useLocation();
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [providers, setProviders] = useState<tProvider[]>([]);

  useEffect(() => {
    if (location.query.custom === "1") {
      const getProviders = async () => {
        const res = await apiGetCustomCategoryProviders(
          location.query.category as string
        );
        setProviders(res);
      };
      getProviders();
    } else {
      setProviders(providerState.value.array);
    }
  }, [
    providerState.value.array,
    location.query.custom,
    location.query.category,
  ]);

  const onSelectedProvidersChange = (nextProviders: string[]) => {
    setSelectedProviders(nextProviders);
    const pathname = location.path.split("?")[0];
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(location.query ?? {})) {
      if (key === "providerId" || value === undefined || value === null) {
        continue;
      }
      if (Array.isArray(value)) {
        for (const v of value) {
          params.append(key, String(v));
        }
      } else {
        params.set(key, String(value));
      }
    }
    const providerId = nextProviders.join(",");
    if (providerId) {
      params.set("providerId", providerId);
    }
    const search = params.toString();
    location.route(search ? `${pathname}?${search}` : pathname);
  };

  return (
    <div className="w-full flex flex-col gap-3 p-2">
      <div className="flex gap-3">
        <div className="max-w-[1200px] w-full h-full flex flex-col mx-auto">
          <SearchWidget />

          <div className={`w-full flex flex-col gap-6 mt-[20px]`}>
            <ProviderSelection
              providers={providers}
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
