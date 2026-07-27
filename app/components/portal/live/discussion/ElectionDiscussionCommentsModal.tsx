"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearElectionDiscussionComments,
  createElectionDiscussionComment,
  getElectionDiscussionComments,
  resetElectionDiscussionMutations,
  toggleElectionDiscussionCommentLike,
} from "@/app/redux/features/electionDiscussionSlice";
import { formatPulseTimeAgo } from "@/app/utils/pulseUtils";
import { Button, Input, Modal, Spin } from "antd";
import { CloseCircle, Like1, Message, Profile } from "iconsax-react";
import React, { useEffect, useState } from "react";

type ElectionDiscussionCommentsModalProps = {
  activeElectionId: string;
  postId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function ElectionDiscussionCommentsModal({
  activeElectionId,
  postId,
  open,
  onClose,
}: ElectionDiscussionCommentsModalProps) {
  const dispatch = useAppDispatch();
  const discussionState = useAppSelector((state) => state.electionDiscussion);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (open && postId) {
      dispatch(getElectionDiscussionComments({ activeElectionId, postId }));
    }
    if (!open) {
      setBody("");
      dispatch(clearElectionDiscussionComments());
      dispatch(resetElectionDiscussionMutations());
    }
  }, [open, postId, activeElectionId, dispatch]);

  useEffect(() => {
    if (discussionState.status.createComment === "rejected") {
      dispatch(
        showAlert({
          message: discussionState.error.message || "Could not submit comment.",
          type: "error",
        })
      );
    }
    if (discussionState.status.createComment === "fulfilled") {
      setBody("");
    }
  }, [discussionState.status.createComment]);

  function handleSubmit() {
    if (!postId || !body.trim()) return;
    dispatch(
      createElectionDiscussionComment({
        activeElectionId,
        postId,
        body: body.trim(),
        useAnonymousDisplay: false,
      })
    );
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={560}
      className="election-discussion-comments-modal"
      destroyOnClose
    >
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-league text-xl font-semibold text-gray-800">Comments</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseCircle size={24} />
          </button>
        </div>

        <div className="max-h-[360px] overflow-y-auto grid gap-4 pr-1">
          {discussionState.status.getComments === "pending" ? (
            <div className="grid place-content-center py-10">
              <Spin />
            </div>
          ) : discussionState.comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No comments yet. Start the conversation.
            </p>
          ) : (
            discussionState.comments.map((item) => (
              <div key={item.id} className="grid gap-2 border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-brand-25 border border-brand-200 grid place-content-center overflow-hidden shrink-0">
                      <Profile size={18} className="text-brand-500" variant="Bold" />
                    </div>
                    <p className="font-semibold text-gray-800 truncate">
                      {item.author.displayName}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatPulseTimeAgo(item.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed pl-12">{item.body}</p>

                <div className="flex items-center justify-between pl-12">
                  <span className="text-xs text-gray-500">{item.likesCount} Likes</span>
                  <button
                    type="button"
                    className={`transition-colors ${
                      item.isLikedByCurrentUser
                        ? "text-brand-500"
                        : "text-gray-400 hover:text-brand-500"
                    }`}
                    onClick={() =>
                      postId &&
                      dispatch(
                        toggleElectionDiscussionCommentLike({
                          activeElectionId,
                          postId,
                          commentId: item.id,
                        })
                      )
                    }
                  >
                    <Like1
                      size={18}
                      variant={item.isLikedByCurrentUser ? "Bold" : "Linear"}
                    />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid gap-3 border-t border-gray-200 pt-4">
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
            <Message size={20} className="text-gray-400 mt-1 shrink-0" />
            <Input.TextArea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Leave Comment, @ To Mention"
              autoSize={{ minRows: 2, maxRows: 4 }}
              className="!bg-transparent !border-0 !shadow-none"
            />
          </div>
          <Button
            type="primary"
            size="large"
            block
            className="!h-12"
            loading={discussionState.status.createComment === "pending"}
            onClick={handleSubmit}
            disabled={!body.trim()}
          >
            Submit Comment
          </Button>
        </div>
      </div>
    </Modal>
  );
}
