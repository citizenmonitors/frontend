"use client";

import { cookieData } from "@/app/data/cookieData";
import { Button, Spin } from "antd";
import { MessageText1 } from "iconsax-react";
import Cookies from "js-cookie";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  getPulsePosts,
  hydratePulseFeedFromCache,
  togglePulsePostLike,
} from "@/app/redux/features/pulseSlice";
import { validateSession } from "@/app/redux/features/userSlice";
import { PulsePost } from "@/app/redux/types";
import {
  getLocationFilterEmptyMessage,
  postMatchesLocationFilter,
  PulseLocationFilter,
} from "@/app/utils/pulseUtils";
import CreatePulsePostModal from "./CreatePulsePostModal";
import PulseCommentsModal from "./PulseCommentsModal";
import PulseComposer from "./PulseComposer";
import PulseIntroPost from "./PulseIntroPost";
import PulseLocationTabs from "./PulseLocationTabs";
import PulseLoginModal from "./PulseLoginModal";
import PulsePostCard from "./PulsePostCard";
import PulseRepostModal from "./PulseRepostModal";

type PendingAuthAction =
  | { type: "create" }
  | { type: "like"; postId: string }
  | { type: "comment"; postId: string }
  | { type: "repost"; postId: string }
  | { type: "generic" };

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
      dispatch(togglePulsePostLike(action.postId));
      return;
    }
    if (action.type === "comment") {
      setCommentsPostId(action.postId);
      return;
    }
    if (action.type === "repost") {
      const target = pulseState.posts.find((p) => p.id === action.postId);
      if (target) setRepostPost(target);
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
    dispatch(togglePulsePostLike(postId));
  }

  function handleOpenCreate() {
    if (!requireAuth("post on Pulse", { type: "create" })) return;
    setCreateOpen(true);
  }

  function handleOpenComments(postId: string) {
    setCommentsPostId(postId);
  }

  function handleRepost(post: PulsePost) {
    if (!requireAuth("repost on Pulse", { type: "repost", postId: post.id })) {
      return;
    }
    setRepostPost(post);
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

  function handleReport() {
    dispatch(
      showAlert({
        message: "Thanks. Our team will review this post.",
        type: "success",
      })
    );
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
      pulseState.posts.filter((post) =>
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

  return (
    <div className="relative min-w-0">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
        />

        <PulseComposer
          displayName={displayName}
          onOpenCompose={handleOpenCreate}
        />

        <PulseIntroPost />

        {loading ? (
          <div className="grid place-content-center py-16">
            <Spin size="large" />
          </div>
        ) : hasFilteredPosts ? (
          <div className="pb-6 sm:pb-4">
            {filteredPosts.map((post) => (
              <PulsePostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleOpenComments}
                onRepost={handleRepost}
                onShare={handleShare}
                onCopyText={handleCopyText}
                onCopyLink={handleCopyLink}
                onReport={handleReport}
                liking={pulseState.status.likePost === "pending"}
              />
            ))}
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
