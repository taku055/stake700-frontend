"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./LiveSupport.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { MdClose } from "react-icons/md";
import ChatMessageInput from "./LiveSupportMessageInput";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import LiveSupportMessage from "./LiveSupportMessage";
import { userState } from "@/state/userState";
import { apiGetSupportMessages } from "@/api/live_support/apiGetSupportMessages";
import { liveSupportMessagesUnseenState } from "@/state/liveSupportMessagesUnseenState";
import { apiSetSmUserCursor } from "@/api/live_support/apiSetSmUserCursor";
import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import useSocketEvent from "@/hooks/useSocketEvent";
import { loginOpenedState } from "@/state/loginOpenedState";

type SupportSocketPayload = {
  tempId: number;
  supportMessage: tLiveSupportMessage;
};

type FabPosition = { x: number; y: number };

const FAB_SIZE = 56;
const FAB_MARGIN = 12;
const MOBILE_FOOTER_OFFSET = 70;
const DESKTOP_BOTTOM_OFFSET = 14;
const FAB_POSITION_KEY = "liveSupportFabPosition";
const DRAG_THRESHOLD_PX = 6;

function getDefaultFabPosition(isMobile: boolean): FabPosition {
  const bottomOffset = isMobile ? MOBILE_FOOTER_OFFSET : DESKTOP_BOTTOM_OFFSET;
  const rightOffset = isMobile ? FAB_MARGIN : 20;
  return {
    x: Math.max(FAB_MARGIN, window.innerWidth - FAB_SIZE - rightOffset),
    y: Math.max(FAB_MARGIN, window.innerHeight - FAB_SIZE - bottomOffset),
  };
}

function clampFabPosition(pos: FabPosition, isMobile: boolean): FabPosition {
  const maxX = Math.max(FAB_MARGIN, window.innerWidth - FAB_SIZE - FAB_MARGIN);
  const minY = FAB_MARGIN;
  const maxY = Math.max(
    FAB_MARGIN,
    window.innerHeight -
      FAB_SIZE -
      (isMobile ? MOBILE_FOOTER_OFFSET : FAB_MARGIN),
  );
  return {
    x: Math.min(maxX, Math.max(FAB_MARGIN, pos.x)),
    y: Math.min(maxY, Math.max(minY, pos.y)),
  };
}

function loadFabPosition(isMobile: boolean): FabPosition {
  try {
    const raw = localStorage.getItem(FAB_POSITION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FabPosition;
      if (
        typeof parsed?.x === "number" &&
        typeof parsed?.y === "number" &&
        Number.isFinite(parsed.x) &&
        Number.isFinite(parsed.y)
      ) {
        return clampFabPosition(parsed, isMobile);
      }
    }
  } catch {
    // ignore corrupt storage
  }
  return getDefaultFabPosition(isMobile);
}

function upsertMessage(
  list: tLiveSupportMessage[],
  incoming: tLiveSupportMessage,
  tempId?: number,
): tLiveSupportMessage[] {
  const withoutTemp =
    tempId && tempId < 0 ? list.filter((m) => m.id !== tempId) : list;
  if (withoutTemp.some((m) => m.id === incoming.id)) {
    return withoutTemp.map((m) =>
      m.id === incoming.id
        ? {
            ...m,
            ...incoming,
            status: incoming.deliveryStatus === "FAILED" ? 2 : 0,
          }
        : m,
    );
  }
  return [
    ...withoutTemp,
    { ...incoming, status: incoming.deliveryStatus === "FAILED" ? 2 : 0 },
  ];
}

export default function LiveSupport() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const messagesEndRef = useRef(null);
  const divRef = useRef<HTMLDivElement>(null);
  const liveSupportMessages = liveSupportMessagesState.value;
  const liveSupportExpanded = liveSupportExpandedState.value;
  const smUnseenCount = liveSupportMessagesUnseenState.value;
  const loggedUser = userState.value;
  const [closed, setClosed] = useState(false);
  const [fabPos, setFabPos] = useState<FabPosition | null>(null);
  const [isDraggingFab, setIsDraggingFab] = useState(false);
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    setFabPos(loadFabPosition(isMobile));
  }, [isMobile]);

  useEffect(() => {
    const onResize = () => {
      setFabPos((prev) =>
        prev
          ? clampFabPosition(prev, isMobile)
          : loadFabPosition(isMobile),
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile]);

  useEffect(() => {
    (async () => {
      try {
        if (loggedUser) {
          const res = await apiGetSupportMessages(0, loggedUser.id);
          liveSupportMessagesState.value = res.map((m) => ({
            ...m,
            status: m.deliveryStatus === "FAILED" ? 2 : 0,
          }));
          const unseenMessagesCount = res.filter(
            (m) => m.id > loggedUser.smUserCursor,
          ).length;
          liveSupportMessagesUnseenState.value = unseenMessagesCount;
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
    if (!divRef.current) return;
    divRef.current.scrollTo(
      0,
      divRef.current.scrollHeight - divRef.current.offsetHeight,
    );
  }, [liveSupportMessages.length, liveSupportExpanded]);

  const resetUnseenCount = useCallback(() => {
    (async () => {
      if (liveSupportExpanded && loggedUser) {
        try {
          const lastSmId = liveSupportMessages.length - 1;
          const res = await apiSetSmUserCursor({
            userId: loggedUser?.id,
            cursor: liveSupportMessages[lastSmId]?.id,
          });
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

  useSocketEvent(
    "received.support",
    (payload: SupportSocketPayload) => {
      const msg = payload?.supportMessage;
      if (!msg || !loggedUser) return;
      if (msg.userId !== loggedUser.id) return;

      liveSupportMessagesState.value = upsertMessage(
        liveSupportMessagesState.value,
        msg,
        payload.tempId,
      );

      if (!liveSupportExpandedState.value) {
        liveSupportMessagesUnseenState.value =
          liveSupportMessagesUnseenState.value + 1;
      }
      // Any new activity reopens the local "closed" banner (new/recreated topic).
      setClosed(false);
    },
  );

  useSocketEvent(
    "support.conversation.closed",
    (payload: {
      userId: string;
      messagesCleared?: boolean;
      deletedMessages?: number;
    }) => {
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

  const handleFabAction = () => {
    if (liveSupportExpanded) {
      liveSupportExpandedState.value = false;
    } else {
      openChat();
    }
  };

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
    if (
      !drag.moved &&
      (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX)
    ) {
      drag.moved = true;
      setIsDraggingFab(true);
    }
    if (!drag.moved) return;

    setFabPos(
      clampFabPosition(
        { x: drag.originX + dx, y: drag.originY + dy },
        isMobile,
      ),
    );
  };

  const endFabPointer = (
    e: React.PointerEvent<HTMLButtonElement>,
    { commitClick }: { commitClick: boolean },
  ) => {
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
        const next = clampFabPosition(prev, isMobile);
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

  const fabStyle =
    fabPos != null
      ? {
          left: fabPos.x,
          top: fabPos.y,
          right: "auto" as const,
          bottom: "auto" as const,
        }
      : undefined;

  const fabButton = (
    <motion.button
      type="button"
      className={`${styles.expandButton}${isDraggingFab ? ` ${styles.expandButtonDragging}` : ""}`}
      style={fabStyle}
      aria-label={liveSupportExpanded ? "Close live support" : "Open live support"}
      onPointerDown={onFabPointerDown}
      onPointerMove={onFabPointerMove}
      onPointerUp={(e) => endFabPointer(e, { commitClick: true })}
      onPointerCancel={(e) => endFabPointer(e, { commitClick: false })}
      whileHover={isDraggingFab ? undefined : { scale: 1.05 }}
      whileTap={isDraggingFab ? undefined : { scale: 0.97 }}
    >
      {smUnseenCount > 0 && (
        <div className={styles.badge}>{smUnseenCount}</div>
      )}
      <img src="/images/icons/icons/live-support.svg" alt="Live Support" />
    </motion.button>
  );

  return (
    <>
      <AnimatePresence>
        {liveSupportExpanded ? (
          <motion.section
            key="live-support-panel"
            className={styles.container}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <div className={styles.header}>
              <div className={styles.headerMeta}>
                <img
                  src="/images/support-avatar.svg"
                  alt="Support"
                  className={styles.headerAvatar}
                />
                <div>
                  <div className={styles.headerTitle}>Mirage888 Support</div>
                  <div className={styles.headerSub}>
                    <span className={styles.onlineDot} />
                    online
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="Close chat"
                onClick={() => (liveSupportExpandedState.value = false)}
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className={styles.messages} ref={divRef}>
              {liveSupportMessages.length === 0 ? (
                <div className={styles.emptyState}>
                  <img src="/images/support-avatar.svg" alt="" />
                  <h3>How can we help?</h3>
                  <p>
                    Send a message, photo, voice note, or screen recording. Paste
                    (Ctrl/Cmd+V) or drag files here too.
                  </p>
                </div>
              ) : (
                liveSupportMessages.map((e) => (
                  <LiveSupportMessage key={e.id} data={e} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {closed ? (
              <div className={styles.closedBanner}>
                Ticket was closed by support. Sending a message will reopen it.
              </div>
            ) : null}
            <ChatMessageInput />
          </motion.section>
        ) : null}
      </AnimatePresence>
      {(!liveSupportExpanded || !isMobile) && fabButton}
    </>
  );
}
