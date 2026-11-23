"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  AudioLines,
  FileText,
  ImagePlus,
  Mic,
  MonitorUp,
  Paperclip,
  SendHorizontal,
  Square,
  X,
} from "lucide-react";
import { userState } from "@/state/userState";
import { apiSendSupportMessage } from "@/api/live_support/apiSendSupportMessage";
import { apiUploadSupportFiles } from "@/api/live_support/apiUploadSupportFiles";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import { useTranslations } from "@/context/I18nContext";
import { isAudioFile, isImageFile, isVideoFile } from "./mediaUtils";
import styles from "./LiveSupport.module.scss";

export const MAX_SUPPORT_FILES = 5;
const ACCEPT_ALL =
  "image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.txt,application/pdf,.heic,.heif";
const ACCEPT_PHOTO = "image/*,.heic,.heif";

type PendingFile = {
  id: string;
  file: File;
  previewUrl?: string;
};

/** What the chat panel can do with the composer (topic chips, dropping files on the panel). */
export type LiveSupportComposerHandle = {
  prefill: (text: string) => void;
  addFiles: (files: File[]) => void;
};

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "audio/webm": "webm",
    "audio/ogg": "ogg",
    "audio/mpeg": "mp3",
    "application/pdf": "pdf",
  };
  return map[mime] || "bin";
}

/** Normalize clipboard / drag files so they always have a usable name + extension. */
function normalizePastedFile(file: File, index = 0): File {
  const hasExt = /\.[a-z0-9]{2,5}$/i.test(file.name || "");
  const generic =
    !file.name ||
    file.name === "image.png" ||
    file.name === "blob" ||
    file.name === "untitled";
  if (!generic && hasExt) return file;

  const ext = extFromMime(file.type || "application/octet-stream");
  const base = file.type.startsWith("image/")
    ? "paste-image"
    : file.type.startsWith("video/")
      ? "paste-video"
      : file.type.startsWith("audio/")
        ? "paste-audio"
        : "paste-file";
  return new File([file], `${base}-${Date.now()}-${index}.${ext}`, {
    type: file.type || "application/octet-stream",
    lastModified: file.lastModified || Date.now(),
  });
}

export function filesFromTransfer(transfer: DataTransfer | null): File[] {
  if (!transfer) return [];
  const out: File[] = [];

  if (transfer.items?.length) {
    Array.from(transfer.items).forEach((item, i) => {
      if (item.kind !== "file") return;
      const file = item.getAsFile();
      if (file && file.size > 0) out.push(normalizePastedFile(file, i));
    });
  }

  if (!out.length && transfer.files?.length) {
    Array.from(transfer.files).forEach((file, i) => {
      if (file && file.size > 0) out.push(normalizePastedFile(file, i));
    });
  }

  return out;
}

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function placeCaretAtEnd(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

const LiveSupportMessageInput = forwardRef<LiveSupportComposerHandle>(function LiveSupportMessageInput(
  _props,
  ref,
) {
  const t = useTranslations("LiveSupport");
  const user = userState.value;
  const divRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [pending, setPending] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [recordingKind, setRecordingKind] = useState<null | "voice" | "screen">(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    divRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      stopMediaTracks();
      pending.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!recordingKind) return;
    setElapsed(0);
    const started = Date.now();
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 500);
    return () => window.clearInterval(id);
  }, [recordingKind]);

  const stopMediaTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    mediaChunksRef.current = [];
  };

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const list = Array.from(files).filter((f) => f && f.size > 0);
      if (!list.length) {
        setError(t("err_read"));
        return;
      }
      setPending((prev) => {
        const room = MAX_SUPPORT_FILES - prev.length;
        if (room <= 0) {
          setError(t("err_max", { max: String(MAX_SUPPORT_FILES) }));
          return prev;
        }
        const next = list.slice(0, room).map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl:
            isImageFile(file) || isVideoFile(file) || isAudioFile(file)
              ? URL.createObjectURL(file)
              : undefined,
        }));
        if (list.length > room) {
          setError(t("err_extra", { max: String(MAX_SUPPORT_FILES) }));
        }
        return [...prev, ...next];
      });
    },
    [t],
  );

  const syncHasText = () => {
    const text = (divRef.current?.innerText || "").replace(/ /g, " ").trim();
    setHasText(Boolean(text));
  };

  useImperativeHandle(
    ref,
    () => ({
      prefill: (text: string) => {
        const el = divRef.current;
        if (!el) return;
        if (text) el.innerText = text;
        el.focus();
        placeCaretAtEnd(el);
        syncHasText();
      },
      addFiles: (files: File[]) => {
        if (!user?.id || uploading || recordingKind) return;
        addFiles(files);
      },
    }),
    [addFiles, user?.id, uploading, recordingKind],
  );

  const removePending = (id: string) => {
    setPending((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const startRecording = async (kind: "voice" | "screen") => {
    if (recordingKind || uploading) return;
    setError(null);

    try {
      const stream =
        kind === "voice"
          ? await navigator.mediaDevices.getUserMedia({ audio: true })
          : await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

      mediaStreamRef.current = stream;
      mediaChunksRef.current = [];

      const mimeType =
        kind === "voice"
          ? MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : MediaRecorder.isTypeSupported("audio/webm")
              ? "audio/webm"
              : undefined
          : MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
            ? "video/webm;codecs=vp9,opus"
            : MediaRecorder.isTypeSupported("video/webm")
              ? "video/webm"
              : undefined;

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) mediaChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blobType = recorder.mimeType || (kind === "voice" ? "audio/webm" : "video/webm");
        const blob = new Blob(mediaChunksRef.current, { type: blobType });
        const ext = blobType.includes("ogg") ? "ogg" : "webm";
        const filename = kind === "voice" ? `voice-${Date.now()}.${ext}` : `screen-${Date.now()}.${ext}`;
        addFiles([new File([blob], filename, { type: blobType })]);
        stopMediaTracks();
        setRecordingKind(null);
      };

      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
          }
        };
      });

      recorder.start();
      setRecordingKind(kind);
    } catch (ex) {
      console.error(ex);
      stopMediaTracks();
      setRecordingKind(null);
      setError(kind === "voice" ? t("err_mic") : t("err_screen"));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    } else {
      stopMediaTracks();
      setRecordingKind(null);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!divRef.current || !user?.id || uploading || recordingKind) return;

    const message = divRef.current.innerText.replace(/ /g, " ").trim();
    if (!message && pending.length === 0) return;

    setUploading(true);
    setError(null);

    const tempId = -new Date().getTime();
    const localFiles = pending.map((p) => p.file);
    const localNames = localFiles.map((f) => f.name);
    const localPreviews = pending.map((p) => p.previewUrl || "");

    const optimistic: tLiveSupportMessage = {
      id: tempId,
      userId: user.id,
      message: message || (localFiles.length ? "📎 Attachment" : ""),
      filepaths: localPreviews,
      filenames: localNames,
      replyId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      isDeleted: false,
      deliveryStatus: "PENDING",
      User: user,
      status: 1,
    };

    liveSupportMessagesState.value = [...liveSupportMessagesState.value, optimistic];
    divRef.current.innerText = "";
    setHasText(false);
    const toCleanup = [...pending];
    setPending([]);

    try {
      let filepaths: string[] = [];
      let filenames: string[] = [];

      if (localFiles.length) {
        const uploaded = await apiUploadSupportFiles(localFiles);
        if (!uploaded?.length) {
          throw new Error("Upload returned no files");
        }
        filepaths = uploaded.map((u) => u.url);
        filenames = uploaded.map((u) => u.filename);
      }

      const saved = await apiSendSupportMessage({
        message: message || undefined,
        filepaths,
        filenames,
        tempId,
      });

      toCleanup.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });

      liveSupportMessagesState.value = liveSupportMessagesState.value.map((msg) =>
        msg.id === tempId ? { ...saved, status: saved.deliveryStatus === "FAILED" ? 2 : 0 } : msg,
      );
    } catch (ex: any) {
      console.error(ex);
      const apiMsg = ex?.response?.data?.message;
      setError(
        Array.isArray(apiMsg) ? apiMsg.join(", ") : typeof apiMsg === "string" && apiMsg ? apiMsg : t("err_send"),
      );
      // Restore unsent attachments and text so the user can retry without redoing anything
      setPending((prev) => (prev.length ? prev : toCleanup));
      if (divRef.current && message && !divRef.current.innerText.trim()) {
        divRef.current.innerText = message;
        setHasText(true);
      }
      liveSupportMessagesState.value = liveSupportMessagesState.value.filter((msg) => msg.id !== tempId);
    } finally {
      setUploading(false);
    }
  }, [user, pending, uploading, recordingKind, t]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    if (!user?.id || uploading || recordingKind) return;
    const files = filesFromTransfer(e.clipboardData);
    if (files.length) {
      e.preventDefault();
      addFiles(files);
      return;
    }
    // Paste as plain text so formatting from other pages doesn't leak into the box
    const text = e.clipboardData.getData("text/plain");
    if (text) {
      e.preventDefault();
      document.execCommand("insertText", false, text);
      syncHasText();
    }
  };

  const busy = !user?.id || uploading;
  const canSend = !busy && !recordingKind && (hasText || pending.length > 0);

  return (
    <div className={styles.composer}>
      {pending.length > 0 && (
        <div className={styles.pendingRow}>
          {pending.map((p) => (
            <div key={p.id} className={styles.pendingThumb}>
              {p.previewUrl && isImageFile(p.file) ? (
                <img src={p.previewUrl} alt={p.file.name} />
              ) : p.previewUrl && isVideoFile(p.file) ? (
                <video src={p.previewUrl} muted />
              ) : (
                <div className={styles.pendingLabel}>
                  {isAudioFile(p.file) ? <AudioLines size={18} /> : <FileText size={18} />}
                  <span>{isAudioFile(p.file) ? t("voice_note") : p.file.name}</span>
                </div>
              )}
              <button
                type="button"
                aria-label={t("remove")}
                title={t("remove")}
                className={styles.pendingRemove}
                onClick={() => removePending(p.id)}
                disabled={uploading}
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className={styles.composerError} role="alert">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ALL}
        multiple
        className="hidden"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const input = e.currentTarget;
          if (input.files?.length) addFiles(input.files);
          input.value = "";
        }}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept={ACCEPT_PHOTO}
        multiple
        className="hidden"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const input = e.currentTarget;
          if (input.files?.length) addFiles(input.files);
          input.value = "";
        }}
      />

      {recordingKind ? (
        <div className={styles.recordingCard} role="status">
          <span className={styles.recordingDot} />
          <span className={styles.recordingText}>
            {recordingKind === "voice" ? t("recording_voice") : t("recording_screen")}
          </span>
          <span className={styles.recordingTime}>{formatElapsed(elapsed)}</span>
          <button type="button" className={styles.recordingStop} onClick={stopRecording}>
            <Square size={12} fill="currentColor" />
            {t("stop")}
          </button>
        </div>
      ) : null}

      {/* Stays mounted while recording (just hidden) so typed text isn't lost */}
      <div className={styles.composerCard} hidden={!!recordingKind}>
        <div
          id="live-support-message-input"
          dir={hasText ? "auto" : undefined}
          role="textbox"
          aria-multiline="true"
          aria-label={t("placeholder")}
          tabIndex={0}
          ref={divRef}
          onKeyDown={handleKeyDown}
          onInput={syncHasText}
          onPaste={handlePaste}
          contentEditable={!busy}
          suppressContentEditableWarning
          data-placeholder={t("placeholder")}
          className={styles.inputBox}
        />
        <div className={styles.toolbar}>
          <div className={styles.tools}>
            <button
              type="button"
              title={t("attach_photo")}
              aria-label={t("attach_photo")}
              disabled={busy}
              className={styles.toolBtn}
              onClick={() => photoInputRef.current?.click()}
            >
              <ImagePlus size={18} />
            </button>
            <button
              type="button"
              title={t("attach_file")}
              aria-label={t("attach_file")}
              disabled={busy}
              className={styles.toolBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} />
            </button>
            <button
              type="button"
              title={t("record_voice")}
              aria-label={t("record_voice")}
              disabled={busy}
              className={styles.toolBtn}
              onClick={() => void startRecording("voice")}
            >
              <Mic size={18} />
            </button>
            <button
              type="button"
              title={t("record_screen")}
              aria-label={t("record_screen")}
              disabled={busy}
              className={`${styles.toolBtn} ${styles.hideOnTouch}`}
              onClick={() => void startRecording("screen")}
            >
              <MonitorUp size={18} />
            </button>
          </div>
          <button
            type="button"
            className={styles.sendBtn}
            disabled={!canSend}
            onClick={() => void sendMessage()}
          >
            {uploading ? <span className={styles.sendingSpinner} aria-hidden /> : null}
            <span>{t("send")}</span>
            <SendHorizontal size={16} strokeWidth={2.4} className={styles.sendIcon} />
          </button>
        </div>
      </div>

      <p className={styles.enterHint}>{t("enter_hint")}</p>
    </div>
  );
});

export default LiveSupportMessageInput;
