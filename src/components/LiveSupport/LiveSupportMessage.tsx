"use client";

import React from "react";
import {
  isSupportMessageFromCustomer,
  tLiveSupportMessage,
} from "@/types/tLiveSupportMessage";
import moment from "moment";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import { apiRetrySupportMessage } from "@/api/live_support/apiRetrySupportMessage";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";

interface ILiveSupportMessage {
  data: tLiveSupportMessage;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const LiveSupportMessage: React.FC<ILiveSupportMessage> = ({ data }) => {
  const isFromUser = isSupportMessageFromCustomer(data);
  const failed = data.deliveryStatus === "FAILED" || data.status === 2;
  const sending =
    data.status === 1 || data.deliveryStatus === "PENDING";

  const onRetry = async () => {
    if (data.id <= 0) return;
    try {
      const updated = await apiRetrySupportMessage(data.id);
      liveSupportMessagesState.value = liveSupportMessagesState.value.map(
        (m) =>
          m.id === data.id
            ? { ...m, ...updated, status: updated.deliveryStatus === "FAILED" ? 2 : 0 }
            : m,
      );
    } catch (ex) {
      console.error(ex);
    }
  };

  const body = escapeHtml(data.message).replace(/\n/g, "<br/>");
  const supportLabel = data.senderName || "Support";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 items-end ${isFromUser ? "justify-end" : "justify-start"}`}
    >
      <img
        className="w-8 h-8 rounded-full"
        src={
          isFromUser
            ? data.User?.avatar || "/images/default-avatar.png"
            : "/images/avatar-talk.png"
        }
        alt=""
      />
      <div
        className={`max-w-[70%] p-3 text-sm rounded-lg whitespace-pre-line break-words ${
          isFromUser
            ? "bg-[#0F212E] text-white"
            : "bg-[#e6e7e7] text-gray-800"
        }`}
      >
        {!isFromUser && (
          <div className="text-[11px] font-semibold mb-1 opacity-70">
            {supportLabel}
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: body }} />
        <div
          className={`text-[12px] mt-1 flex items-center justify-end gap-2 ${
            isFromUser ? "text-gray-300" : "text-gray-500"
          }`}
        >
          <span>{moment(data.createdAt).format("hh:mm A")}</span>
          {sending && (
            <Spinner
              classNames={{ wrapper: "w-[12px] h-[12px]" }}
              variant="gradient"
              color="default"
            />
          )}
          {failed && isFromUser && (
            <button
              type="button"
              className="underline text-red-300"
              onClick={onRetry}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LiveSupportMessage;
