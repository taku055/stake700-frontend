"use client";

import React, { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Gift,
  Headset,
  Lock,
  MessageCircleQuestion,
  Paperclip,
  ShieldCheck,
  Upload,
  Wallet,
  type LucideProps,
} from "lucide-react";
import styles from "./LiveSupport.module.scss";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { mobileMediaQuery } from "@/config/constants";
import ChatMessageInput, {
  MAX_SUPPORT_FILES,
  filesFromTransfer,
  type LiveSupportComposerHandle,
} from "./LiveSupportMessageInput";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import LiveSupportMessage from "./LiveSupportMessage";
import { userState } from "@/state/userState";
import { apiGetSupportMessages } from "@/api/live_support/apiGetSupportMessages";
import { liveSupportMessagesUnseenState } from "@/state/liveSupportMessagesUnseenState";
import { apiSetSmUserCursor } from "@/api/live_support/apiSetSmUserCursor";
import { isSupportMessageFromCustomer, tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import useSocketEvent from "@/hooks/useSocketEvent";
import { loginOpenedState } from "@/state/loginOpenedState";
import { localeState } from "@/state/localeState";
import { useTranslations } from "@/context/I18nContext";
import { useLocation } from "@/router";

type SupportSocketPayload = {
  tempId: number;
  supportMessage: tLiveSupportMessage;
};

type FabPosition = { x: number; y: number };
type FabSize = { w: number; h: number };

const FAB_MARGIN = 12;
const MOBILE_FOOTER_OFFSET = 70;
const DESKTOP_BOTTOM_OFFSET = 18;
const FAB_POSITION_KEY = "liveSupportFabPosition";
const DRAG_THRESHOLD_PX = 6;
/** Messages from the same sender closer than this are drawn as one group. */
const GROUP_GAP_MS = 5 * 60 * 1000;

const TOPICS: { key: string; Icon: ComponentType<LucideProps> }[] = [
  { key: "deposit", Icon: Wallet },
  { key: "withdraw", Icon: Banknote },
  { key: "bonus", Icon: Gift },
  { key: "account", Icon: ShieldCheck },
  { key: "game", Icon: Gamepad2 },
  { key: "other", Icon: MessageCircleQuestion },
];

function getDefaultFabPosition(isMobile: boolean, size: FabSize): FabPosition {
  const bottomOffset = isMobile ? MOBILE_FOOTER_OFFSET : DESKTOP_BOTTOM_OFFSET;
  const rightOffset = isMobile ? FAB_MARGIN : 20;
  return {
    x: Math.max(FAB_MARGIN, window.innerWidth - size.w - rightOffset),
    y: Math.max(FAB_MARGIN, window.innerHeight - size.h - bottomOffset),
  };
}

function clampFabPosition(pos: FabPosition, isMobile: boolean, size: FabSize): FabPosition {
  const maxX = Math.max(FAB_MARGIN, window.innerWidth - size.w - FAB_MARGIN);
  const maxY = Math.max(
    FAB_MARGIN,
    window.innerHeight - size.h - (isMobile ? MOBILE_FOOTER_OFFSET : FAB_MARGIN),
  );
  return {
    x: Math.min(maxX, Math.max(FAB_MARGIN, pos.x)),
    y: Math.min(maxY, Math.max(FAB_MARGIN, pos.y)),
  };
}

function loadFabPosition(isMobile: boolean, size: FabSize): FabPosition {
  try {
    const raw = localStorage.getItem(FAB_POSITION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FabPosition;
      if (Number.isFinite(parsed?.x) && Number.isFinite(parsed?.y)) {
        return clampFabPosition(parsed, isMobile, size);
      }
    }
  } catch {
    // ignore corrupt or blocked storage
  }
  return getDefaultFabPosition(isMobile, size);
}

function upsertMessage(
  list: tLiveSupportMessage[],
  incoming: tLiveSupportMessage,
  tempId?: number,
): tLiveSupportMessage[] {
  const withoutTemp = tempId && tempId < 0 ? list.filter((m) => m.id !== tempId) : list;
  const status = incoming.deliveryStatus === "FAILED" ? 2 : 0;
  if (withoutTemp.some((m) => m.id === incoming.id)) {
    return withoutTemp.map((m) => (m.id === incoming.id ? { ...m, ...incoming, status } : m));
  }
  return [...withoutTemp, { ...incoming, status }];
}

function sameGroup(a: tLiveSupportMessage, b: tLiveSupportMessage) {
  const aUser = isSupportMessageFromCustomer(a);
  if (aUser !== isSupportMessageFromCustomer(b)) return false;
  if (!aUser && (a.senderName || "") !== (b.senderName || "")) return false;
  const ta = moment(a.createdAt);
  const tb = moment(b.createdAt);
  return ta.isSame(tb, "day") && Math.abs(tb.diff(ta)) < GROUP_GAP_MS;
}

export default function LiveSupport() {
  const t = useTranslations("LiveSupport");
  const isMobile = useMediaQuery(mobileMediaQuery);
  const location = useLocation();
  const isGamePage = /^\/game(?:\/|$)/.test(location.path);
  const divRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const composerRef = useRef<LiveSupportComposerHandle>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const liveSupportMessages = liveSupportMessagesState.value;
  const liveSupportExpanded = liveSupportExpandedState.value;
  const smUnseenCount = liveSupportMessagesUnseenState.value;
  const loggedUser = userState.value;
  const [closed, setClosed] = useState(false);
  const [dropping, setDropping] = useState(false);
  const dragDepth = useRef(0);
  const [fabPos, setFabPos] = useState<FabPosition | null>(null);
  const [isDraggingFab, setIsDraggingFab] = useState(false);
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  const fabSize = useCallback((): FabSize => {
    const el = launcherRef.current;
    return { w: el?.offsetWidth || 56, h: el?.offsetHeight || 56 };
  }, []);

  useEffect(() => {
    if (isGamePage && liveSupportExpandedState.value) {
      liveSupportExpandedState.value = false;
    }
  }, [isGamePage]);

  useEffect(() => {
    setFabPos(loadFabPosition(isMobile, fabSize()));
  }, [isMobile, fabSize]);

  useEffect(() => {
    const onResize = () => {
      setFabPos((prev) =>
        prev ? clampFabPosition(prev, isMobile, fabSize()) : loadFabPosition(isMobile, fabSize()),
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile, fabSize]);

  useEffect(() => {
    (async () => {
      try {
        if (loggedUser) {
          const res = await apiGetSupportMessages(0, loggedUser.id);
          liveSupportMessagesState.value = res.map((m) => ({
            ...m,
            status: m.deliveryStatus === "FAILED" ? 2 : 0,
          }));
          liveSupportMessagesUnseenState.value = res.filter((m) => m.id > loggedUser.smUserCursor).length;
        } else {
          liveSupportMessagesState.value = [];
          liveSupportMessagesUnseenState.value = 0;
        }
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, [loggedUser?.id]);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;
    // Latest message at the bottom; the welcome screen (no messages yet) starts at its greeting.
    el.scrollTo({ top: liveSupportMessages.length || closed ? el.scrollHeight : 0 });
    stickToBottom.current = true;
  }, [liveSupportMessages.length, liveSupportExpanded, closed]);

  // Photos and videos load after the first scroll and push the newest messages down;
  // keep the view pinned to the bottom unless the player scrolled up to read.
  useEffect(() => {
    const el = divRef.current;
    if (!el || !liveSupportExpanded) return;
    const onScroll = () => {
      stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };
    const onMediaLoad = () => {
      if (stickToBottom.current && liveSupportMessagesState.value.length) {
        el.scrollTo({ top: el.scrollHeight });
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("load", onMediaLoad, true);
    el.addEventListener("loadedmetadata", onMediaLoad, true);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("load", onMediaLoad, true);
      el.removeEventListener("loadedmetadata", onMediaLoad, true);
    };
  }, [liveSupportExpanded]);

  const resetUnseenCount = useCallback(() => {
    (async () => {
      if (liveSupportExpanded && loggedUser) {
        try {
          const last = liveSupportMessages[liveSupportMessages.length - 1];
          const res = await apiSetSmUserCursor({ userId: loggedUser.id, cursor: last?.id });
          if (res) liveSupportMessagesUnseenState.value = 0;
        } catch (ex) {
          console.log(ex);
        }
      }
    })();
  }, [liveSupportExpanded, liveSupportMessages, loggedUser]);

  useEffect(() => {
    resetUnseenCount();
  }, [liveSupportExpanded, resetUnseenCount]);

  useSocketEvent("received.support", (payload: SupportSocketPayload) => {
    const msg = payload?.supportMessage;
    if (!msg || !loggedUser) return;
    if (msg.userId !== loggedUser.id) return;

    liveSupportMessagesState.value = upsertMessage(liveSupportMessagesState.value, msg, payload.tempId);

    if (!liveSupportExpandedState.value) {
      liveSupportMessagesUnseenState.value = liveSupportMessagesUnseenState.value + 1;
    }
    // Any new activity means the conversation is open again.
    setClosed(false);
  });

  useSocketEvent(
    "support.conversation.closed",
    (payload: { userId: string; messagesCleared?: boolean; deletedMessages?: number }) => {
      if (payload?.userId !== loggedUser?.id) return;
      setClosed(true);
      if (payload.messagesCleared) {
        liveSupportMessagesState.value = [];
        liveSupportMessagesUnseenState.value = 0;
      }
    },
  );

  const openChat = () => {
    if (!loggedUser) {
      loginOpenedState.value = true;
      return;
    }
    liveSupportExpandedState.value = true;
  };

  const minimize = () => {
    liveSupportExpandedState.value = false;
  };

  const handleFabAction = () => {
    if (liveSupportExpanded) minimize();
    else openChat();
  };

  /* —— Launcher dragging —— */
  const onFabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!fabPos) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      originX: fabPos.x,
      originY: fabPos.y,
    };
    setIsDraggingFab(false);
  };

  const onFabPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX)) {
      drag.moved = true;
      setIsDraggingFab(true);
    }
    if (!drag.moved) return;
    setFabPos(clampFabPosition({ x: drag.originX + dx, y: drag.originY + dy }, isMobile, fabSize()));
  };

  const endFabPointer = (e: React.PointerEvent<HTMLButtonElement>, { commitClick }: { commitClick: boolean }) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // already released
    }

    if (drag.moved) {
      setFabPos((prev) => {
        if (!prev) return prev;
        const next = clampFabPosition(prev, isMobile, fabSize());
        try {
          localStorage.setItem(FAB_POSITION_KEY, JSON.stringify(next));
        } catch {
          // ignore quota / private mode
        }
        return next;
      });
      setIsDraggingFab(false);
      return;
    }

    setIsDraggingFab(false);
    if (commitClick) handleFabAction();
  };

  /* —— Dropping files anywhere on the panel —— */
  const hasFiles = (e: React.DragEvent) => Boolean(e.dataTransfer?.types?.includes("Files"));

  const onPanelDragEnter = (e: React.DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth.current += 1;
    setDropping(true);
  };
  const onPanelDragOver = (e: React.DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const onPanelDragLeave = (e: React.DragEvent) => {
    if (!hasFiles(e)) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDropping(false);
  };
  const onPanelDrop = (e: React.DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth.current = 0;
    setDropping(false);
    const files = filesFromTransfer(e.dataTransfer);
    if (files.length) composerRef.current?.addFiles(files);
  };

  const dayLabel = (date: Date) => {
    const day = moment(date);
    if (day.isSame(moment(), "day")) return t("today");
    if (day.isSame(moment().subtract(1, "day"), "day")) return t("yesterday");
    try {
      return new Intl.DateTimeFormat(localeState.value, {
        day: "numeric",
        month: "long",
        ...(day.isSame(moment(), "year") ? {} : { year: "numeric" }),
      }).format(day.toDate());
    } catch {
      return day.format("D MMM YYYY");
    }
  };

  const firstName = loggedUser?.userName?.trim();

  const conversation: React.ReactNode[] = [];
  liveSupportMessages.forEach((m, i) => {
    const prev = liveSupportMessages[i - 1];
    const next = liveSupportMessages[i + 1];
    if (!prev || !moment(prev.createdAt).isSame(m.createdAt, "day")) {
      conversation.push(
        <div key={`day-${m.id}`} className={styles.daySeparator}>
          <span>{dayLabel(m.createdAt)}</span>
        </div>,
      );
    }
    conversation.push(
      <LiveSupportMessage
        key={m.id}
        data={m}
        groupStart={!prev || !sameGroup(prev, m)}
        groupEnd={!next || !sameGroup(m, next)}
      />,
    );
  });

  const fabStyle =
    fabPos != null
      ? { left: fabPos.x, top: fabPos.y, right: "auto" as const, bottom: "auto" as const }
      : undefined;

  const launcher = (
    <motion.button
      ref={launcherRef}
      type="button"
      className={[
        styles.launcher,
        liveSupportExpanded ? styles.launcherOpen : "",
        smUnseenCount > 0 && !liveSupportExpanded ? styles.launcherAlert : "",
        isDraggingFab ? styles.launcherDragging : "",
      ].join(" ")}
      style={fabStyle}
      aria-label={liveSupportExpanded ? t("close_label") : t("open_label")}
      aria-expanded={liveSupportExpanded}
      onPointerDown={onFabPointerDown}
      onPointerMove={onFabPointerMove}
      onPointerUp={(e) => endFabPointer(e, { commitClick: true })}
      onPointerCancel={(e) => endFabPointer(e, { commitClick: false })}
      whileTap={isDraggingFab ? undefined : { scale: 0.96 }}
    >
      <span className={styles.launcherIcon}>
        {liveSupportExpanded ? <ChevronDown size={20} strokeWidth={2.6} /> : <Headset size={20} strokeWidth={2.4} />}
      </span>
      <span className={styles.launcherLabel}>{t("launcher")}</span>
      {smUnseenCount > 0 && (
        <span className={styles.badge}>{smUnseenCount > 99 ? "99+" : smUnseenCount}</span>
      )}
    </motion.button>
  );

  return (
    <>
      <AnimatePresence>
        {liveSupportExpanded && !isGamePage ? (
          <motion.section
            key="live-support-panel"
            role="dialog"
            aria-labelledby="live-support-title"
            className={styles.panel}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onDragEnter={onPanelDragEnter}
            onDragOver={onPanelDragOver}
            onDragLeave={onPanelDragLeave}
            onDrop={onPanelDrop}
          >
            <header className={styles.header}>
              <span className={styles.brandAvatar}>
                <img src="/images/brand/icon.png" alt="" />
                <span className={styles.onlineDot} />
              </span>
              <div className={styles.headerText}>
                <h2 id="live-support-title" className={styles.headerTitle}>
                  {t("title")}
                </h2>
                <p className={styles.headerSub}>{t("status")}</p>
              </div>
              <button type="button" className={styles.iconBtn} aria-label={t("minimize")} title={t("minimize")} onClick={minimize}>
                <ChevronDown size={22} />
              </button>
            </header>

            <div className={styles.messages} ref={divRef}>
              {liveSupportMessages.length === 0 ? (
                <div className={styles.welcome}>
                  <p className={styles.welcomeHi}>
                    {firstName ? t("greeting", { name: firstName }) : t("greeting_anon")}
                  </p>
                  <h3 className={styles.welcomeTitle}>{t("welcome")}</h3>
                  <p className={styles.welcomeSub}>{t("welcome_sub")}</p>

                  <p className={styles.topicsLabel}>{t("topics_label")}</p>
                  <div className={styles.topics}>
                    {TOPICS.map(({ key, Icon }) => (
                      <button
                        key={key}
                        type="button"
                        className={styles.topic}
                        onClick={() => composerRef.current?.prefill(key === "other" ? "" : t(`topic_${key}_msg`))}
                      >
                        <span className={styles.topicIcon}>
                          <Icon size={17} strokeWidth={2.2} />
                        </span>
                        <span className={styles.topicText}>{t(`topic_${key}`)}</span>
                        <ChevronRight size={15} className={styles.topicArrow} />
                      </button>
                    ))}
                  </div>

                  <p className={styles.tip}>
                    <Paperclip size={14} />
                    {t("attach_tip")}
                  </p>
                </div>
              ) : (
                conversation
              )}

              {closed ? (
                <div className={styles.systemNote} role="status">
                  <Lock size={14} />
                  <span>{t("closed")}</span>
                </div>
              ) : null}
            </div>

            <ChatMessageInput ref={composerRef} />

            {dropping ? (
              <div className={styles.dropOverlay}>
                <span className={styles.dropIcon}>
                  <Upload size={24} />
                </span>
                <strong>{t("drop")}</strong>
                <small>{t("drop_sub", { max: String(MAX_SUPPORT_FILES) })}</small>
              </div>
            ) : null}
          </motion.section>
        ) : null}
      </AnimatePresence>
      {(!liveSupportExpanded || !isMobile) && !isGamePage && launcher}
    </>
  );
}
