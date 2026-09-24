"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  ArrowRotateLeft,
  Like1,
  Message,
  Share,
  TickCircle,
} from "iconsax-react";
import PulseActionButton from "./PulseActionButton";
import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { PulsePost } from "@/app/redux/types";
import {
  formatPulseDateTime,
  formatPulseTimeAgo,
  shouldTruncatePulseBody,
  truncatePulseBody,
} from "@/app/utils/pulseUtils";

export const PULSE_INTRO_BODY = [
  "Hi, my name is Ade. I built Pulse for you. Not for politicians. Not for institutions. For the person on your street who has been watching things fall apart and wondering if anyone else sees it too. They do. And now you have somewhere to find each other.",
  "This is your community, finally in one place. Real people, real streets, shared frustrations — with somewhere useful to put it all.",
  'Talk about the clinic with no drugs. The road that\'s been "under construction" since 2019. The extortion everyone experiences and nobody is officially reporting. The government announcement and what it actually means for your street. Governance isn\'t just elections; it\'s every broken thing in between.',
  "And here's where it gets interesting. When enough people are saying the same thing, it stops being a complaint and becomes a pattern. A pattern becomes evidence. And evidence? Evidence travels; to the right desks, the right authorities, the right people who suddenly can't pretend they didn't know.",
  "Your gist has power. Use it.\nPost with your name or stay anonymous. Both work. Both matter.",
  "The magic happens when more citizens are here. So don't come alone — bring your neighbours, your friends, the person on your street who notices everything. Every voice added makes this harder to ignore.",
  "Your community has receipts. This is where you file them!",
].join("\n\n");

const PULSE_INTRO_CREATED_AT = "2024-01-15T09:30:00+01:00";

export function getPulseIntroPost(): PulsePost {
  return {
    id: "pulse-intro-ade",
    body: PULSE_INTRO_BODY,
    imageUrl: null,
    visibilityScope: "public",
    locationLabel: "Post Within Nigeria",
    location: null,
    author: {
      id: "ade",
      displayName: "Ade",
      usedAnonymous: false,
    },
    likesCount: 128,
    commentsCount: 0,
    repostsCount: 0,
    isLikedByCurrentUser: false,
    createdAt: PULSE_INTRO_CREATED_AT,
  };
}

/** Ade’s welcome — always the first post in the Pulse feed */
type PulseIntroPostProps = {
  onComment?: () => void;
  onRepost?: () => void;
  onLike?: () => void;
};

export default function PulseIntroPost({
  onComment,
  onRepost,
  onLike,
}: PulseIntroPostProps) {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(128);
  const needsTruncate = shouldTruncatePulseBody(PULSE_INTRO_BODY);
  const displayBody =
    expanded || !needsTruncate
      ? PULSE_INTRO_BODY
      : truncatePulseBody(PULSE_INTRO_BODY);
  const dateTimeLabel = formatPulseTimeAgo(PULSE_INTRO_CREATED_AT);
  const fullDateTime = formatPulseDateTime(PULSE_INTRO_CREATED_AT);

  function handleShare() {
    const text = `Ade: ${PULSE_INTRO_BODY}`;
    if (navigator.share) {
      navigator.share({ title: "Pulse", text }).catch(() => undefined);
      return;
    }
    navigator.clipboard?.writeText(text);
    dispatch(showAlert({ message: "Post copied to clipboard.", type: "success" }));
  }

  return (
    <article className="min-w-0 border-b border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50/70 sm:px-5 sm:py-4">
      <div className="flex gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 sm:h-11 sm:w-11">
          <Image
            src="/assets/pulse/ade-pulse-intro.png"
            alt="Ade"
            width={44}
            height={44}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
            <span className="truncate font-bold text-gray-900">Ade</span>
            <TickCircle
              size={16}
              className="shrink-0 text-brand-500"
              variant="Bold"
            />
            <span className="truncate text-gray-500">@ade</span>
            <span className="text-gray-400">·</span>
            <span className="shrink-0 text-gray-500">Pinned</span>
            {dateTimeLabel ? (
              <>
                <span className="text-gray-400">·</span>
                <time
                  className="shrink-0 text-gray-500"
                  dateTime={PULSE_INTRO_CREATED_AT}
                  title={fullDateTime || undefined}
                >
                  {dateTimeLabel}
                </time>
              </>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-brand-600">
            Post Within Nigeria
          </p>

          <div className="mt-2">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-900">
              {displayBody}
            </p>
            {needsTruncate ? (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            ) : null}
          </div>

          <div className="mt-3 flex max-w-md items-center justify-between text-gray-500">
            <PulseActionButton
              label="Comment"
              onClick={() => onComment?.()}
              className="hover:bg-brand-50 hover:text-brand-600"
            >
              <Message size={18} />
            </PulseActionButton>
            <PulseActionButton
              label="Repost"
              onClick={() => onRepost?.()}
              className="hover:bg-success-50 hover:text-success-600"
            >
              <ArrowRotateLeft size={18} />
            </PulseActionButton>
            <PulseActionButton
              label={liked ? "Unlike" : "Like"}
              onClick={() => {
                setLiked((prev) => !prev);
                setLikes((prev) => (liked ? prev - 1 : prev + 1));
                onLike?.();
              }}
              className={`hover:bg-error-50 hover:text-error-500 ${
                liked ? "text-error-500" : ""
              }`}
            >
              <Like1 size={18} variant={liked ? "Bold" : "Linear"} />
              <span>{likes}</span>
            </PulseActionButton>
            <PulseActionButton
              label="Share"
              onClick={handleShare}
              className="hover:bg-brand-50 hover:text-brand-600"
            >
              <Share size={18} />
            </PulseActionButton>
          </div>
        </div>
      </div>
    </article>
  );
}
