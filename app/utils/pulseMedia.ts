import type { ClipboardEvent, DragEvent } from "react";

export const PULSE_IMAGE_ACCEPT =
  "image/*,image/gif,image/webp,image/png,image/jpeg,.gif,.webp,.png,.jpg,.jpeg,.heic,.heif,.bmp,.avif";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|heic|heif|bmp|avif)$/i;

export function isPulseImageFile(file: File | null | undefined): file is File {
  if (!file) return false;
  if (file.type.startsWith("image/")) return true;
  if (
    (!file.type || file.type === "application/octet-stream") &&
    IMAGE_EXT.test(file.name)
  ) {
    return true;
  }
  return false;
}

export function fileFromClipboard(event: ClipboardEvent): File | null {
  const items = event.clipboardData?.items;
  if (!items) return null;
  for (const item of Array.from(items)) {
    if (item.kind !== "file") continue;
    const file = item.getAsFile();
    if (isPulseImageFile(file)) return file;
  }
  const files = event.clipboardData?.files;
  if (files) {
    for (const file of Array.from(files)) {
      if (isPulseImageFile(file)) return file;
    }
  }
  return null;
}

export function fileFromDrop(event: DragEvent): File | null {
  const files = event.dataTransfer?.files;
  if (!files) return null;
  for (const file of Array.from(files)) {
    if (isPulseImageFile(file)) return file;
  }
  return null;
}

export function insertTextAtCursor(
  value: string,
  insert: string,
  start = value.length,
  end = start
) {
  return {
    next: `${value.slice(0, start)}${insert}${value.slice(end)}`,
    caret: start + insert.length,
  };
}

export function emojiToStickerFile(emoji: string): Promise<File> {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(new Error("Could not create sticker."));
  }
  ctx.clearRect(0, 0, size, size);
  ctx.font =
    "400px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2 + 20);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not create sticker."));
        return;
      }
      resolve(
        new File([blob], `pulse-sticker-${Date.now()}.png`, {
          type: "image/png",
        })
      );
    }, "image/png");
  });
}
