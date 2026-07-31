"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MdAttachFile,
  MdMic,
  MdFiberManualRecord,
  MdScreenShare,
  MdSend,
  MdClose,
  MdStop,
  MdPhotoCamera,
} from "react-icons/md";
import { userState } from "@/state/userState";
import { apiSendSupportMessage } from "@/api/live_support/apiSendSupportMessage";
import { apiUploadSupportFiles } from "@/api/live_support/apiUploadSupportFiles";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import { isAudioFile, isImageFile, isVideoFile } from "./mediaUtils";
import styles from "./LiveSupport.module.scss";

const MAX_FILES = 5;
const ACCEPT_ALL =
  "image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.txt,application/pdf,.heic,.heif";
const ACCEPT_PHOTO = "image/*,.heic,.heif";

type PendingFile = {
  id: string;
  file: File;
  previewUrl?: string;
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

function filesFromClipboard(clipboard: DataTransfer | null): File[] {
  if (!clipboard) return [];
  const out: File[] = [];

  if (clipboard.items?.length) {
    Array.from(clipboard.items).forEach((item, i) => {
      if (item.kind !== "file") return;
      const file = item.getAsFile();
      if (file && file.size > 0) out.push(normalizePastedFile(file, i));
    });
  }

  if (!out.length && clipboard.files?.length) {
    Array.from(clipboard.files).forEach((file, i) => {
      if (file && file.size > 0) out.push(normalizePastedFile(file, i));
    });
  }

  return out;
}

const LiveSupportMessageInput: React.FC = () => {
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
  const [recordingKind, setRecordingKind] = useState<
    null | "voice" | "screen"
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const input = document.getElementById("live-support-message-input");
    if (input) input.focus();
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

  const stopMediaTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    mediaChunksRef.current = [];
  };

  const addFiles = useCallback((files: FileList | File[]) => {
    setError(null);
    const list = Array.from(files).filter((f) => f && f.size > 0);
    if (!list.length) {
      setError("Could not read selected file");
      return;
    }
    setPending((prev) => {
      const room = MAX_FILES - prev.length;
      if (room <= 0) {
        setError(`Maximum ${MAX_FILES} attachments`);
        return prev;
      }
      const next = list.slice(0, room).map((file) => {
        const preview =
          isImageFile(file) || isVideoFile(file) || isAudioFile(file)
            ? URL.createObjectURL(file)
            : undefined;
        return {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl: preview,
        };
      });
      if (list.length > room) {
        setError(`Only ${MAX_FILES} files allowed; extra files ignored`);
      }
      return [...prev, ...next];
    });
  }, []);

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
          : await navigator.mediaDevices.getDisplayMedia({
              video: true,
              audio: true,
            });

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

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) mediaChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blobType =
          recorder.mimeType || (kind === "voice" ? "audio/webm" : "video/webm");
        const blob = new Blob(mediaChunksRef.current, { type: blobType });
        const ext = blobType.includes("ogg") ? "ogg" : "webm";
        const filename =
          kind === "voice"
            ? `voice-${Date.now()}.${ext}`
            : `screen-${Date.now()}.${ext}`;
        const file = new File([blob], filename, { type: blobType });
        addFiles([file]);
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
      setError(
        kind === "voice"
          ? "Microphone access denied or unavailable"
          : "Screen recording cancelled or unavailable",
      );
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

  const syncHasText = () => {
    const text = (divRef.current?.innerText || "")
      .replace(/\u00a0/g, " ")
      .trim();
    setHasText(Boolean(text));
  };

  const sendMessage = useCallback(async () => {
    if (!divRef.current || !user?.id || uploading || recordingKind) return;

    const message = divRef.current.innerText.replace(/\u00a0/g, " ").trim();
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

    liveSupportMessagesState.value = [
      ...liveSupportMessagesState.value,
      optimistic,
    ];
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

      liveSupportMessagesState.value = liveSupportMessagesState.value.map(
        (msg) =>
          msg.id === tempId
            ? {
                ...saved,
                status: saved.deliveryStatus === "FAILED" ? 2 : 0,
              }
            : msg,
      );
    } catch (ex: any) {
      console.error(ex);
      const apiMsg =
        ex?.response?.data?.message ||
        ex?.message ||
        "Failed to send attachment.";
      setError(Array.isArray(apiMsg) ? apiMsg.join(", ") : String(apiMsg));
      // Restore unsent attachments so the user can retry without re-picking files
      setPending((prev) => (prev.length ? prev : toCleanup));
      liveSupportMessagesState.value = liveSupportMessagesState.value.filter(
        (msg) => msg.id !== tempId,
      );
    } finally {
      setUploading(false);
    }
  }, [user?.id, pending, uploading, recordingKind]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    if (!user?.id || uploading || recordingKind) return;
    const files = filesFromClipboard(e.clipboardData);
    if (!files.length) return;
    e.preventDefault();
    addFiles(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    if (!user?.id || uploading || recordingKind) return;
    const files = filesFromClipboard(e.dataTransfer);
    if (!files.length) return;
    e.preventDefault();
    e.stopPropagation();
    addFiles(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    if (!user?.id || uploading || recordingKind) return;
    if (e.dataTransfer?.types?.includes("Files")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const sendDisabled = !user?.id || uploading || !!recordingKind;
  const canSend = !sendDisabled && (hasText || pending.length > 0);

  return (
    <div
      className={styles.composer}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
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
                  {isAudioFile(p.file) ? "Voice" : p.file.name.slice(0, 18)}
                </div>
              )}
              <button
                type="button"
                aria-label="Remove attachment"
                className={styles.pendingRemove}
                onClick={() => removePending(p.id)}
                disabled={uploading}
              >
                <MdClose size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className={styles.hint}>{error}</div>}

      {recordingKind && (
        <div className={styles.recordingHint}>
          <MdFiberManualRecord className="text-red-500 animate-pulse" />
          {recordingKind === "voice" ? "Recording voice…" : "Recording screen…"}
          <button type="button" onClick={stopRecording}>
            Stop
          </button>
        </div>
      )}

      <div className={styles.composerRow}>
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

        <button
          type="button"
          title="Attach photo"
          disabled={!user?.id || uploading || !!recordingKind}
          className={styles.toolBtn}
          onClick={() => photoInputRef.current?.click()}
        >
          <MdPhotoCamera size={22} />
        </button>

        <button
          type="button"
          title="Attach file"
          disabled={!user?.id || uploading || !!recordingKind}
          className={styles.toolBtn}
          onClick={() => fileInputRef.current?.click()}
        >
          <MdAttachFile size={22} />
        </button>

        <div
          id="live-support-message-input"
          tabIndex={0}
          ref={divRef}
          onKeyDown={handleKeyDown}
          onInput={syncHasText}
          onPaste={handlePaste}
          contentEditable={!!user?.id && !uploading}
          data-placeholder="Message"
          className={styles.inputBox}
        />

        <button
          type="button"
          title={recordingKind === "screen" ? "Stop screen" : "Record screen"}
          disabled={!user?.id || uploading || recordingKind === "voice"}
          className={`${styles.toolBtn} ${
            recordingKind === "screen" ? styles.active : ""
          }`}
          onClick={() =>
            recordingKind === "screen"
              ? stopRecording()
              : void startRecording("screen")
          }
        >
          <MdScreenShare size={20} />
        </button>

        {canSend || recordingKind === "voice" ? (
          recordingKind === "voice" ? (
            <button
              type="button"
              title="Stop voice"
              className={`${styles.toolBtn} ${styles.active}`}
              onClick={stopRecording}
            >
              <MdStop size={22} />
            </button>
          ) : (
            <button
              type="button"
              className={styles.sendBtn}
              disabled={sendDisabled}
              aria-label="Send message"
              onClick={() => void sendMessage()}
            >
              <MdSend size={18} />
            </button>
          )
        ) : (
          <button
            type="button"
            title="Record voice"
            disabled={!user?.id || uploading}
            className={styles.toolBtn}
            onClick={() => void startRecording("voice")}
          >
            <MdMic size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveSupportMessageInput;
