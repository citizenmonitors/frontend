"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  blockPulseAuthorOf,
  clearPulseComments,
  createPulseComment,
  deletePulseComment,
  getPulseComments,
  getPulsePosts,
  reportPulseComment,
  togglePulseCommentLike,
  updatePulseComment,
} from "@/app/redux/features/pulseSlice";
import { PulseComment, PulseReportReason } from "@/app/redux/types";
import PulseReportModal from "./PulseReportModal";
import { formatPulseTimeAgo } from "@/app/utils/pulseUtils";
import { insertTextAtCursor } from "@/app/utils/pulseMedia";
import { Button, Checkbox, Dropdown, Input, Modal, Spin } from "antd";
import { CloseCircle, Like1, Message, More, Profile } from "iconsax-react";
import React, { useEffect, useState } from "react";
import PulseEmojiStickerPicker from "./PulseEmojiStickerPicker";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editAnonymous, setEditAnonymous] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [reportComment, setReportComment] = useState<PulseComment | null>(null);
  const post = pulseState.posts.find((p) => p.id === postId);

  function fail(error: unknown, fallback: string) {
    const message = (error as { message?: unknown })?.message;
    dispatch(
      showAlert({
        message: typeof message === "string" && message ? message : fallback,
        type: "error",
      })
    );
  }

  function editChanges(item: PulseComment) {
    return {
      ...(editBody.trim() !== item.body.trim() ? { body: editBody } : {}),
      ...(editAnonymous !== Boolean(item.author?.usedAnonymous)
        ? { useAnonymousDisplay: editAnonymous }
        : {}),
    };
  }

  async function saveEdit(item: PulseComment) {
    const changes = editChanges(item);
    if (!postId || !editBody.trim() || Object.keys(changes).length === 0) return;
    setSavingEdit(true);
    try {
      await dispatch(updatePulseComment({ postId, commentId: item.id, changes })).unwrap();
      setEditingId(null);
    } catch (error) {
      fail(error, "Could not update comment.");
    } finally {
      setSavingEdit(false);
    }
  }

  function confirmDelete(commentId: string) {
    if (!postId) return;
    Modal.confirm({
      title: "Delete this comment?",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () =>
        dispatch(deletePulseComment({ postId, commentId }))
          .unwrap()
          .catch((error) => fail(error, "Could not delete comment.")),
    });
  }

  function confirmBlock(comment: PulseComment) {
    if (!ensureAuth("block users")) return;
    Modal.confirm({
      title: `Block ${comment.author.displayName || "this user"}?`,
      content: "You won't see each other's posts, reposts or comments.",
      okText: "Block",
      okButtonProps: { danger: true },
      onOk: () =>
        dispatch(blockPulseAuthorOf({ commentId: comment.id }))
          .unwrap()
          .then(() => {
            dispatch(showAlert({ message: "User blocked.", type: "success" }));
            dispatch(getPulsePosts({ force: true }));
          })
          .catch((error) => fail(error, "Could not block user.")),
    });
  }

  async function submitReport(reason: PulseReportReason, details?: string) {
    if (!postId || !reportComment) return;
    try {
      await dispatch(
        reportPulseComment({ postId, commentId: reportComment.id, reason, details })
      ).unwrap();
      dispatch(showAlert({ message: "Thanks. Our team will review this comment.", type: "success" }));
      setReportComment(null);
    } catch (error) {
      fail(error, "Could not send report.");
    }
  }

  function commentMenu(item: PulseComment) {
    const mine = Boolean(item.isOwnedByCurrentUser);
    // Post authors can delete any comment on their post
    const canDelete = mine || Boolean(post?.isOwnedByCurrentUser);
    const items = [
      ...(mine
        ? [{ key: "edit", label: "Edit", onClick: () => {
            setEditingId(item.id);
            setEditBody(item.body);
            setEditAnonymous(Boolean(item.author?.usedAnonymous));
          } }]
        : []),
      ...(canDelete
        ? [{ key: "delete", label: "Delete", danger: true, onClick: () => confirmDelete(item.id) }]
        : []),
      ...(!mine && userDetails
        ? [
            { key: "report", label: "Report", danger: true, onClick: () => setReportComment(item) },
            { key: "block", label: "Block author", danger: true, onClick: () => confirmBlock(item) },
          ]
        : []),
    ];
    if (!items.length) return null;
    return (
      <Dropdown trigger={["click"]} menu={{ items }}>
        <button
          type="button"
          className="grid h-7 w-7 place-content-center rounded-full text-gray-400 hover:bg-gray-100"
          aria-label="Comment options"
        >
          <More size={16} />
        </button>
      </Dropdown>
    );
  }

  useEffect(() => {
    if (open && postId) {
      dispatch(getPulseComments(postId));
    }
    if (!open) {
      setBody("");
      setEditingId(null);
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
                      {item.author?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.author.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Profile size={18} className="text-brand-500" variant="Bold" />
                      )}
                    </div>
                    <p className="truncate font-semibold text-gray-800">
                      {item.author?.displayName || "Citizen"}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                    {formatPulseTimeAgo(item.createdAt)}
                    {item.editedAt ? " · Edited" : ""}
                    {commentMenu(item)}
                  </span>
                </div>

                {editingId === item.id ? (
                  <div className="grid gap-2 pl-12">
                    <Input.TextArea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      maxLength={3000}
                      autoFocus
                    />
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Checkbox
                        className="mr-auto"
                        checked={editAnonymous}
                        onChange={(e) => setEditAnonymous(e.target.checked)}
                      >
                        <span className="text-xs text-gray-600">Comment anonymously</span>
                      </Checkbox>
                      <Button size="small" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        loading={savingEdit}
                        disabled={!editBody.trim() || Object.keys(editChanges(item)).length === 0}
                        onClick={() => saveEdit(item)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                <p className="pl-12 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-600 [font-family:inherit,'Apple_Color_Emoji','Segoe_UI_Emoji','Noto_Color_Emoji']">
                  {item.body}
                </p>
                )}

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
          <div className="grid gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-start gap-3">
              <Message size={20} className="mt-1 shrink-0 text-gray-400" />
              <Input.TextArea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Leave Comment, @ To Mention"
                autoSize={{ minRows: 2, maxRows: 4 }}
                maxLength={3000}
                className="!border-0 !bg-transparent !shadow-none [font-family:inherit,'Apple_Color_Emoji','Segoe_UI_Emoji','Noto_Color_Emoji']"
              />
            </div>
            <PulseEmojiStickerPicker
              placement="up"
              onInsertEmoji={(emoji) => {
                const { next } = insertTextAtCursor(body, emoji);
                setBody(next);
              }}
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
      <PulseReportModal
        open={Boolean(reportComment)}
        kind="comment"
        onClose={() => setReportComment(null)}
        onSubmit={submitReport}
      />
    </Modal>
  );
}
