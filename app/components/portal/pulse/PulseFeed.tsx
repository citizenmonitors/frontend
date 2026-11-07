"use client";

import { cookieData } from "@/app/data/cookieData";
import { Button, Modal, Spin } from "antd";
import { MessageText1 } from "iconsax-react";
import Cookies from "js-cookie";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  blockPulseAuthorOf,
  deletePulsePost,
  getPulsePosts,
  hydratePulseFeedFromCache,
  reportPulsePost,
  repostPulsePost,
  togglePulsePostLike,
  undoPulseRepost,
} from "@/app/redux/features/pulseSlice";
import { fetchPulsePost } from "@/app/data/pulseApi";
import { validateSession } from "@/app/redux/features/userSlice";
import { PulsePost, PulseReportReason } from "@/app/redux/types";
import {
  getLocationFilterEmptyMessage,
  postMatchesLocationFilter,
  PulseLocationFilter,
} from "@/app/utils/pulseUtils";
import CreatePulsePostModal from "./CreatePulsePostModal";
import PulseCommentsModal from "./PulseCommentsModal";
import PulseComposer from "./PulseComposer";
import PulseIntroPost, { getPulseIntroPost } from "./PulseIntroPost";
import PulseLocationTabs from "./PulseLocationTabs";
import PulseLoginModal from "./PulseLoginModal";
import PulsePostCard from "./PulsePostCard";
import PulseRepostModal from "./PulseRepostModal";
import PulseEditPostModal from "./PulseEditPostModal";
import PulseReportModal from "./PulseReportModal";

type PendingAuthAction =
  | { type: "create" }
  | { type: "like"; postId: string }
  | { type: "comment"; postId: string }
  | { type: "repost"; postId: string }
  | { type: "quote"; post: PulsePost }
  | { type: "generic" };

function errorMessage(error: unknown, fallback: string) {
  const message = (error as { message?: unknown })?.message;
  return typeof message === "string" && message ? message : fallback;
}

export default function PulseFeed() {
  const dispatch = useAppDispatch();
  const pulseState = useAppSelector((state) => state.pulse);
  const userDetails = useAppSelector((state) => state.user.details);
  const sessionStatus = useAppSelector((state) => state.user.status.validateSession);
  const [createOpen, setCreateOpen] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [repostPost, setRepostPost] = useState<PulsePost | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState(
    "Sign in to post, like, and comment on Pulse."
  );
  const [pendingAction, setPendingAction] = useState<PendingAuthAction | null>(
    null
  );
  const [locationFilter, setLocationFilter] =
    useState<PulseLocationFilter>("all");
  const [editPost, setEditPost] = useState<PulsePost | null>(null);
  const [reportPost, setReportPost] = useState<PulsePost | null>(null);
  /** Post opened from a shared /pulse?post=<id> link */
  const [sharedPostId, setSharedPostId] = useState<string | null>(null);
  const [sharedPost, setSharedPost] = useState<PulsePost | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("post");
    if (id) setSharedPostId(id);
  }, []);

  useEffect(() => {
    if (!sharedPostId) return;
    let cancelled = false;
    fetchPulsePost(sharedPostId)
      .then((post) => {
        if (!cancelled) setSharedPost(post);
      })
      .catch(() => {
        if (cancelled) return;
        setSharedPostId(null);
        dispatch(showAlert({ message: "This post is unavailable.", type: "info" }));
      });
    return () => {
      cancelled = true;
    };
    // Refetch when the user signs in so ownership/like flags are right
  }, [sharedPostId, userDetails?.email, dispatch]);

  useLayoutEffect(() => {
    // Hydrate from localStorage first (guests included), then fetch only if stale
    dispatch(hydratePulseFeedFromCache());
    dispatch(getPulsePosts());
  }, [dispatch]);

  useEffect(() => {
    if (!Cookies.get(cookieData.login.name)) return;
    if (sessionStatus === "pending" || sessionStatus === "fulfilled") return;
    dispatch(validateSession());
  }, [dispatch, sessionStatus]);

  useEffect(() => {
    if (!userDetails || !pendingAction) return;

    const action = pendingAction;
    setPendingAction(null);

    if (action.type === "create") {
      setCreateOpen(true);
      return;
    }
    if (action.type === "like") {
      if (action.postId === "pulse-intro-ade") return;
      dispatch(togglePulsePostLike(action.postId));
      return;
    }
    if (action.type === "comment") {
      setCommentsPostId(action.postId);
      return;
    }
    if (action.type === "repost") {
      runRepost(action.postId);
      return;
    }
    if (action.type === "quote") {
      setRepostPost(action.post);
    }
  }, [userDetails, pendingAction, dispatch, pulseState.posts]);

  function requireAuth(action: string, pending?: PendingAuthAction) {
    if (userDetails) return true;
    if (Cookies.get(cookieData.login.name) && sessionStatus === "pending") {
      return false;
    }
    setLoginMessage(`Please log in to ${action}.`);
    setPendingAction(pending ?? { type: "generic" });
    setLoginOpen(true);
    return false;
  }

  function handleLocationFilterChange(next: PulseLocationFilter) {
    if (next !== "all" && !userDetails) {
      setLoginMessage(
        "Sign in to filter Pulse by your State, LGA, Ward, or Polling Unit."
      );
      setPendingAction({ type: "generic" });
      setLoginOpen(true);
      return;
    }
    setLocationFilter(next);
  }

  function handleLike(postId: string) {
    if (!requireAuth("like posts", { type: "like", postId })) return;
    dispatch(togglePulsePostLike(postId))
      .unwrap()
      .then((update) =>
        // The shared post may not be in the loaded feed; keep its card in sync
        setSharedPost((current) =>
          current && current.id === update.postId
            ? {
                ...current,
                likesCount: update.likesCount,
                isLikedByCurrentUser: update.isLikedByCurrentUser,
              }
            : current
        )
      )
      .catch(() => undefined);
  }

  function handleOpenCreate() {
    if (!requireAuth("post on Pulse", { type: "create" })) return;
    setCreateOpen(true);
  }

  function handleOpenComments(postId: string) {
    setCommentsPostId(postId);
  }

  function runRepost(targetId: string) {
    dispatch(repostPulsePost(targetId))
      .unwrap()
      .then(() => dispatch(showAlert({ message: "Reposted.", type: "success" })))
      .catch((error) =>
        dispatch(
          showAlert({ message: errorMessage(error, "Could not repost."), type: "error" })
        )
      );
  }

  function handleRepost(targetId: string) {
    if (!requireAuth("repost on Pulse", { type: "repost", postId: targetId })) return;
    runRepost(targetId);
  }

  function handleUndoRepost(targetId: string) {
    if (!requireAuth("repost on Pulse")) return;
    dispatch(undoPulseRepost(targetId))
      .unwrap()
      .catch((error) =>
        dispatch(
          showAlert({ message: errorMessage(error, "Could not undo repost."), type: "error" })
        )
      );
  }

  function handleQuote(post: PulsePost) {
    if (!requireAuth("quote posts on Pulse", { type: "quote", post })) return;
    setRepostPost(post);
  }

  function handleEdit(post: PulsePost) {
    setEditPost(post);
  }

  function handleDelete(post: PulsePost) {
    Modal.confirm({
      title: "Delete this post?",
      content: "Its comments and plain reposts will be removed too. This can't be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () =>
        dispatch(deletePulsePost(post.id))
          .unwrap()
          .then(() => {
            if (sharedPost?.id === post.id) setSharedPost(null);
            dispatch(showAlert({ message: "Post deleted.", type: "success" }));
          })
          .catch((error) =>
            dispatch(
              showAlert({ message: errorMessage(error, "Could not delete post."), type: "error" })
            )
          ),
    });
  }

  function handleBlock(post: PulsePost) {
    if (!requireAuth("block users")) return;
    Modal.confirm({
      title: `Block ${post.author.displayName || "this user"}?`,
      content:
        "You won't see each other's posts, reposts or comments, and they can't interact with you. You can unblock them in Settings.",
      okText: "Block",
      okButtonProps: { danger: true },
      onOk: () =>
        dispatch(blockPulseAuthorOf({ postId: post.id }))
          .unwrap()
          .then(() => {
            if (sharedPost?.id === post.id) setSharedPost(null);
            dispatch(showAlert({ message: "User blocked.", type: "success" }));
            dispatch(getPulsePosts({ force: true }));
          })
          .catch((error) =>
            dispatch(
              showAlert({ message: errorMessage(error, "Could not block user."), type: "error" })
            )
          ),
    });
  }

  async function submitReport(reason: PulseReportReason, details?: string) {
    if (!reportPost) return;
    try {
      await dispatch(reportPulsePost({ postId: reportPost.id, reason, details })).unwrap();
      if (sharedPost?.id === reportPost.id) setSharedPost(null);
      dispatch(showAlert({ message: "Thanks. Our team will review this post.", type: "success" }));
      setReportPost(null);
    } catch (error) {
      dispatch(
        showAlert({ message: errorMessage(error, "Could not send report."), type: "error" })
      );
    }
  }

  function handleShare(post: PulsePost) {
    const shareText = `${post.author.displayName}: ${post.body}`;
    if (navigator.share) {
      navigator.share({ title: "Pulse discussion", text: shareText }).catch(() => undefined);
      return;
    }
    navigator.clipboard?.writeText(shareText);
    dispatch(showAlert({ message: "Post copied to clipboard.", type: "success" }));
  }

  function handleCopyText(post: PulsePost) {
    navigator.clipboard?.writeText(post.body);
    dispatch(showAlert({ message: "Post text copied.", type: "success" }));
  }

  function handleCopyLink(post: PulsePost) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/pulse?post=${encodeURIComponent(post.id)}`
        : `/pulse?post=${post.id}`;
    navigator.clipboard?.writeText(url);
    dispatch(showAlert({ message: "Post link copied.", type: "success" }));
  }

  function handleReport(post: PulsePost) {
    if (!requireAuth("report posts")) return;
    setReportPost(post);
  }

  function handleLoginSuccess() {
    setLoginOpen(false);
  }

  function handleLoginClose() {
    setLoginOpen(false);
    setPendingAction(null);
  }

  const userLocation = userDetails
    ? {
        state: userDetails.state,
        lga: userDetails.lga,
        ward: userDetails.ward,
        pollingUnit: userDetails.pollingUnit,
      }
    : null;

  const filteredPosts = useMemo(
    () =>
      pulseState.posts.filter(
        (post) =>
          post &&
          post.id &&
          postMatchesLocationFilter(post, locationFilter, userLocation)
      ),
    [pulseState.posts, locationFilter, userLocation]
  );

  const loading =
    pulseState.status.getPosts === "pending" && pulseState.posts.length === 0;
  const hasAnyPosts = pulseState.posts.length > 0;
  const hasFilteredPosts = filteredPosts.length > 0;
  const displayName = userDetails
    ? `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim() ||
      userDetails.anonymousUsername
    : undefined;

  function renderPost(post: PulsePost) {
    return (
      <PulsePostCard
        key={post.id}
        post={post}
        onLike={handleLike}
        onComment={handleOpenComments}
        onRepost={handleRepost}
        onUndoRepost={handleUndoRepost}
        onQuote={handleQuote}
        onShare={handleShare}
        onCopyText={handleCopyText}
        onCopyLink={handleCopyLink}
        onReport={handleReport}
        onBlock={handleBlock}
        onEdit={handleEdit}
        onDelete={handleDelete}
        findPost={(id) => pulseState.posts.find((p) => p.id === id)}
        liking={false}
      />
    );
  }

  return (
    <div className="relative min-w-0">
      <div className="overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3 sm:px-5">
          <h1 className="font-league text-xl font-bold text-gray-900 sm:text-2xl">
            Pulse
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Community updates from citizens across Nigeria
          </p>
        </div>

        <PulseLocationTabs
          value={locationFilter}
          onChange={handleLocationFilterChange}
          userState={userDetails?.state}
          userLga={userDetails?.lga}
          userWard={userDetails?.ward}
          userPollingUnit={userDetails?.pollingUnit}
        />

        <PulseComposer
          displayName={displayName}
          requireAuth={() =>
            requireAuth("post on Pulse", { type: "create" })
          }
        />

        {sharedPost ? (
          <div className="border-b-4 border-brand-50">
            <div className="flex items-center justify-between px-4 pt-3 text-xs font-semibold uppercase tracking-wide text-brand-600 sm:px-5">
              Shared post
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSharedPost(null);
                  setSharedPostId(null);
                }}
              >
                Close
              </button>
            </div>
            {renderPost(pulseState.posts.find((p) => p.id === sharedPost.id) ?? sharedPost)}
          </div>
        ) : null}

        <PulseIntroPost
          onComment={() => handleOpenCreate()}
          onRepost={() => handleQuote(getPulseIntroPost())}
        />

        {pulseState.status.getPosts === "rejected" && !hasAnyPosts ? (
          <div className="px-4 py-3 text-center text-sm text-gray-500 sm:px-5">
            {pulseState.error.message ||
              "Couldn't load Pulse right now. You can still post an update."}
          </div>
        ) : null}

        {loading ? (
          <div className="grid place-content-center py-16">
            <Spin size="large" />
          </div>
        ) : hasFilteredPosts ? (
          <div className="pb-6 sm:pb-4">
            {filteredPosts.map((post) => renderPost(post))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
            <p className="max-w-sm text-sm text-gray-500">
              {locationFilter === "all"
                ? "Be the next voice after Ade — share what’s happening in your community."
                : getLocationFilterEmptyMessage(locationFilter, userLocation)}
            </p>
            {locationFilter !== "all" && hasAnyPosts ? (
              <button
                type="button"
                onClick={() => setLocationFilter("all")}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Show all posts
              </button>
            ) : (
              <Button
                type="primary"
                size="large"
                className="!flex !h-11 !items-center !rounded-full !px-5"
                icon={<MessageText1 size={18} />}
                onClick={handleOpenCreate}
              >
                Post an update
              </Button>
            )}
          </div>
        )}
      </div>

      {userDetails ? (
        <CreatePulsePostModal open={createOpen} onClose={() => setCreateOpen(false)} />
      ) : null}
      {userDetails ? (
        <PulseRepostModal
          open={!!repostPost}
          post={repostPost}
          onClose={() => setRepostPost(null)}
        />
      ) : null}
      <PulseEditPostModal post={editPost} onClose={() => setEditPost(null)} />
      <PulseReportModal
        open={Boolean(reportPost)}
        kind="post"
        onClose={() => setReportPost(null)}
        onSubmit={submitReport}
      />
      <PulseCommentsModal
        postId={commentsPostId}
        open={!!commentsPostId}
        onClose={() => setCommentsPostId(null)}
        requireAuth={(action) =>
          requireAuth(
            action,
            commentsPostId
              ? { type: "comment", postId: commentsPostId }
              : { type: "generic" }
          )
        }
      />
      <PulseLoginModal
        open={loginOpen}
        onClose={handleLoginClose}
        onSuccess={handleLoginSuccess}
        contextMessage={loginMessage}
      />
    </div>
  );
}
