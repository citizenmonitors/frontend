"use client";

import { PulsePost } from "@/app/redux/types";
import {
  formatPulseDateTime,
  formatPulseTimeAgo,
  getPulsePostLocationLabel,
  getPulseRepostTotal,
  isPureRepost,
  shouldTruncatePulseBody,
  truncatePulseBody,
} from "@/app/utils/pulseUtils";
import { Image as AntImage, Dropdown } from "antd";
import PulseActionButton from "./PulseActionButton";
import {
  ArrowRotateLeft,
  Copy,
  Edit2,
  Flag,
  MessageEdit,
  Slash,
  Trash,
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
  /** Plain repost of `targetId` (the original when this is a plain repost) */
  onRepost: (targetId: string) => void;
  onUndoRepost?: (targetId: string) => void;
  /** Quote `target` (the original when this is a plain repost) */
  onQuote: (target: PulsePost) => void;
  onShare: (post: PulsePost) => void;
  onCopyLink?: (post: PulsePost) => void;
  onCopyText?: (post: PulsePost) => void;
  onReport?: (post: PulsePost) => void;
  onBlock?: (post: PulsePost) => void;
  onEdit?: (post: PulsePost) => void;
  onDelete?: (post: PulsePost) => void;
  /** Feed lookup so a plain repost can show the original's repost state */
  findPost?: (postId: string) => PulsePost | undefined;
  liking?: boolean;
};

function Avatar({ url, size }: { url?: string | null; size: number }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="h-full w-full object-cover" />;
  }
  return <Profile size={size} className="text-brand-500" variant="Bold" />;
}

function toHandle(name?: string | null) {
  const cleaned = String(name || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 14);
  return `@${cleaned || "citizen"}`;
}

export default function PulsePostCard({
  post,
  onLike,
  onComment,
  onRepost,
  onUndoRepost,
  onQuote,
  onShare,
  onCopyLink,
  onCopyText,
  onReport,
  onBlock,
  onEdit,
  onDelete,
  findPost,
  liking = false,
}: PulsePostCardProps) {
  const displayName = post.author?.displayName || "Citizen";
  const handle = toHandle(displayName);
  const timeAgo = formatPulseTimeAgo(post.createdAt);
  const fullDateTime = formatPulseDateTime(post.createdAt);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bodyExpanded, setBodyExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pureRepost = isPureRepost(post);
  const quoted = post.quotedPost;
  const isOwner = Boolean(post.isOwnedByCurrentUser);
  // Reposting a plain repost reposts its original
  const repostTarget: PulsePost =
    pureRepost && quoted && !quoted.unavailable
      ? findPost?.(quoted.id) ?? {
          ...post,
          id: quoted.id,
          body: quoted.body,
          imageUrl: quoted.imageUrl,
          author: quoted.author,
          createdAt: quoted.createdAt,
          locationLabel: quoted.locationLabel,
          quotedPost: null,
          isRepost: false,
          isQuote: Boolean(quoted.isQuote),
          isOwnedByCurrentUser: quoted.isOwnedByCurrentUser,
        }
      : post;
  const reposted = Boolean(
    repostTarget.isRepostedByCurrentUser || (pureRepost && isOwner)
  );
  const originalIsMine = Boolean(quoted?.isOwnedByCurrentUser);
  // Hide Report/Block on your own content, including reposts of your own post
  const canReport = !isOwner && !(pureRepost && originalIsMine);
  const repostTotal = getPulseRepostTotal(repostTarget);
  const bodyNeedsTruncate = shouldTruncatePulseBody(post.body);
  const displayBody =
    bodyExpanded || !bodyNeedsTruncate
      ? post.body
      : truncatePulseBody(post.body);

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
          <Avatar url={(pureRepost ? quoted?.author : post.author)?.avatarUrl} size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
                <span className="truncate font-bold text-gray-900">
                  {displayName}
                </span>
                {!post.author?.usedAnonymous ? (
                  <TickCircle
                    size={16}
                    className="shrink-0 text-brand-500"
                    variant="Bold"
                  />
                ) : null}
                <span className="truncate text-gray-500">{handle}</span>
                {timeAgo ? (
                  <>
                    <span className="text-gray-400">·</span>
                    <time
                      className="shrink-0 text-gray-500"
                      dateTime={post.createdAt}
                      title={fullDateTime || undefined}
                    >
                      {timeAgo}
                    </time>
                  </>
                ) : null}
                {post.editedAt && !pureRepost ? (
                  <span className="text-xs text-gray-400" title={formatPulseDateTime(post.editedAt) || undefined}>
                    · Edited
                  </span>
                ) : null}
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
                  {isOwner && !pureRepost && onEdit ? (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => runMenuAction(onEdit)}
                    >
                      <Edit2 size={16} />
                      Edit post
                    </button>
                  ) : null}
                  {isOwner && pureRepost && quoted && onUndoRepost ? (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        onUndoRepost(quoted.id);
                        setMenuOpen(false);
                      }}
                    >
                      <ArrowRotateLeft size={16} />
                      Undo repost
                    </button>
                  ) : null}
                  {isOwner && !pureRepost && onDelete ? (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-error-600 hover:bg-error-50"
                      onClick={() => runMenuAction(onDelete)}
                    >
                      <Trash size={16} />
                      Delete post
                    </button>
                  ) : null}
                  {canReport && onReport ? (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-error-600 hover:bg-error-50"
                      onClick={() => runMenuAction(onReport)}
                    >
                      <Flag size={16} />
                      Report post
                    </button>
                  ) : null}
                  {canReport && onBlock ? (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-error-600 hover:bg-error-50"
                      onClick={() => runMenuAction(onBlock)}
                    >
                      <Slash size={16} />
                      Block author
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          {!pureRepost && (post.body || "").trim() ? (
            <div className="mt-2">
              <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-900 [font-family:inherit,'Apple_Color_Emoji','Segoe_UI_Emoji','Noto_Color_Emoji']">
                {displayBody}
              </p>
              {bodyNeedsTruncate ? (
                <button
                  type="button"
                  onClick={() => setBodyExpanded((prev) => !prev)}
                  className="mt-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  {bodyExpanded ? "Show less" : "Read more"}
                </button>
              ) : null}
            </div>
          ) : null}

          {!pureRepost && post.imageUrl ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200">
              <AntImage
                src={post.imageUrl}
                alt="Post attachment"
                className="!max-h-[320px] !w-full !object-contain !bg-gray-50"
                wrapperClassName="block w-full"
                style={{ cursor: "zoom-in" }}
              />
            </div>
          ) : null}

          {quoted?.unavailable ? (
            <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-4 text-sm text-gray-500">
              This post is unavailable.
            </div>
          ) : quoted ? (
            <div
              className={`overflow-hidden rounded-2xl border border-gray-200 bg-white ${
                pureRepost ? "mt-2" : "mt-3"
              }`}
            >
              <div className="p-3">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
                  <span className="truncate font-semibold text-gray-900">
                    {quoted.author?.displayName || "Citizen"}
                  </span>
                  <span className="truncate text-gray-500">
                    {toHandle(quoted.author?.displayName)}
                  </span>
                  {quoted.createdAt ? (
                    <>
                      <span className="text-gray-400">·</span>
                      <time
                        className="shrink-0 text-gray-500"
                        dateTime={quoted.createdAt}
                        title={formatPulseDateTime(quoted.createdAt) || undefined}
                      >
                        {formatPulseTimeAgo(quoted.createdAt)}
                      </time>
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
            <PulseActionButton
              label="Comment"
              onClick={() => onComment(post.id)}
              className="hover:bg-brand-50 hover:text-brand-600"
            >
              <Message size={18} />
              <span>{post.commentsCount || ""}</span>
            </PulseActionButton>

            {quoted?.unavailable && pureRepost ? (
              <span className="w-10" />
            ) : (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: [
                    reposted
                      ? {
                          key: "undo",
                          icon: <ArrowRotateLeft size={16} />,
                          label: "Undo repost",
                          onClick: () => onUndoRepost?.(repostTarget.id),
                        }
                      : {
                          key: "repost",
                          icon: <ArrowRotateLeft size={16} />,
                          label: "Repost",
                          onClick: () => onRepost(repostTarget.id),
                        },
                    {
                      key: "quote",
                      icon: <MessageEdit size={16} />,
                      label: "Quote",
                      onClick: () => onQuote(repostTarget),
                    },
                  ],
                }}
              >
                <span>
                  <PulseActionButton
                    label={reposted ? "Reposted" : "Repost"}
                    className={`hover:bg-success-50 hover:text-success-600 ${
                      reposted ? "text-success-600" : ""
                    }`}
                  >
                    <ArrowRotateLeft size={18} />
                    <span>{repostTotal || ""}</span>
                  </PulseActionButton>
                </span>
              </Dropdown>
            )}

            <PulseActionButton
              label={post.isLikedByCurrentUser ? "Unlike" : "Like"}
              onClick={() => onLike(post.id)}
              disabled={liking}
              className={`hover:bg-error-50 hover:text-error-500 ${
                post.isLikedByCurrentUser ? "text-error-500" : ""
              }`}
            >
              <Like1
                size={18}
                variant={post.isLikedByCurrentUser ? "Bold" : "Linear"}
              />
              <span>{post.likesCount || ""}</span>
            </PulseActionButton>

            <PulseActionButton
              label="Share"
              onClick={() => onShare(post)}
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
