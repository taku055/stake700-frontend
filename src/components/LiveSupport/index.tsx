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
      if (msg.telegramSenderId || msg.supporterId) {
        setClosed(false);
      }
    },
  );

  useSocketEvent(
    "support.conversation.closed",
    (payload: { userId: string }) => {
      if (payload?.userId === loggedUser?.id) {
        setClosed(true);
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

  return (
    <AnimatePresence>
      {liveSupportExpanded ? (
        <motion.section
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

          {!isMobile && (
            <motion.button
              className={styles.expandButton}
              onClick={() => (liveSupportExpandedState.value = false)}
            >
              {smUnseenCount > 0 && (
                <div className={styles.badge}>{smUnseenCount}</div>
              )}
              <img
                src="/images/icons/icons/live-support.svg"
                alt="Live Support"
              />
            </motion.button>
          )}
        </motion.section>
      ) : (
        !isMobile && (
          <motion.button
            className={styles.expandButton}
            onClick={openChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {smUnseenCount > 0 && (
              <div className={styles.badge}>{smUnseenCount}</div>
            )}
            <img
              src="/images/icons/icons/live-support.svg"
              alt="Live Support"
            />
          </motion.button>
        )
      )}
    </AnimatePresence>
  );
}
