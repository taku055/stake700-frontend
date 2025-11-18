import { userState } from "@/state/userState";
import { useEffect } from "preact/hooks";
import useSocketEvent from "@/hooks/useSocketEvent";
import { useSocket, useSocketStatus } from "@/context/SocketContext";
import { accessTokenState } from "@/state/accessTokenState";
import { tBalance } from "@/types/tBalance";
import { setAxiosAuthToken } from "@/api/instance";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { providerState } from "@/state/providerState";
import { tProvider } from "@/types/tProvider";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { apiGetCustomGames } from "@/api/common/apiGetCustomGames";
import { customGamesState } from "@/state/customGamesState";
import { loginOpenedState } from "@/state/loginOpenedState";
import { registerOpenedState } from "@/state/registerOpenedState";
import { forgotOpenedState } from "@/state/forgotOpenedState";
import ForgotPasswordDialog from "@/components/Auth/ForgotPasswordDialog";
import { apiGetSetting } from "@/api/setting/apiGetSetting";
import { maintenanceState } from "@/state/maintenanceState";
import axios from "axios";
import { visaOpenedState } from "@/state/visaOpenedState";
import VisaDialogSimple from "@/components/VisaDialogSimple";
import { depositDialogState } from "@/state/depositDialogState";
import DepositDialogFull from "@/components/DepositDialogFull";
import { bannerState } from "@/state/bannerState";
import { apiGetBanners } from "@/api/common/apiGetBanners";
import { allProvidersModalState } from "@/state/allProvidersModalState";
import AllProvidersModal from "@/components/AllProvidersModal";
import { ComponentChildren } from "preact";
import { setViewportCss } from "@/helpers/setViewportCss";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import "swiper/swiper-bundle.css";
import { LocationProvider } from "preact-iso";
import { apiAccount } from "@/api/account/apiAccount";
import { localeState } from "@/state/localeState";
import { I18nProvider } from "@/context/I18nContext";
import LoginDialog from "@/components/Auth/LoginDialog";
import SignupDialog from "@/components/Auth/SignupDialog";
import FooterNav from "@/components/FooterNav";
import ProfileComponent from "@/components/Profile";
import { profileOpenedState } from "@/state/profileOpenedState";
import { paymentState } from "@/state/paymentState";
import { tPayment } from "@/types/tPayment";
import { PAYMENT_METHOD_LIST, PRELOAD_IMAGE_URLS } from "@/config/constants";
import Sidebar from "@/components/Sidebar";
import NavigationSidebar from "@/components/NavigationSidebar";
import { favoritesGameState } from "@/state/favoritesGameState";
import { apiGetFavoritesGame } from "@/api/favorites/apiGetFavoritesGame";
import arDefinition from "@/assets/i18n/ar.json";
import azDefinition from "@/assets/i18n/az.json";
import deDefinition from "@/assets/i18n/de.json";
import elDefinition from "@/assets/i18n/el.json";
import enDefinition from "@/assets/i18n/en.json";
import esDefinition from "@/assets/i18n/es.json";
import faDefinition from "@/assets/i18n/fa.json";
import frDefinition from "@/assets/i18n/fr.json";
import heDefinition from "@/assets/i18n/he.json";
import itDefinition from "@/assets/i18n/it.json";
import ptDefinition from "@/assets/i18n/pt.json";
import ruDefinition from "@/assets/i18n/ru.json";
import trDefinition from "@/assets/i18n/tr.json";
import { globalLoadingState } from "@/state/globalLoadingState";
import Loading from "@/components/Loading";
import Support from "@/components/Chat/Support";
import { gameCategoryImagesState } from "@/state/gameCategoryImagesState";

const i18nDefinitions = {
  tr: trDefinition,
  az: azDefinition,
  ru: ruDefinition,
  en: enDefinition,
  es: esDefinition,
  pt: ptDefinition,
  fr: frDefinition,
  ar: arDefinition,
  de: deDefinition,
  el: elDefinition,
  fa: faDefinition,
  he: heDefinition,
  it: itDefinition,
};

interface GlobalServiceProviderProps {
  children: ComponentChildren;
}

export default function GlobalServiceProvider({
  children,
}: GlobalServiceProviderProps) {
  const socket = useSocket();
  const socketConnected = useSocketStatus();

  useEffect(() => {
    const getPayments = async () => {
      try {
        // const providers1 = await apiGetProviders();
        const payments = PAYMENT_METHOD_LIST;
        const paymentMap: { [id: string]: tPayment } = {};
        payments.forEach((p) => (paymentMap[p.key] = p));
        paymentState.value = {
          array: payments,
          map: paymentMap,
        };
      } catch (ex) {
        console.error(ex);
      }
    };
    const getProviders = async () => {
      try {
        const providers1 = await apiGetProviders();
        const providerMap: { [id: string]: tProvider } = {};
        providers1.forEach((p) => (providerMap[p.id] = p));
        providerState.value = {
          array: providers1,
          map: providerMap,
        };
      } catch (ex) {
        console.error(ex);
      }
    };

    const getCustomGames = async () => {
      try {
        const games = await apiGetCustomGames({
          category: "",
          offset: 0,
          limit: 10000,
        });
        customGamesState.value = games.data;
      } catch (ex) {
        console.error(ex);
      }
    };

    const getMaintenance = async () => {
      try {
        const res = await apiGetSetting("maintenance");
        maintenanceState.value = res;
      } catch (ex) {
        console.error(ex);
      }
    };

    const getBanners = async () => {
      try {
        const res = await apiGetBanners();
        bannerState.value = res;
      } catch (ex) {
        console.error(ex);
      }
    };

    const getAccount = async () => {
      const access_token = window.localStorage.getItem("access_token");
      if (access_token) {
        try {
          setAxiosAuthToken(access_token);
          const initialUser = await apiAccount();
          accessTokenState.value = access_token;
          userState.value = initialUser;
        } catch (ex) {
          setAxiosAuthToken("");
          if (axios.isAxiosError(ex)) {
            console.error(ex.message);
          } else {
            console.error(ex);
          }
        }
      }
    };

    const loadGameCategoryImages = async () => {
      try {
        const imageMap: { [url: string]: string } = {};
        const urls = [...PRELOAD_IMAGE_URLS, ...bannerState.value.map((b) => b.img)];

        await Promise.all(
          urls.map(async (url) => {
            try {
              const response = await fetch(url);
              const blob = await response.blob();
              const reader = new FileReader();

              await new Promise<void>((resolve, reject) => {
                reader.onloadend = () => {
                  if (typeof reader.result === "string") {
                    imageMap[url] = reader.result;
                    resolve();
                  } else {
                    reject(new Error("Failed to convert image to base64"));
                  }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error(`Failed to load image ${url}:`, error);
              // Keep original URL if loading fails
              imageMap[url] = url;
            }
          })
        );

        gameCategoryImagesState.value = imageMap;
      } catch (ex) {
        console.error("Failed to load game category images:", ex);
      }
    };

    const isInIframe = window.location !== window.parent.location;
    if (isInIframe) {
      console.log("isInIframe", document.referrer);
      try {
        if (window.location.host === window.parent.location.host) {
          window.parent.location.href = window.location.href;
        }
      } catch (error) {
        console.error("is-in-iframe.global", error);
      }
    }

    // set location
    localeState.value = window.localStorage.getItem("locale") || "en";

    (async () => {
      globalLoadingState.value = true;
      await getBanners();
      await Promise.all([
        getProviders(),
        getPayments(),
        getCustomGames(),
        getMaintenance(),
        getAccount(),
        loadGameCategoryImages(),
      ]);
      setTimeout(() => {
        globalLoadingState.value = false;
      }, 2000);
    })();

    // define resize event for mobile
    const onResizeViewport = () => {
      setViewportCss(
        window.visualViewport?.width || -1,
        window.visualViewport?.height || -1
      );
    };

    setTimeout(() => {
      onResizeViewport();
      window.visualViewport?.addEventListener("resize", onResizeViewport);
    }, 1000);

    return () => {
      window.visualViewport?.removeEventListener("resize", onResizeViewport);
    };
  }, []);

  useEffect(() => {
    if (!userState.value?.id) return;

    const getFavorites = async () => {
      try {
        const favorites = await apiGetFavoritesGame({
          offset: 0,
          limit: 1000,
        });
        favoritesGameState.value = favorites.data;
      } catch (ex) {
        console.error(ex);
      }
    };

    getFavorites();
  }, [userState.value?.id]);

  useEffect(() => {
    if (userState.value?.email && socket && socketConnected) {
      socket.emit("user.id", userState.value.id);
    }
  }, [userState.value?.id, socket, socketConnected]);

  useSocketEvent("balance.updated", (data: tBalance) => {
    if (userState.value) {
      userState.value = {
        ...userState.value,
        ...data,
      };
    }
  });

  useSocketEvent("user.logout", (userId: string) => {
    if (userState.value?.id != userId) {
      return;
    }

    (async () => {
      try {
        userState.value = null;
        setAxiosAuthToken("");
        accessTokenState.value = null;
        location.href = "/";
      } catch (ex) {
        if (axios.isAxiosError(ex)) {
          console.error(ex.message);
        }
      }
    })();
  });

  return (
    <HeroUIProvider>
      {globalLoadingState.value && <Loading />}
      <LocationProvider>
        <I18nProvider
          messages={
            i18nDefinitions[localeState.value as keyof typeof i18nDefinitions]
          }
        >
          <div className="flex max-h-dvh flex-col md:flex-row md:h-screen">
            <NavigationSidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <Header />
              <div className="flex-1 overflow-y-auto h-full max-h-full pl-2 md:pr-0 pr-2 body-content">
                {children}
                <Footer />
              </div>
              <FooterNav />
            </div>
          </div>

          <div>
            <ProfileComponent
              isOpen={profileOpenedState.value && userState.value != null}
              onClose={() => (profileOpenedState.value = false)}
            />
            <LoginDialog
              isOpen={loginOpenedState.value}
              onClose={() => (loginOpenedState.value = false)}
            />
            <SignupDialog
              isOpen={registerOpenedState.value}
              onClose={() => (registerOpenedState.value = false)}
            />
            <ForgotPasswordDialog
              isOpen={forgotOpenedState.value}
              onClose={() => (forgotOpenedState.value = false)}
            />
            <VisaDialogSimple
              isOpen={visaOpenedState.value}
              onClose={() => (visaOpenedState.value = false)}
            />
            <DepositDialogFull
              isOpen={depositDialogState.value.isOpen}
              tab={depositDialogState.value.defaultTab}
              onClose={() =>
              (depositDialogState.value = {
                isOpen: false,
                defaultTab: "Deposit",
              })
              }
            />
            <AllProvidersModal
              isOpen={allProvidersModalState.value}
              onClose={() => (allProvidersModalState.value = false)}
            />

            <Sidebar />
            <Support />
          </div>

          <ToastProvider
            regionProps={{
              classNames: {
                base: "z-[10000001]",
              },
            }}
            toastProps={{
              radius: "full",
              color: "primary",
              variant: "flat",
              timeout: 3000,
              hideIcon: false,
              classNames: {
                closeButton:
                  "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
                motionDiv: "max-w-[400px] w-full",
              },
            }}
          />
        </I18nProvider>
      </LocationProvider>
    </HeroUIProvider>
  );
}
