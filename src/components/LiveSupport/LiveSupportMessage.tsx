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

function mediaKind(
  filename: string,
  url: string,
): "image" | "video" | "audio" | "file" {
  const name = (filename || "").toLowerCase();
  const target = `${name} ${url}`.toLowerCase();

  // Voice recordings are often audio/webm — check before generic .webm → video.
  if (
    name.startsWith("voice") ||
    /\.(mp3|ogg|opus|wav|m4a|aac)(\?|$)/i.test(name)
  ) {
    return "audio";
  }
  if (/\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(target)) return "image";
  if (
    name.startsWith("screen") ||
    /\.(mp4|webm|mov|mkv|m4v)(\?|$)/i.test(name) ||
    /\.(mp4|webm|mov|mkv|m4v)(\?|$)/i.test(url)
  ) {
    return "video";
  }
  return "file";
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
            ? {
                ...m,
                ...updated,
                status: updated.deliveryStatus === "FAILED" ? 2 : 0,
              }
            : m,
      );
    } catch (ex) {
      console.error(ex);
    }
  };

  const rawText = data.message === "📎 Attachment" ? "" : data.message || "";
  const body = escapeHtml(rawText).replace(/\n/g, "<br/>");
  const supportLabel = data.senderName || "Support";
  const files = (data.filepaths || []).map((url, i) => ({
    url,
    name: data.filenames?.[i] || `file-${i + 1}`,
  }));

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

        {files.length > 0 && (
          <div className="flex flex-col gap-2 mb-2">
            {files.map((f) => {
              const kind = mediaKind(f.name, f.url);
              if (kind === "image") {
                return (
                  <a
                    key={`${f.url}-${f.name}`}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={f.url}
                      alt={f.name}
                      className="max-w-full max-h-48 rounded-md object-contain"
                    />
                  </a>
                );
              }
              if (kind === "video") {
                return (
                  <video
                    key={`${f.url}-${f.name}`}
                    src={f.url}
                    controls
                    playsInline
                    className="max-w-full max-h-56 rounded-md"
                  />
                );
              }
              if (kind === "audio") {
                return (
                  <audio
                    key={`${f.url}-${f.name}`}
                    src={f.url}
                    controls
                    className="w-full min-w-[180px]"
                  />
                );
              }
              return (
                <a
                  key={`${f.url}-${f.name}`}
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`underline text-xs break-all ${
                    isFromUser ? "text-blue-200" : "text-blue-700"
                  }`}
                >
                  {f.name}
                </a>
              );
            })}
          </div>
        )}

        {rawText ? (
          <div dangerouslySetInnerHTML={{ __html: body }} />
        ) : null}

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
