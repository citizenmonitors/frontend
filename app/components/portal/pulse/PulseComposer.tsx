"use client";

import React from "react";
import { Gallery, Profile } from "iconsax-react";

type PulseComposerProps = {
  displayName?: string;
  onOpenCompose: () => void;
};

/** X-style “What’s happening?” strip */
export default function PulseComposer({
  displayName,
  onOpenCompose,
}: PulseComposerProps) {
  return (
    <div className="border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full border border-gray-200 bg-brand-25 text-brand-500 sm:h-11 sm:w-11">
          <Profile size={20} variant="Bold" />
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenCompose}
            className="w-full rounded-xl px-1 py-2 text-left text-lg text-gray-400 transition-colors hover:text-gray-500"
          >
            What&apos;s happening
            {displayName ? `, ${displayName.split(" ")[0]}` : ""}?
          </button>
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onOpenCompose}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-brand-600 hover:bg-brand-50"
              aria-label="Add media"
            >
              <Gallery size={18} />
            </button>
            <button
              type="button"
              onClick={onOpenCompose}
              className="inline-flex min-h-9 items-center justify-center rounded-full bg-brand-500 px-4 text-sm font-bold text-white hover:bg-brand-600"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
