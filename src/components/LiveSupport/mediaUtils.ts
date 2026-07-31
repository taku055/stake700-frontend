export type SupportMediaKind = "image" | "video" | "audio" | "file";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|svg|heic|heif)(\?|#|$)/i;
const VIDEO_EXT = /\.(mp4|webm|mov|mkv|m4v)(\?|#|$)/i;
const AUDIO_EXT = /\.(mp3|ogg|opus|wav|m4a|aac|flac)(\?|#|$)/i;

export function supportMediaKind(
  filename: string,
  url: string,
): SupportMediaKind {
  const name = (filename || "").toLowerCase();
  const path = (url || "").toLowerCase();
  const target = `${name} ${path}`;

  if (name.startsWith("voice") || AUDIO_EXT.test(name)) return "audio";
  if (IMAGE_EXT.test(name) || IMAGE_EXT.test(path) || name.startsWith("photo")) {
    return "image";
  }
  if (
    name.startsWith("screen") ||
    VIDEO_EXT.test(name) ||
    VIDEO_EXT.test(path)
  ) {
    return "video";
  }
  // Blob previews from the composer before upload completes
  if (path.startsWith("blob:")) {
    if (name.startsWith("voice")) return "audio";
    if (name.startsWith("screen")) return "video";
    if (IMAGE_EXT.test(name) || name.includes("image")) return "image";
  }
  if (AUDIO_EXT.test(target)) return "audio";
  return "file";
}

export function isImageFile(file: File) {
  return (
    file.type.startsWith("image/") ||
    IMAGE_EXT.test(file.name) ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  );
}

export function isVideoFile(file: File) {
  return file.type.startsWith("video/") || VIDEO_EXT.test(file.name);
}

export function isAudioFile(file: File) {
  return file.type.startsWith("audio/") || AUDIO_EXT.test(file.name);
}
