"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import moment from "moment";
import { motion } from "framer-motion";
import { AlertCircle, Check, FileText, RotateCw, X } from "lucide-react";
import {
  isSupportMessageFromCustomer,
  tLiveSupportMessage,
} from "@/types/tLiveSupportMessage";
import { apiRetrySupportMessage } from "@/api/live_support/apiRetrySupportMessage";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import { useTranslations } from "@/context/I18nContext";
import { supportMediaKind } from "./mediaUtils";
import styles from "./LiveSupport.module.scss";

interface ILiveSupportMessage {
  data: tLiveSupportMessage;
  /** First message of a run from the same sender: shows the agent's name. */
  groupStart: boolean;
  /** Last message of the run: shows the avatar and the tail corner. */
  groupEnd: boolean;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Turns plain http(s) links into clickable ones (text is escaped first). */
function linkify(html: string) {
  return html.replace(
    /(https?:\/\/[^\s<]+[^\s<.,;:!?)"'])/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer nofollow">$1</a>',
  );
}

const LiveSupportMessage: React.FC<ILiveSupportMessage> = ({ data, groupStart, groupEnd }) => {
  const t = useTranslations("LiveSupport");
  const isFromUser = isSupportMessageFromCustomer(data);
  const failed = data.deliveryStatus === "FAILED" || data.status === 2;
  const sending = data.status === 1 || data.deliveryStatus === "PENDING";
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!lightboxUrl) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxUrl(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxUrl]);

  const onRetry = async () => {
    if (data.id <= 0 || retrying) return;
    setRetrying(true);
    try {
      const updated = await apiRetrySupportMessage(data.id);
      liveSupportMessagesState.value = liveSupportMessagesState.value.map((m) =>
        m.id === data.id
          ? { ...m, ...updated, status: updated.deliveryStatus === "FAILED" ? 2 : 0 }
          : m,
      );
    } catch (ex) {
      console.error(ex);
    } finally {
      setRetrying(false);
    }
  };

  const rawText = data.message === "📎 Attachment" ? "" : data.message || "";
  const body = linkify(escapeHtml(rawText)).replace(/\n/g, "<br/>");
  const supportLabel = data.senderName || t("agent");
  const files = (data.filepaths || [])
    .map((url, i) => ({
      url,
      name: data.filenames?.[i] || `file-${i + 1}`,
      kind: supportMediaKind(data.filenames?.[i] || "", url),
    }))
    .filter((f) => Boolean(f.url));

  const images = files.filter((f) => f.kind === "image");
  const others = files.filter((f) => f.kind !== "image");
  const mediaOnly = !rawText && files.length > 0 && others.length === 0;
  const timeLabel = moment(data.createdAt).format("HH:mm");

  const meta = (
    <span className={`${styles.meta} ${mediaOnly ? styles.metaOnMedia : ""}`}>
      {timeLabel}
      {isFromUser && !failed ? (
        sending ? (
          <span className={styles.sendingSpinner} aria-label={t("sending")} />
        ) : (
          <Check size={13} strokeWidth={3} aria-hidden />
        )
      ) : null}
    </span>
  );

  const rowClass = [
    styles.messageRow,
    isFromUser ? styles.fromUser : styles.fromSupport,
    groupStart ? styles.groupStart : "",
  ].join(" ");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className={rowClass}
      >
        {!isFromUser ? (
          <span className={styles.avatarSlot} aria-hidden>
            {groupEnd ? (
              <span className={styles.agentAvatar}>{supportLabel.trim().charAt(0).toUpperCase() || "S"}</span>
            ) : null}
          </span>
        ) : null}

        <div className={styles.bubbleColumn}>
          {!isFromUser && groupStart ? <span className={styles.agentName}>{supportLabel}</span> : null}

          <div
            className={`${styles.bubble} ${isFromUser ? styles.user : styles.support} ${
              mediaOnly ? styles.mediaOnly : ""
            } ${failed && isFromUser ? styles.bubbleFailed : ""}`}
          >
            {images.length > 0 && (
              <div className={styles.mediaFrame}>
                <div className={`${styles.mediaGrid} ${images.length > 1 ? styles.cols2 : styles.cols1}`}>
                  {images.map((f) => (
                    <button
                      key={`${f.url}-${f.name}`}
                      type="button"
                      className={styles.photoBtn}
                      onClick={() => setLightboxUrl(f.url)}
                      title={t("open_preview")}
                    >
                      <img
                        src={f.url}
                        alt={f.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.minHeight = "120px";
                          e.currentTarget.style.objectFit = "contain";
                        }}
                      />
                    </button>
                  ))}
                </div>
                {mediaOnly ? meta : null}
              </div>
            )}

            {others.map((f) => {
              if (f.kind === "video") {
                return (
                  <div key={`${f.url}-${f.name}`} className={styles.videoWrap}>
                    <video src={f.url} controls playsInline preload="metadata" />
                  </div>
                );
              }
              if (f.kind === "audio") {
                return (
                  <div key={`${f.url}-${f.name}`} className={styles.audioWrap}>
                    <audio src={f.url} controls preload="metadata" />
                  </div>
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
                  <span className={styles.fileIcon}>
                    <FileText size={16} />
                  </span>
                  <span className={styles.fileName}>{f.name}</span>
                </a>
              );
            })}

            {rawText ? (
              <div className={styles.caption}>
                <span dir="auto" dangerouslySetInnerHTML={{ __html: body }} />
                {meta}
              </div>
            ) : !mediaOnly ? (
              <div className={styles.caption}>{meta}</div>
            ) : null}
          </div>

          {failed && isFromUser ? (
            <button type="button" className={styles.failedNote} onClick={onRetry} disabled={retrying}>
              <AlertCircle size={13} />
              {t("failed")}
              <span className={styles.failedRetry}>
                <RotateCw size={12} className={retrying ? styles.spin : undefined} />
                {t("retry")}
              </span>
            </button>
          ) : null}
        </div>
      </motion.div>

      {lightboxUrl &&
        createPortal(
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={t("open_preview")}
            onClick={() => setLightboxUrl(null)}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              aria-label={t("close_preview")}
              onClick={() => setLightboxUrl(null)}
            >
              <X size={22} />
            </button>
            <img
              src={lightboxUrl}
              alt=""
              className={styles.lightboxImg}
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </>
  );
};

export default LiveSupportMessage;
