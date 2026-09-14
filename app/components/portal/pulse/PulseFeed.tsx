"use client";

import { cookieData } from "@/app/data/cookieData";
import { Button, Spin } from "antd";
import { MessageText1 } from "iconsax-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { getPulsePosts, togglePulsePostLike } from "@/app/redux/features/pulseSlice";
import { validateSession } from "@/app/redux/features/userSlice";
import { PulsePost } from "@/app/redux/types";
import { buildLoginHref } from "@/app/utils/authRedirect";
import CreatePulsePostModal from "./CreatePulsePostModal";
import PulseCommentsModal from "./PulseCommentsModal";
import PulseEmptyState from "./PulseEmptyState";
import PulsePostCard from "./PulsePostCard";

const PULSE_LOGIN_HREF = buildLoginHref("/pulse");

export default function PulseFeed() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pulseState = useAppSelector((state) => state.pulse);
  const userDetails = useAppSelector((state) => state.user.details);
  const sessionStatus = useAppSelector((state) => state.user.status.validateSession);
  const [createOpen, setCreateOpen] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getPulsePosts());
  }, [dispatch]);

  useEffect(() => {
    if (!Cookies.get(cookieData.login.name)) return;
    if (sessionStatus === "pending" || sessionStatus === "fulfilled") return;
    dispatch(validateSession());
  }, [dispatch, sessionStatus]);

  function requireAuth(action: string) {
    if (userDetails) return true;
    if (Cookies.get(cookieData.login.name) && sessionStatus === "pending") {
      return false;
    }
    dispatch(
      showAlert({
        message: `Please log in to ${action}.`,
        type: "warning",
      })
    );
    router.push(PULSE_LOGIN_HREF);
    return false;
  }

  function handleLike(postId: string) {
    if (!requireAuth("like posts")) return;
    dispatch(togglePulsePostLike(postId));
  }

  function handleOpenCreate() {
    if (!requireAuth("post on Pulse")) return;
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

  const loading = pulseState.status.getPosts === "pending";
  const hasPosts = pulseState.posts.length > 0;

  return (
    <div className="relative min-w-0">
      <div className="sticky top-[72px] z-40 -mx-4 mb-5 border-b border-gray-200/80 bg-white/95 px-4 pb-3 pt-2 shadow-[0_8px_20px_rgba(16,24,40,0.06)] backdrop-blur-md sm:top-[76px] sm:-mx-6 sm:mb-6 sm:px-6 md:top-[68px] md:-mx-8 md:mb-8 md:px-8">
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
        <p className="pb-28 text-center text-sm text-gray-500 sm:pb-24">
          No posts yet. Be the first to share an update.
        </p>
      )}

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

      {userDetails ? (
        <CreatePulsePostModal open={createOpen} onClose={() => setCreateOpen(false)} />
      ) : null}
      <PulseCommentsModal
        postId={commentsPostId}
        open={!!commentsPostId}
        onClose={() => setCommentsPostId(null)}
        requireAuth={requireAuth}
      />
    </div>
  );
}
