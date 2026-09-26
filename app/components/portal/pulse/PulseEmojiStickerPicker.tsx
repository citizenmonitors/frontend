"use client";

import React, { useEffect, useRef, useState } from "react";
import { EmojiHappy } from "iconsax-react";
import { emojiToStickerFile } from "@/app/utils/pulseMedia";

const EMOJIS = [
  "😀", "😂", "🤣", "😊", "😍", "🤩", "😘", "😎",
  "🤗", "🤔", "🫡", "😴", "😭", "😤", "😡", "🥳",
  "🙏", "👍", "👎", "👏", "🔥", "💯", "✨", "💪",
  "❤️", "💔", "🇳🇬", "✅", "⚠️", "📢", "🗳️", "📍",
];

const STICKERS = ["🇳🇬", "🗳️", "📢", "🔥", "💯", "✅", "💪", "🙏", "❤️", "😎", "😂", "🤩"];

type PulseEmojiStickerPickerProps = {
  onInsertEmoji: (emoji: string) => void;
  onPickSticker?: (file: File) => void;
  placement?: "up" | "down";
};

export default function PulseEmojiStickerPicker({
  onInsertEmoji,
  onPickSticker,
  placement = "down",
}: PulseEmojiStickerPickerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"emoji" | "stickers">("emoji");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function handleSticker(emoji: string) {
    if (!onPickSticker) {
      onInsertEmoji(emoji);
      setOpen(false);
      return;
    }
    try {
      const file = await emojiToStickerFile(emoji);
      onPickSticker(file);
      setOpen(false);
    } catch {
      onInsertEmoji(emoji);
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-2 py-1.5 text-brand-600 hover:bg-brand-50"
        title="Emoji and stickers"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <EmojiHappy size={18} />
        <span className="text-xs font-medium">Emoji</span>
      </button>

      {open ? (
        <div
          className={`absolute left-0 z-40 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ${
            placement === "up" ? "bottom-full mb-1.5" : "mt-1.5"
          }`}
        >
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => setTab("emoji")}
              className={`flex-1 px-3 py-2 text-xs font-semibold ${
                tab === "emoji"
                  ? "border-b-2 border-brand-500 text-brand-700"
                  : "text-gray-500"
              }`}
            >
              Emoji
            </button>
            {onPickSticker ? (
              <button
                type="button"
                onClick={() => setTab("stickers")}
                className={`flex-1 px-3 py-2 text-xs font-semibold ${
                  tab === "stickers"
                    ? "border-b-2 border-brand-500 text-brand-700"
                    : "text-gray-500"
                }`}
              >
                Stickers
              </button>
            ) : null}
          </div>

          {tab !== "stickers" || !onPickSticker ? (
            <div className="grid grid-cols-8 gap-0.5 p-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onInsertEmoji(emoji)}
                  className="grid h-9 place-content-center rounded-lg text-xl hover:bg-brand-50"
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 p-2">
              {STICKERS.map((emoji) => (
                <button
                  key={`sticker-${emoji}`}
                  type="button"
                  onClick={() => handleSticker(emoji)}
                  className="grid aspect-square place-content-center rounded-xl bg-gray-50 text-3xl hover:bg-brand-50"
                  title="Add as image"
                >
                  {emoji}
                </button>
              ))}
              <p className="col-span-4 px-1 pb-1 text-[11px] text-gray-400">
                Stickers are attached as images.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
