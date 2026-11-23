"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  Bell,
  Cherry,
  Clover,
  Crown,
  Gem,
  Gift,
  Headset,
  House,
  RotateCcw,
  Search,
  Star,
  Tv,
  Dices,
  type LucideProps,
} from "lucide-react";
import { Link } from "@/components/common";
import { routes } from "@/config/routes";
import { useTranslations } from "@/context/I18nContext";
import { openSearch } from "@/state/searchWidgetState";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";
import { loginOpenedState } from "@/state/loginOpenedState";
import { userState } from "@/state/userState";
import styles from "./NotFound.module.scss";

type ReelSymbol = { Icon: ComponentType<LucideProps>; color: string };

const SYMBOLS: ReelSymbol[] = [
  { Icon: Cherry, color: "#ff5d73" },
  { Icon: Gem, color: "#5ed3ff" },
  { Icon: Crown, color: "#f3b52d" },
  { Icon: Clover, color: "#3ddc97" },
  { Icon: Bell, color: "#ffcf5c" },
  { Icon: Star, color: "#c084fc" },
];

/** Each reel spins past a few symbols and stops on its digit. Longer strips stop later. */
const REELS = [
  { digit: "4", length: 11 },
  { digit: "0", length: 15 },
  { digit: "4", length: 19 },
];

/** Same order on server and client, so the markup hydrates cleanly. */
function reelSymbols(reel: number, length: number): ReelSymbol[] {
  return Array.from({ length }, (_, i) => SYMBOLS[(i * (reel + 2) + reel) % SYMBOLS.length]);
}

const BULBS = 14;

export default function NotFound404() {
  const t = useTranslations("NotFoundPage");
  const [spin, setSpin] = useState(0);
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  const spinAgain = () => setSpin((n) => n + 1);

  const openSupport = () => {
    if (!userState.value) {
      loginOpenedState.value = true;
      return;
    }
    liveSupportExpandedState.value = true;
  };

  const tiles = [
    { href: routes.casino(), Icon: Dices, title: t("tile_casino"), sub: t("tile_casino_sub") },
    { href: routes.liveCasino(), Icon: Tv, title: t("tile_live"), sub: t("tile_live_sub") },
    { href: routes.promotions(), Icon: Gift, title: t("tile_promos"), sub: t("tile_promos_sub") },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden />

      <div className={styles.stage}>
        <div className={styles.machine} role="img" aria-label={t("reels_label")}>
          <div className={styles.marquee}>
            <div className={styles.bulbs} aria-hidden>
              {Array.from({ length: BULBS }, (_, i) => (
                <span key={i} style={{ animationDelay: `${(i % 2) * 0.45}s` }} />
              ))}
            </div>
            <span className={styles.marqueeText}>{t("marquee")}</span>
          </div>

          <div className={styles.window}>
            {REELS.map((reel, r) => (
              <div key={r} className={styles.reel}>
                <div
                  key={`${r}-${spin}`}
                  className={styles.strip}
                  style={{ animationDuration: `${1.3 + r * 0.45}s` }}
                >
                  {reelSymbols(r, reel.length).map(({ Icon, color }, i) => (
                    <span key={i} className={styles.cell}>
                      <Icon size={40} strokeWidth={2.2} color={color} />
                    </span>
                  ))}
                  <span
                    className={`${styles.cell} ${styles.digit}`}
                    style={{ animationDelay: `${1.3 + r * 0.45}s` }}
                  >
                    {reel.digit}
                  </span>
                </div>
              </div>
            ))}
            <span className={styles.payline} aria-hidden />
          </div>

          <div className={styles.tray}>
            <span className={styles.trayLabel}>{t("no_win")}</span>
          </div>

          <button
            type="button"
            key={`lever-${spin}`}
            className={`${styles.lever} ${spin > 0 ? styles.leverPulled : ""}`}
            onClick={spinAgain}
            aria-label={t("spin_again")}
            title={t("spin_again")}
          >
            <span className={styles.leverKnob} />
            <span className={styles.leverArm} />
          </button>
        </div>

        <div className={styles.copy}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.text}>{t("description")}</p>
          {path ? (
            <p className={styles.path}>
              <span>{t("requested")}</span>
              <code dir="ltr">{path}</code>
            </p>
          ) : null}

          <div className={styles.actions}>
            <Link href={routes.home()} scrollToTop className={styles.primary}>
              <House size={18} strokeWidth={2.4} />
              {t("home")}
            </Link>
            <button type="button" onClick={spinAgain} className={styles.secondary}>
              <RotateCcw size={17} strokeWidth={2.4} />
              {t("spin_again")}
            </button>
          </div>
        </div>
      </div>

      <section className={styles.elsewhere} aria-labelledby="not-found-elsewhere">
        <h2 id="not-found-elsewhere" className={styles.elsewhereTitle}>
          {t("elsewhere")}
        </h2>
        <div className={styles.tiles}>
          {tiles.map(({ href, Icon, title, sub }) => (
            <Link key={href} href={href} scrollToTop className={styles.tile}>
              <span className={styles.tileIcon}>
                <Icon size={20} strokeWidth={2.2} />
              </span>
              <span className={styles.tileText}>
                <strong>{title}</strong>
                <small>{sub}</small>
              </span>
            </Link>
          ))}
          <button type="button" className={styles.tile} onClick={() => openSearch()}>
            <span className={styles.tileIcon}>
              <Search size={20} strokeWidth={2.2} />
            </span>
            <span className={styles.tileText}>
              <strong>{t("tile_search")}</strong>
              <small>{t("tile_search_sub")}</small>
            </span>
          </button>
          <button type="button" className={styles.tile} onClick={openSupport}>
            <span className={styles.tileIcon}>
              <Headset size={20} strokeWidth={2.2} />
            </span>
            <span className={styles.tileText}>
              <strong>{t("tile_support")}</strong>
              <small>{t("tile_support_sub")}</small>
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
