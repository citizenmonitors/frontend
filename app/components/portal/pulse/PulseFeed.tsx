"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { getPulsePosts, togglePulsePostLike } from "@/app/redux/features/pulseSlice";
import { PulsePost } from "@/app/redux/types";
import formatString from "@/app/utils/formatString";
import { Button, Spin } from "antd";
import { MessageText1 } from "iconsax-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CreatePulsePostModal from "./CreatePulsePostModal";
import PulseCommentsModal from "./PulseCommentsModal";
import PulseEmptyState from "./PulseEmptyState";
import PulsePostCard from "./PulsePostCard";

export default function PulseFeed() {
  const dispatch = useAppDispatch();
  const pulseState = useAppSelector((state) => state.pulse);
  const userDetails = useAppSelector((state) => state.user.details!);
  const [createOpen, setCreateOpen] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  const wardLabel = userDetails.ward
    ? formatString.kebabToNormalCase(userDetails.ward)
    : "your ward";

  useEffect(() => {
    dispatch(getPulsePosts());
  }, [dispatch]);

  function handleLike(postId: string) {
    dispatch(togglePulsePostLike(postId));
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
  const missingWard = !userDetails.ward;

  return (
    <div className="relative">
      <header className="flex gap-3 md:items-center mb-1 md:mb-2">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Pulse
        </h2>
      </header>
      <p className="text-sm text-gray-500 lg:text-base mb-6 md:mb-7">
        Stay informed. Stay vigilant. Every update matters. Discussions are shared with
        citizens in {wardLabel}.
      </p>

      {missingWard && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Add your ward in{" "}
          <Link href="/portal/settings/coverage" className="font-semibold underline">
            Coverage Details
          </Link>{" "}
          to join ward discussions.
        </div>
      )}

      {loading ? (
        <div className="grid place-content-center py-20">
          <Spin size="large" />
        </div>
      ) : hasPosts ? (
        <div className="grid gap-5 pb-24">
          {pulseState.posts.map((post) => (
            <PulsePostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={setCommentsPostId}
              onShare={handleShare}
              liking={pulseState.status.likePost === "pending"}
            />
          ))}
        </div>
      ) : (
        <PulseEmptyState />
      )}

      <Button
        type="primary"
        size="large"
        className="!fixed md:!absolute bottom-24 md:bottom-8 right-6 md:right-0 !h-12 !px-5 !rounded-full shadow-lg z-10"
        icon={<MessageText1 size={18} />}
        onClick={() => setCreateOpen(true)}
        disabled={missingWard}
      >
        Post
      </Button>

      <CreatePulsePostModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <PulseCommentsModal
        postId={commentsPostId}
        open={!!commentsPostId}
        onClose={() => setCommentsPostId(null)}
      />
    </div>
  );
}
