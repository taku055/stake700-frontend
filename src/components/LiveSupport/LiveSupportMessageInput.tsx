"use client";

import React, { useCallback, useRef, useEffect } from "react";
import { MdSend } from "react-icons/md";
import { userState } from "@/state/userState";
import { apiSendSupportMessage } from "@/api/live_support/apiSendSupportMessage";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";

const LiveSupportMessageInput: React.FC = () => {
  const user = userState.value;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const input = document.getElementById("live-support-message-input");
    if (input) input.focus();
  }, []);

  const sendMessage = useCallback(async () => {
    if (!divRef.current || !user?.id) return;

    const tempId = -new Date().getTime();
    const message = divRef.current.innerText.replace(/\u00a0/g, " ").trim();
    if (!message) return;

    const optimistic: tLiveSupportMessage = {
      id: tempId,
      userId: user.id,
      message,
      filepaths: [],
      filenames: [],
      replyId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      isDeleted: false,
      deliveryStatus: "PENDING",
      User: user,
      status: 1,
    };

    liveSupportMessagesState.value = [
      ...liveSupportMessagesState.value,
      optimistic,
    ];
    divRef.current.innerText = "";

    try {
      const saved = await apiSendSupportMessage({
        message,
        filepaths: [],
        filenames: [],
        tempId,
      });
      liveSupportMessagesState.value = liveSupportMessagesState.value.map(
        (msg) =>
          msg.id === tempId
            ? {
                ...saved,
                status: saved.deliveryStatus === "FAILED" ? 2 : 0,
              }
            : msg,
      );
    } catch (ex) {
      console.error(ex);
      liveSupportMessagesState.value = liveSupportMessagesState.value.map(
        (msg) =>
          msg.id === tempId
            ? { ...msg, status: 2, deliveryStatus: "FAILED" }
            : msg,
      );
    }
  }, [user?.id]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-[9px] w-full">
        <div
          id="live-support-message-input"
          tabIndex={0}
          ref={divRef}
          onKeyDown={handleKeyDown}
          contentEditable={!!user?.id}
          className="ml-2 my-2 w-[calc(100%-54px)] border border-[var(--background-secondary)] rounded-[9px] text-black text-[16px] leading-[27px] px-[15px] py-[9px] outline-[0px] min-h-[45px] max-h-[200px] overflow-auto"
        />
        <MdSend
          className="w-10 h-auto mr-2 text-[var(--green-color)] cursor-pointer"
          onClick={sendMessage}
        />
      </div>
    </div>
  );
};

export default LiveSupportMessageInput;
