"use client";

import { PulsePost } from "@/app/redux/types";
import { formatPulseTimeAgo, getPulsePostLocationLabel } from "@/app/utils/pulseUtils";
import { Image as AntImage } from "antd";
import { Like1, Message, Profile, Share } from "iconsax-react";
import React from "react";

type PulsePostCardProps = {
  post: PulsePost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (post: PulsePost) => void;
  liking?: boolean;
};

export default function PulsePostCard({
  post,
  onLike,
  onComment,
  onShare,
  liking = false,
}: PulsePostCardProps) {
  const displayName = post.author.displayName;

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-[#FFFDF8] p-3.5 sm:rounded-2xl sm:p-4 md:p-5">
      <div className="mb-3 flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="grid h-9 w-9 shrink-0 place-content-center overflow-hidden rounded-full border border-brand-200 bg-brand-25 sm:h-10 sm:w-10">
            <Profile size={18} className="text-brand-500 sm:hidden" variant="Bold" />
            <Profile size={20} className="hidden text-brand-500 sm:block" variant="Bold" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800 sm:text-base">
              {displayName}
            </p>
            <p className="flex items-center gap-1 truncate text-[11px] text-error-500 sm:text-xs">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-error-500" />
              {getPulsePostLocationLabel(post)}
            </p>
          </div>
        </div>
        <span className="shrink-0 pt-0.5 text-[11px] text-gray-400 sm:text-xs">
          {formatPulseTimeAgo(post.createdAt)}
        </span>
      </div>

      <p className="mb-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700 sm:mb-4 md:text-base">
        {post.body}
      </p>

      {post.imageUrl && (
        <div className="mb-3 flex justify-center sm:mb-4">
          <AntImage
            src={post.imageUrl}
            alt="Post attachment"
            className="!max-h-[220px] !w-auto !max-w-full rounded-lg object-contain sm:!max-h-[280px] sm:rounded-xl"
            wrapperClassName="flex max-w-full justify-center overflow-hidden rounded-lg bg-gray-100 sm:max-w-[420px] sm:rounded-xl"
            style={{ cursor: "zoom-in" }}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-1 border-t border-gray-200 pt-2.5 text-xs text-gray-600 sm:gap-4 sm:pt-3 sm:text-sm">
        <button
          type="button"
          className={`inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-1 transition-colors sm:flex-none sm:justify-start sm:px-0 ${
            post.isLikedByCurrentUser ? "text-brand-500" : "hover:text-brand-500"
          }`}
          onClick={() => onLike(post.id)}
          disabled={liking}
        >
          <Like1 size={18} variant={post.isLikedByCurrentUser ? "Bold" : "Linear"} />
          <span className="truncate">
            <span className="sm:hidden">{post.likesCount}</span>
            <span className="hidden sm:inline">{post.likesCount} Likes</span>
          </span>
        </button>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-1 transition-colors hover:text-brand-500 sm:flex-none sm:justify-start sm:px-0"
          onClick={() => onComment(post.id)}
        >
          <Message size={18} />
          <span className="truncate">
            <span className="sm:hidden">{post.commentsCount}</span>
            <span className="hidden sm:inline">{post.commentsCount} Comments</span>
          </span>
        </button>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-1 transition-colors hover:text-brand-500 sm:flex-none sm:justify-start sm:px-0"
          onClick={() => onShare(post)}
        >
          <Share size={18} />
          <span className="truncate">
            <span className="sm:hidden">Share</span>
            <span className="hidden sm:inline">Share</span>
          </span>
        </button>
      </div>
    </article>
  );
}
