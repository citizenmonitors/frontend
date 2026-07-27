"use client";

import CreateElectionDiscussionModal from "@/app/components/portal/live/discussion/CreateElectionDiscussionModal";
import ElectionDiscussionCommentsModal from "@/app/components/portal/live/discussion/ElectionDiscussionCommentsModal";
import ElectionDiscussionEmptyState from "@/app/components/portal/live/discussion/ElectionDiscussionEmptyState";
import ElectionDiscussionPostCard from "@/app/components/portal/live/discussion/ElectionDiscussionPostCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearElectionDiscussion,
  getElectionDiscussionPosts,
  toggleElectionDiscussionPostLike,
} from "@/app/redux/features/electionDiscussionSlice";
import { ElectionDiscussionPost } from "@/app/redux/types";
import formatString from "@/app/utils/formatString";
import getElectionName from "@/app/utils/getElectionName";
import { Spin } from "antd";
import { Message } from "iconsax-react";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export default function ElectionDiscussionTab() {
  const params = useParams<{ id: string }>();
  const activeElectionId = params.id;
  const dispatch = useAppDispatch();
  const discussionState = useAppSelector((state) => state.electionDiscussion);
  const liveElectionState = useAppSelector((state) => state.liveElection);
  const userDetails = useAppSelector((state) => state.user.details!);
  const [createOpen, setCreateOpen] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  const electionDetails = liveElectionState.data?.electionDetails;
  const electionLabel = useMemo(() => {
    if (!electionDetails) return "This Election";
    const year = moment(electionDetails.startDate).format("YYYY");
    return `${year} ${getElectionName(electionDetails, "detailed")} Election`;
  }, [electionDetails]);

  const pollingUnitLabel = useMemo(() => {
    if (!userDetails.pollingUnit) return undefined;
    return formatString.kebabToNormalCase(userDetails.pollingUnit);
  }, [userDetails.pollingUnit]);

  useEffect(() => {
    if (activeElectionId) {
      dispatch(getElectionDiscussionPosts({ activeElectionId }));
    }
    return () => {
      dispatch(clearElectionDiscussion());
    };
  }, [activeElectionId, dispatch]);

  function handleLike(postId: string) {
    dispatch(toggleElectionDiscussionPostLike({ activeElectionId, postId }));
  }

  function handleShare(post: ElectionDiscussionPost) {
    const shareText = `${post.author.displayName}: ${post.body}`;
    if (navigator.share) {
      navigator.share({ title: "Election discussion", text: shareText }).catch(() => undefined);
      return;
    }
    navigator.clipboard?.writeText(shareText);
    dispatch(showAlert({ message: "Post copied to clipboard.", type: "success" }));
  }

  const loading = discussionState.status.getPosts === "pending";
  const hasPosts = discussionState.posts.length > 0;

  return (
    <div className="relative pb-24">
      <div className="mb-6">
        <h3 className="font-league text-lg md:text-xl font-semibold text-gray-800 mb-1">
          {hasPosts ? "Election Discussion" : "Community Verification"}
        </h3>
        <p className="text-sm text-gray-500">
          {hasPosts
            ? "See the updates of this election from polling unit members."
            : pollingUnitLabel
              ? `Discuss this election with observers and volunteers at your polling unit in ${pollingUnitLabel}.`
              : "Discuss this election with observers and volunteers in your area."}
        </p>
      </div>

      {loading ? (
        <div className="grid place-content-center py-20">
          <Spin size="large" />
        </div>
      ) : hasPosts ? (
        <div className="grid gap-5">
          {discussionState.posts.map((post) => (
            <ElectionDiscussionPostCard
              key={post.id}
              post={post}
              electionLabel={electionLabel}
              onLike={handleLike}
              onComment={setCommentsPostId}
              onShare={handleShare}
              liking={discussionState.status.likePost === "pending"}
            />
          ))}
        </div>
      ) : (
        <ElectionDiscussionEmptyState pollingUnitLabel={pollingUnitLabel} />
      )}

      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        className="fixed md:absolute bottom-6 left-0 right-0 mx-auto w-[calc(100%-2rem)] max-w-[736px] flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-md text-left hover:border-brand-200 transition-colors z-10"
      >
        <Message size={20} className="text-brand-500 shrink-0" />
        <span className="text-sm text-gray-400">
          How Do You Feel About This Election Today?
        </span>
      </button>

      <CreateElectionDiscussionModal
        open={createOpen}
        activeElectionId={activeElectionId}
        onClose={() => setCreateOpen(false)}
      />
      <ElectionDiscussionCommentsModal
        activeElectionId={activeElectionId}
        postId={commentsPostId}
        open={!!commentsPostId}
        onClose={() => setCommentsPostId(null)}
      />
    </div>
  );
}
