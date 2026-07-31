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
import styles from "./LiveSupport.module.scss";

interface ILiveSupportMessage {
  data: tLiveSupportMessage;
}

const SUPPORT_AVATAR = "/images/support-avatar.svg";
const USER_FALLBACK = "/images/default-avatar.png";

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
  const sending = data.status === 1 || data.deliveryStatus === "PENDING";

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

  const avatarSrc = isFromUser
    ? data.User?.avatar || USER_FALLBACK
    : SUPPORT_AVATAR;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`${styles.messageRow} ${isFromUser ? styles.fromUser : ""}`}
    >
      <img
        className={styles.avatar}
        src={avatarSrc}
        alt=""
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src.endsWith(USER_FALLBACK) || img.src.endsWith(SUPPORT_AVATAR)) {
            return;
          }
          img.src = isFromUser ? USER_FALLBACK : SUPPORT_AVATAR;
        }}
      />
      <div
        className={`${styles.bubble} ${isFromUser ? styles.user : styles.support}`}
      >
        {!isFromUser && (
          <div className={styles.agentName}>{supportLabel}</div>
        )}

        {files.length > 0 && (
          <div className={styles.mediaStack}>
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
                    <img src={f.url} alt={f.name} />
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
                  />
                );
              }
              if (kind === "audio") {
                return (
                  <audio key={`${f.url}-${f.name}`} src={f.url} controls />
                );
              }
              return (
                <a
                  key={`${f.url}-${f.name}`}
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.fileLink}
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

        <div className={styles.meta}>
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
              className={styles.retryBtn}
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
