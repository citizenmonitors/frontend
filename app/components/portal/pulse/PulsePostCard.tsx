"use client";

import { PulsePost } from "@/app/redux/types";
import {
  formatPulseTimeAgo,
  getPulsePostLocationLabel,
  isPureRepost,
} from "@/app/utils/pulseUtils";
import { Image as AntImage } from "antd";
import {
  ArrowRotateLeft,
  Copy,
  Flag,
  Like1,
  Link21,
  Message,
  More,
  Profile,
  Share,
  TickCircle,
} from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";

type PulsePostCardProps = {
  post: PulsePost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onRepost: (post: PulsePost) => void;
  onShare: (post: PulsePost) => void;
  onCopyLink?: (post: PulsePost) => void;
  onCopyText?: (post: PulsePost) => void;
  onReport?: (post: PulsePost) => void;
  liking?: boolean;
};

function toHandle(name: string) {
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 14);
  return `@${cleaned || "citizen"}`;
}

export default function PulsePostCard({
  post,
  onLike,
  onComment,
  onRepost,
  onShare,
  onCopyLink,
  onCopyText,
  onReport,
  liking = false,
}: PulsePostCardProps) {
  const displayName = post.author.displayName;
  const handle = toHandle(displayName);
  const timeLabel = formatPulseTimeAgo(post.createdAt);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pureRepost = isPureRepost(post);
  const quoted = post.quotedPost;

  useEffect(() => {
    if (!menuOpen) return;
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  function runMenuAction(action?: (post: PulsePost) => void) {
    action?.(post);
    setMenuOpen(false);
  }

  return (
    <article className="min-w-0 border-b border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50/70 sm:px-5 sm:py-4">
      {pureRepost ? (
        <p className="mb-2 flex items-center gap-1.5 pl-12 text-xs font-medium text-gray-500">
          <ArrowRotateLeft size={14} />
          {displayName} reposted
        </p>
      ) : null}

      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-content-center overflow-hidden rounded-full border border-gray-200 bg-brand-25 sm:h-11 sm:w-11">
          <Profile size={20} className="text-brand-500" variant="Bold" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
                <span className="truncate font-bold text-gray-900">
                  {displayName}
                </span>
                {!post.author.usedAnonymous ? (
                  <TickCircle
                    size={16}
                    className="shrink-0 text-brand-500"
                    variant="Bold"
                  />
                ) : null}
                <span className="truncate text-gray-500">{handle}</span>
                <span className="text-gray-400">·</span>
                <span className="shrink-0 text-gray-500">{timeLabel}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-brand-600">
                {getPulsePostLocationLabel(post)}
              </p>
            </div>
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                className="grid h-8 w-8 place-content-center rounded-full text-gray-400 hover:bg-brand-50 hover:text-brand-600"
                aria-label="More options"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <More size={18} />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => runMenuAction(onCopyText)}
                  >
                    <Copy size={16} />
                    Copy post text
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => runMenuAction(onCopyLink)}
                  >
                    <Link21 size={16} />
                    Copy link
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => runMenuAction(onShare)}
                  >
                    <Share size={16} />
                    Share post
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-error-600 hover:bg-error-50"
                    onClick={() => runMenuAction(onReport)}
                  >
                    <Flag size={16} />
                    Report post
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {!pureRepost && post.body.trim() ? (
            <p className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-900">
              {post.body}
            </p>
          ) : null}

          {!pureRepost && post.imageUrl ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200">
              <AntImage
                src={post.imageUrl}
                alt="Post attachment"
                className="!max-h-[320px] !w-full !object-cover"
                wrapperClassName="block w-full"
                style={{ cursor: "zoom-in" }}
              />
            </div>
          ) : null}

          {quoted ? (
            <div
              className={`overflow-hidden rounded-2xl border border-gray-200 bg-white ${
                pureRepost ? "mt-2" : "mt-3"
              }`}
            >
              <div className="p-3">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
                  <span className="truncate font-semibold text-gray-900">
                    {quoted.author.displayName}
                  </span>
                  <span className="truncate text-gray-500">
                    {toHandle(quoted.author.displayName)}
                  </span>
                  {quoted.createdAt ? (
                    <>
                      <span className="text-gray-400">·</span>
                      <span className="shrink-0 text-gray-500">
                        {formatPulseTimeAgo(quoted.createdAt)}
                      </span>
                    </>
                  ) : null}
                </div>
                {quoted.locationLabel ? (
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {quoted.locationLabel}
                  </p>
                ) : null}
                <p className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-800">
                  {quoted.body}
                </p>
              </div>
              {quoted.imageUrl ? (
                <AntImage
                  src={quoted.imageUrl}
                  alt="Quoted post attachment"
                  className="!max-h-[240px] !w-full !object-cover"
                  wrapperClassName="block w-full border-t border-gray-200"
                  style={{ cursor: "zoom-in" }}
                />
              ) : null}
            </div>
          ) : null}

          <div className="mt-3 flex max-w-md items-center justify-between text-gray-500">
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-sm transition-colors hover:bg-brand-50 hover:text-brand-600"
              onClick={() => onComment(post.id)}
            >
              <Message size={18} />
              <span>{post.commentsCount || ""}</span>
            </button>

            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-sm transition-colors hover:bg-success-50 hover:text-success-600"
              onClick={() => onRepost(post)}
              aria-label="Repost"
            >
              <ArrowRotateLeft size={18} />
              <span>{post.repostsCount || ""}</span>
            </button>

            <button
              type="button"
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-sm transition-colors hover:bg-error-50 hover:text-error-500 ${
                post.isLikedByCurrentUser ? "text-error-500" : ""
              }`}
              onClick={() => onLike(post.id)}
              disabled={liking}
            >
              <Like1
                size={18}
                variant={post.isLikedByCurrentUser ? "Bold" : "Linear"}
              />
              <span>{post.likesCount || ""}</span>
            </button>

            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-sm transition-colors hover:bg-brand-50 hover:text-brand-600"
              onClick={() => onShare(post)}
              aria-label="Share"
            >
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
