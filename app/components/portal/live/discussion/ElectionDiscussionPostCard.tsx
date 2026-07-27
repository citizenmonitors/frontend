"use client";

import ElectionDiscussionMediaCollage from "@/app/components/portal/live/discussion/ElectionDiscussionMediaCollage";
import { ElectionDiscussionPost } from "@/app/redux/types";
import { formatPulseTimeAgo } from "@/app/utils/pulseUtils";
import { Like1, Message, Profile, Share } from "iconsax-react";
import React from "react";

type ElectionDiscussionPostCardProps = {
  post: ElectionDiscussionPost;
  electionLabel: string;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (post: ElectionDiscussionPost) => void;
  liking?: boolean;
};

export default function ElectionDiscussionPostCard({
  post,
  electionLabel,
  onLike,
  onComment,
  onShare,
  liking = false,
}: ElectionDiscussionPostCardProps) {
  return (
    <article className="rounded-2xl bg-[#FFFDF8] border border-gray-200 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-full bg-brand-25 border border-brand-200 grid place-content-center overflow-hidden">
            <Profile size={20} className="text-brand-500" variant="Bold" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate">{post.author.displayName}</p>
            <p className="text-xs text-error-500 flex items-center gap-1 truncate">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-error-500 shrink-0" />
              {electionLabel}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {formatPulseTimeAgo(post.createdAt)}
        </span>
      </div>

      <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
        {post.body}
      </p>

      <ElectionDiscussionMediaCollage
        imageUrls={post.imageUrls}
        videoUrls={post.videoUrls}
      />

      <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-200 text-sm text-gray-600">
        <button
          type="button"
          className={`flex items-center gap-2 transition-colors ${
            post.isLikedByCurrentUser ? "text-brand-500" : "hover:text-brand-500"
          }`}
          onClick={() => onLike(post.id)}
          disabled={liking}
        >
          <Like1 size={18} variant={post.isLikedByCurrentUser ? "Bold" : "Linear"} />
          <span>{post.likesCount} Likes</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 hover:text-brand-500 transition-colors"
          onClick={() => onComment(post.id)}
        >
          <Message size={18} />
          <span>{post.commentsCount} Comments</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 hover:text-brand-500 transition-colors"
          onClick={() => onShare(post)}
        >
          <Share size={18} />
          <span>{post.sharesCount > 0 ? `${post.sharesCount} Shares` : "Share"}</span>
        </button>
      </div>
    </article>
  );
}
