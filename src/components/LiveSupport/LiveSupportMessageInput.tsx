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
} from "react-icons/md";
import { userState } from "@/state/userState";
import { apiSendSupportMessage } from "@/api/live_support/apiSendSupportMessage";
import { apiUploadSupportFiles } from "@/api/live_support/apiUploadSupportFiles";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import styles from "./LiveSupport.module.scss";

const MAX_FILES = 5;
const ACCEPT =
  "image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.txt,application/pdf";

type PendingFile = {
  id: string;
  file: File;
  previewUrl?: string;
};

function isImage(file: File) {
  return file.type.startsWith("image/");
}

function isVideo(file: File) {
  return file.type.startsWith("video/");
}

function isAudio(file: File) {
  return file.type.startsWith("audio/");
}

const LiveSupportMessageInput: React.FC = () => {
  const user = userState.value;
  const divRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [pending, setPending] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
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
    const list = Array.from(files);
    setPending((prev) => {
      const room = MAX_FILES - prev.length;
      if (room <= 0) {
        setError(`Maximum ${MAX_FILES} attachments`);
        return prev;
      }
      const next = list.slice(0, room).map((file) => {
        const preview =
          isImage(file) || isVideo(file) || isAudio(file)
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
    const toCleanup = [...pending];
    setPending([]);

    try {
      let filepaths: string[] = [];
      let filenames: string[] = [];

      if (localFiles.length) {
        const uploaded = await apiUploadSupportFiles(localFiles);
        filepaths = uploaded.map((u) => u.url);
        filenames = uploaded.map((u) => u.filename);
      }

      const saved = await apiSendSupportMessage({
        message,
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
    } catch (ex) {
      console.error(ex);
      setError("Failed to send. Tap Retry on the message.");
      liveSupportMessagesState.value = liveSupportMessagesState.value.map(
        (msg) =>
          msg.id === tempId
            ? { ...msg, status: 2, deliveryStatus: "FAILED" }
            : msg,
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

  const sendDisabled = !user?.id || uploading || !!recordingKind;

  return (
    <div className={styles.composer}>
      {pending.length > 0 && (
        <div className={styles.pendingRow}>
          {pending.map((p) => (
            <div key={p.id} className={styles.pendingThumb}>
              {p.previewUrl && isImage(p.file) ? (
                <img src={p.previewUrl} alt={p.file.name} />
              ) : p.previewUrl && isVideo(p.file) ? (
                <video src={p.previewUrl} muted />
              ) : (
                <div className={styles.pendingLabel}>
                  {isAudio(p.file) ? "Voice" : p.file.name.slice(0, 18)}
                </div>
              )}
              <button
                type="button"
                aria-label="Remove attachment"
                className={styles.pendingRemove}
                onClick={() => removePending(p.id)}
                disabled={uploading}
              >
                <MdClose size={12} />
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
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <button
          type="button"
          title="Attach file"
          disabled={!user?.id || uploading || !!recordingKind}
          className={styles.toolBtn}
          onClick={() => fileInputRef.current?.click()}
        >
          <MdAttachFile size={20} />
        </button>

        <button
          type="button"
          title={recordingKind === "voice" ? "Stop voice" : "Record voice"}
          disabled={!user?.id || uploading || recordingKind === "screen"}
          className={`${styles.toolBtn} ${
            recordingKind === "voice" ? styles.active : ""
          }`}
          onClick={() =>
            recordingKind === "voice"
              ? stopRecording()
              : void startRecording("voice")
          }
        >
          {recordingKind === "voice" ? (
            <MdStop size={20} />
          ) : (
            <MdMic size={20} />
          )}
        </button>

        <button
          type="button"
          title={
            recordingKind === "screen" ? "Stop screen" : "Record screen"
          }
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

        <div
          id="live-support-message-input"
          tabIndex={0}
          ref={divRef}
          onKeyDown={handleKeyDown}
          contentEditable={!!user?.id && !uploading}
          data-placeholder="Type a message…"
          className={styles.inputBox}
        />

        <button
          type="button"
          className={styles.sendBtn}
          disabled={sendDisabled}
          aria-label="Send message"
          onClick={() => {
            if (!sendDisabled) void sendMessage();
          }}
        >
          <MdSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default LiveSupportMessageInput;
