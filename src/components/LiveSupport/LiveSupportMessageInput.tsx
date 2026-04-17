"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { MdSend } from "react-icons/md";
import { userState } from "@/state/userState";
import { apiSendSupportMessage } from "@/api/live_support/apiSendSupportMessage";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";

const LiveSupportMessageInput: React.FC = () => {
  const liveSupportMessages = liveSupportMessagesState.value;
  const setLiveSupportMessages = (messages: tLiveSupportMessage[]) => {
    liveSupportMessagesState.value = messages;
  };
  const user = userState.value;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const input = document.getElementById("live-support-message-input");
    if (input) {
      input.focus();
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (!divRef.current || !user?.id) return;

    const tempId = -new Date().getTime();
    const message = divRef.current.innerHTML
      .replace(/<(div|html|body|p)>|<\/(div|html|body|p)>/g, "")
      .replace(/<br>/g, "\n")
      .trim();

    if (!message) return;

    setLiveSupportMessages([
      ...liveSupportMessages,
      {
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
        User: user,
        status: 1,
      },
    ]);
    divRef.current.innerHTML = "";

    try {
      await apiSendSupportMessage({ message, filepaths: [], filenames: [], tempId });
    } catch (ex) {
      console.error(ex);
      setLiveSupportMessages(liveSupportMessages.map((msg) => (msg.id === tempId ? { ...msg, status: 2 } : msg)))
    }
  }, [divRef.current, user?.id, liveSupportMessages, setLiveSupportMessages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-[9px] w-full">
        {/* <Input
        type="text"
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border-[#ffffff11] border-1 rounded-[9px] text-[#FFFFFFA0] text-[16px] leading-[27px] outline-[0px] min-h-[45px] max-h-[200px] overflow-auto"
        autoFocus
      /> */}
        {/* <Button
        className="ml-2 bg-[#0046ff] hover:bg-[#0033cc] text-white rounded-md w-[25px] h-10 flex items-center justify-center"
        onClick={sendMessage}
        isDisabled={!user?.id}
      > */}
        <div
          id="live-support-message-input"
          tabIndex={0}
          ref={divRef}
          onKeyDown={handleKeyDown}
          contentEditable={!!user?.id}
          className="ml-2 my-2 w-[calc(100%-54px)]  border border-[var(--background-secondary)] rounded-[9px] text-black text-[16px] leading-[27px] px-[15px] py-[9px] outline-[0px] min-h-[45px] max-h-[200px] overflow-auto"

        />

        {/* </Button> */}
        <MdSend className="w-10 h-auto text-[var(--green-color)] mr-2 cursor-pointer" onClick={sendMessage} />
      </div>
    </div>
  );
};

export default LiveSupportMessageInput;
