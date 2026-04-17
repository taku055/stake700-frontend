"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./LiveSupport.module.scss";
import { motion, AnimatePresence } from "framer-motion";
// import { useRecoilState } from "recoil";
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
import { FaMessage, FaChevronDown } from "react-icons/fa6";
import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";

export default function LiveSupport() {

  const isMobile = useMediaQuery(mobileMediaQuery);
  const messagesEndRef = useRef(null);
  const divRef = useRef<HTMLDivElement>(null);
  const liveSupportMessages = liveSupportMessagesState.value;
  const liveSupportExpanded = liveSupportExpandedState.value;
  const smUnseenCount = liveSupportMessagesUnseenState.value;
  const setLiveSupportMessages = (messages: tLiveSupportMessage[]) => {
    liveSupportMessagesState.value = messages;
  };

  const loggedUser = userState.value;

  useEffect(() => {
    (async () => {
      try {
        if (loggedUser) {
          const res = await apiGetSupportMessages(0, loggedUser.id);
          setLiveSupportMessages(res);
          const unseenMessagesCount = res.filter(
            (m) => m.id > loggedUser.smUserCursor
          ).length;
          liveSupportMessagesUnseenState.value = unseenMessagesCount;
        } else {
          setLiveSupportMessages([]);
          liveSupportMessagesUnseenState.value = 0;
        }
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, [loggedUser]);

  useEffect(() => {
    if (!divRef.current) return;
    divRef.current.scrollTo(
      0,
      divRef.current.scrollHeight - divRef.current.offsetHeight
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
  }, [liveSupportExpanded, liveSupportMessagesUnseenState, liveSupportMessages, loggedUser]);

  useEffect(() => {
    resetUnseenCount();
  }, [liveSupportExpanded, resetUnseenCount]);

  return (
    <AnimatePresence>
      {liveSupportExpanded ? (
        <motion.section
          className={styles.container}
          // initial={{ opacity: 0, y: 50 }}
          // animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: 50 }}
          // transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between w-full border-b border-[var(--background-tertiary)] text-[#0F212E] px-4 py-3">
            <div className="flex items-center gap-2">
              <img src="/images/icons/icons/online-led.svg" alt="Live Support" className="w-5 h-5" />
              <h2 className="text-[15px] font-semibold">Chat with us</h2>
            </div>
            <button onClick={() => liveSupportExpandedState.value = false}>
              <MdClose size={20} />
            </button>
          </div>

          <div
            className="flex-1 overflow-auto bg-white p-3 flex flex-col gap-3"
            ref={divRef}
          >
            {liveSupportMessages.map((e) => (
              <LiveSupportMessage key={e.id} data={e} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatMessageInput />

          {!isMobile && (
            <motion.button
              className={styles.expandButton}
              onClick={() => liveSupportExpandedState.value = false}
              // initial={{ scale: 0 }}
              // animate={{
              //   scale: [1, 1.1, 1],
              //   transition: {
              //     duration: 1.5,
              //     repeat: Infinity,
              //     repeatType: "loop",
              //   },
              // }}
              // exit={{ scale: 0 }}
            >
              {smUnseenCount > 0 && (
                <div className={styles.badge}>{smUnseenCount}</div>
              )}
              <img src="/images/icons/icons/live-support.svg" alt="Chevron Down" className="w-5 h-5" />
            </motion.button>
          )}
        </motion.section>
      ) : (
        !isMobile && (
        <motion.button
          className={styles.expandButton}
          onClick={() => liveSupportExpandedState.value = true}
          // initial={{ scale: 0 }}
          // animate={{
          //   scale: [1, 1.1, 1],
          //   transition: { duration: 1.5, repeat: Infinity, repeatType: "loop" },
          // }} 
          // exit={{ scale: 0 }}
        >
          {smUnseenCount > 0 && (
            <div className={styles.badge}>{smUnseenCount}</div>
          )}
          <img src="/images/icons/icons/live-support.svg" alt="Chevron Down" className="w-5 h-5" />
        </motion.button>
        )
      )}
    </AnimatePresence>
  );
}
