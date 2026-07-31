"use client";

import React, { useState } from "react";
import {
  isSupportMessageFromCustomer,
  tLiveSupportMessage,
} from "@/types/tLiveSupportMessage";
import moment from "moment";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import { MdClose, MdInsertDriveFile } from "react-icons/md";
import { apiRetrySupportMessage } from "@/api/live_support/apiRetrySupportMessage";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import { supportMediaKind } from "./mediaUtils";
import styles from "./LiveSupport.module.scss";

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
  const sending = data.status === 1 || data.deliveryStatus === "PENDING";
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

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
    <div
      className={`${styles.meta} ${mediaOnly ? styles.metaOnMedia : ""}`}
    >
      <span>{timeLabel}</span>
      {sending && (
        <Spinner
          classNames={{ wrapper: "w-[11px] h-[11px]" }}
          variant="gradient"
          color="default"
        />
      )}
      {failed && isFromUser && (
        <button type="button" className={styles.retryBtn} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16 }}
        className={`${styles.messageRow} ${isFromUser ? styles.fromUser : ""}`}
      >
        <div
          className={`${styles.bubble} ${
            isFromUser ? styles.user : styles.support
          } ${mediaOnly ? styles.mediaOnly : ""}`}
        >
          {!isFromUser && !mediaOnly && (
            <div className={styles.agentName}>{supportLabel}</div>
          )}

          {images.length > 0 && (
            <div className={styles.mediaFrame}>
              {!isFromUser && mediaOnly && (
                <div className={styles.agentName} style={{ padding: "6px 8px 4px" }}>
                  {supportLabel}
                </div>
              )}
              <div
                className={`${styles.mediaGrid} ${
                  images.length > 1 ? styles.cols2 : styles.cols1
                }`}
              >
                {images.map((f) => (
                  <button
                    key={`${f.url}-${f.name}`}
                    type="button"
                    className={styles.photoBtn}
                    onClick={() => setLightboxUrl(f.url)}
                    title="Open preview"
                  >
                    <img
                      src={f.url}
                      alt={f.name}
                      loading="lazy"
                      onError={(e) => {
                        // If preview fails, keep alt text visible via broken-image fallback box
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
                <MdInsertDriveFile size={18} />
                {f.name}
              </a>
            );
          })}

          {rawText ? (
            <div
              className={styles.caption}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : null}

          {!mediaOnly ? meta : null}
        </div>
      </motion.div>

      {lightboxUrl && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            aria-label="Close preview"
            onClick={() => setLightboxUrl(null)}
          >
            <MdClose size={22} />
          </button>
          <img
            src={lightboxUrl}
            alt="Preview"
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default LiveSupportMessage;
