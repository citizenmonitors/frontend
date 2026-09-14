"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearPulseComments,
  createPulseComment,
  getPulseComments,
  togglePulseCommentLike,
} from "@/app/redux/features/pulseSlice";
import { formatPulseTimeAgo } from "@/app/utils/pulseUtils";
import { Button, Input, Modal, Spin } from "antd";
import { CloseCircle, Like1, Message, Profile } from "iconsax-react";
import React, { useEffect, useState } from "react";

type PulseCommentsModalProps = {
  postId: string | null;
  open: boolean;
  onClose: () => void;
  requireAuth?: (action: string) => boolean;
};

export default function PulseCommentsModal({
  postId,
  open,
  onClose,
  requireAuth,
}: PulseCommentsModalProps) {
  const dispatch = useAppDispatch();
  const pulseState = useAppSelector((state) => state.pulse);
  const userDetails = useAppSelector((state) => state.user.details);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (open && postId) {
      dispatch(getPulseComments(postId));
    }
    if (!open) {
      setBody("");
      dispatch(clearPulseComments());
    }
  }, [open, postId, dispatch]);

  useEffect(() => {
    if (pulseState.status.createComment === "rejected") {
      dispatch(
        showAlert({
          message: pulseState.error.message || "Could not submit comment.",
          type: "error",
        })
      );
    }
    if (pulseState.status.createComment === "fulfilled") {
      setBody("");
    }
  }, [pulseState.status.createComment]);

  function ensureAuth(action: string) {
    if (requireAuth) return requireAuth(action);
    return Boolean(userDetails);
  }

  function handleSubmit() {
    if (!postId || !body.trim()) return;
    if (!ensureAuth("comment")) return;
    dispatch(
      createPulseComment({
        postId,
        body: body.trim(),
        useAnonymousDisplay: false,
      })
    );
  }

  function handleLikeComment(commentId: string) {
    if (!postId) return;
    if (!ensureAuth("like comments")) return;
    dispatch(togglePulseCommentLike({ postId, commentId }));
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={560}
      centered
      className="pulse-comments-modal"
      styles={{
        body: { padding: 16 },
      }}
      destroyOnClose
    >
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-league text-xl font-semibold text-gray-800">Comments</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseCircle size={24} />
          </button>
        </div>

        <div className="grid max-h-[360px] gap-4 overflow-y-auto pr-1">
          {pulseState.status.getComments === "pending" ? (
            <div className="grid place-content-center py-10">
              <Spin />
            </div>
          ) : pulseState.comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No comments yet. Start the conversation.
            </p>
          ) : (
            pulseState.comments.map((item) => (
              <div key={item.id} className="grid gap-2 border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-content-center overflow-hidden rounded-full border border-brand-200 bg-brand-25">
                      <Profile size={18} className="text-brand-500" variant="Bold" />
                    </div>
                    <p className="truncate font-semibold text-gray-800">
                      {item.author.displayName}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {formatPulseTimeAgo(item.createdAt)}
                  </span>
                </div>

                <p className="pl-12 text-sm leading-relaxed text-gray-600">{item.body}</p>

                <div className="flex items-center justify-between pl-12">
                  <span className="text-xs text-gray-500">{item.likesCount} Likes</span>
                  <button
                    type="button"
                    className={`transition-colors ${
                      item.isLikedByCurrentUser
                        ? "text-brand-500"
                        : "text-gray-400 hover:text-brand-500"
                    }`}
                    onClick={() => handleLikeComment(item.id)}
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
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <Message size={20} className="mt-1 shrink-0 text-gray-400" />
            <Input.TextArea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Leave Comment, @ To Mention"
              autoSize={{ minRows: 2, maxRows: 4 }}
              className="!border-0 !bg-transparent !shadow-none"
            />
          </div>
          <Button
            type="primary"
            size="large"
            block
            className="!h-12"
            loading={pulseState.status.createComment === "pending"}
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
