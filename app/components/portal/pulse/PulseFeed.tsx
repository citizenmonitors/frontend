"use client";

import { cookieData } from "@/app/data/cookieData";
import { Button, Spin } from "antd";
import { MessageText1 } from "iconsax-react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { getPulsePosts, togglePulsePostLike } from "@/app/redux/features/pulseSlice";
import { validateSession } from "@/app/redux/features/userSlice";
import { PulsePost } from "@/app/redux/types";
import CreatePulsePostModal from "./CreatePulsePostModal";
import PulseCommentsModal from "./PulseCommentsModal";
import PulseEmptyState from "./PulseEmptyState";
import PulseLoginModal from "./PulseLoginModal";
import PulsePostCard from "./PulsePostCard";

type PendingAuthAction =
  | { type: "create" }
  | { type: "like"; postId: string }
  | { type: "comment"; postId: string }
  | { type: "generic" };

export default function PulseFeed() {
  const dispatch = useAppDispatch();
  const pulseState = useAppSelector((state) => state.pulse);
  const userDetails = useAppSelector((state) => state.user.details);
  const sessionStatus = useAppSelector((state) => state.user.status.validateSession);
  const [createOpen, setCreateOpen] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState(
    "Sign in to post, like, and comment on Pulse."
  );
  const [pendingAction, setPendingAction] = useState<PendingAuthAction | null>(
    null
  );

  useEffect(() => {
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
    }
  }, [userDetails, pendingAction, dispatch]);

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

  function handleShare(post: PulsePost) {
    const shareText = `${post.author.displayName}: ${post.body}`;
    if (navigator.share) {
      navigator.share({ title: "Pulse discussion", text: shareText }).catch(() => undefined);
      return;
    }
    navigator.clipboard?.writeText(shareText);
    dispatch(showAlert({ message: "Post copied to clipboard.", type: "success" }));
  }

  function handleLoginSuccess() {
    setLoginOpen(false);
  }

  function handleLoginClose() {
    setLoginOpen(false);
    setPendingAction(null);
  }

  const loading =
    pulseState.status.getPosts === "pending" && pulseState.posts.length === 0;
  const hasPosts = pulseState.posts.length > 0;

  return (
    <div className="relative min-w-0">
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="font-league text-2xl font-semibold leading-tight text-gray-700 sm:text-display-xs lg:text-display-base">
          Pulse
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-gray-500 md:mt-2 md:text-base">
          Stay informed. Stay vigilant. Every update matters. Open discussions for
          citizens across Nigeria.
        </p>
      </div>

      <div className="mb-5 sm:mb-6 md:mb-8">
        <PulseEmptyState />
      </div>

      {loading ? (
        <div className="grid place-content-center py-12 sm:py-16">
          <Spin size="large" />
        </div>
      ) : hasPosts ? (
        <div className="grid gap-4 pb-28 sm:gap-5 sm:pb-24">
          {pulseState.posts.map((post) => (
            <PulsePostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleOpenComments}
              onShare={handleShare}
              liking={pulseState.status.likePost === "pending"}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 pb-8 pt-2 sm:pb-10">
          <p className="text-center text-sm text-gray-500">
            No posts yet. Be the first to share an update.
          </p>
          <Button
            type="primary"
            size="large"
            className="!flex !h-12 !items-center !justify-center !rounded-full !px-6 !shadow-md"
            icon={<MessageText1 size={18} />}
            onClick={handleOpenCreate}
          >
            Post
          </Button>
        </div>
      )}

      {hasPosts ? (
        <Button
          type="primary"
          size="large"
          className="!fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-[45] !flex !h-12 !min-w-12 !items-center !justify-center !rounded-full !px-4 !shadow-lg sm:right-6 sm:!px-5 md:right-8 lg:right-[max(2rem,calc((100vw-800px)/2+1rem))]"
          icon={<MessageText1 size={18} />}
          onClick={handleOpenCreate}
          aria-label="Create a Pulse post"
        >
          <span className="hidden sm:inline">Post</span>
        </Button>
      ) : null}

      {userDetails ? (
        <CreatePulsePostModal open={createOpen} onClose={() => setCreateOpen(false)} />
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
