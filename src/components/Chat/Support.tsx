import { useEffect, useRef, useState } from "preact/hooks";
import { ChatIcon } from "./ChatIcon";
import styles from "./Chat.module.scss";
import { chatExpandedState } from "@/state/chatExpandedState";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { MdClose } from "react-icons/md";
import SupportMessage from "./SupportMessage";
import { tSupportMessage } from "@/types/tSupportMessages";
import SupportMessageInput from "./SupportMessageInput";
import { GetSupportMessageDto, apiGetSupportMessage } from "@/api/chat/apiGetSupportMessage";
import { apiStartNewSupport } from "@/api/chat/apiStartNewSupport";
import { localeState } from "@/state/localeState";
import { useTranslations } from "@/context/I18nContext";

// Simple ID generator
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function Support() {
  const t = useTranslations("LiveSupportAI");
  const chatExpanded = chatExpandedState.value;
  const [chatMessages, setChatMessages] = useState<tSupportMessage[]>([]);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    if (!sessionId && chatExpanded) {
      startNewSupport();
    }
  }, [sessionId, chatExpanded]);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    divRef.current.scrollTo(
      0,
      divRef.current?.scrollHeight - divRef.current?.offsetHeight
    );
  }, [chatMessages.length]);

  const startNewSupport = async () => {
    try {
      const res = await apiStartNewSupport({ language: localeState.value });
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          id: generateId(),
          type: "AI",
          message: res.message,
          createdAt: new Date(),
        } as tSupportMessage,
      ]);

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          id: generateId(),
          type: "TOPIC",
          message: res.topic,
          createdAt: new Date(),
        } as tSupportMessage,
      ]);

      setSessionId(res.session_id);
    } catch (error) {
      console.error("Failed to start support:", error);
    }
  };

  const sendMessage = async (msg: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        id: generateId(),
        type: "USER",
        message: msg,
        createdAt: new Date(),
      } as tSupportMessage,
    ]);

    try {
      const dto: GetSupportMessageDto = {
        prompt: msg,
        session_id: sessionId,
      };
      const res = await apiGetSupportMessage(dto);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          id: generateId(),
          type: "AI",
          message: res.ai,
          createdAt: new Date(),
        } as tSupportMessage,
      ]);

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          id: generateId(),
          type: "TOPIC",
          message: res.topic,
          createdAt: new Date(),
        } as tSupportMessage,
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const onTopicClick = (topic: string) => {
    sendMessage(`Please explain about ${topic}.`);
  };

  if (chatExpanded) {
    return (
      <section
        className={`${styles.container}`}
        style={{
          width: isMobile ? "calc(100vw - 40px)" : "600px",
          maxHeight: isMobile ? "calc(100vh - 40px)" : "80vh",
        }}
      >
        <div className="flex p-[14px] items-center bg-[#161616] flex-row justify-between rounded-t-[12px]">
          <h2 className="text-[#fff] font-semibold text-[16px] leading-[24px]">
            {t("Live Support AI")}
          </h2>

          <button
            className="flex items-center text-[#BFC0C3] hover:text-white transition-colors"
            type="button"
            onClick={() => (chatExpandedState.value = false)}
          >
            <span className="text-[#BFC0C3] font-semibold text-[12px] leading-[27px] mr-[6px]">
              {t("Close Chat")}
            </span>
            <MdClose size={20} />
          </button>
        </div>
        <div
          className="bg-[#212121] flex-1 flex flex-col overflow-auto gap-[10px] p-[14px]"
          ref={divRef}
        >
          {chatMessages.map((e) => (
            <SupportMessage key={e.id} data={e as tSupportMessage} onTopicClick={onTopicClick} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-[#161616] p-[14px] flex flex-col gap-[14px] rounded-b-[12px]">
          <SupportMessageInput onSendMessage={sendMessage} />
        </div>
      </section>
    );
  }

  return (
    <button
      className={styles.expandButton}
      onClick={() => (chatExpandedState.value = true)}
      aria-label="Open live support chat"
    >
      <ChatIcon />
    </button>
  );
}

