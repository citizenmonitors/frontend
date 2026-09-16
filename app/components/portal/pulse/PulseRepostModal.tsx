"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearCreatePostStatus,
  createPulsePost,
} from "@/app/redux/features/pulseSlice";
import { PulsePost } from "@/app/redux/types";
import {
  formatPulseTimeAgo,
  generateAnonymousHandle,
  PULSE_BODY_MAX_LENGTH,
  toPulseQuotedPost,
} from "@/app/utils/pulseUtils";
import { Button, Input, Modal, Switch } from "antd";
import { CloseCircle, Profile } from "iconsax-react";
import React, { useEffect, useMemo, useState } from "react";

type PulseRepostModalProps = {
  open: boolean;
  post: PulsePost | null;
  onClose: () => void;
};

export default function PulseRepostModal({
  open,
  post,
  onClose,
}: PulseRepostModalProps) {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.user.details);
  const createStatus = useAppSelector((state) => state.pulse.status.createPost);
  const createError = useAppSelector((state) => state.pulse.error.message);
  const [body, setBody] = useState("");
  const [useAnonymousDisplay, setUseAnonymousDisplay] = useState(false);
  const anonymousHandle = useMemo(() => generateAnonymousHandle(), [open]);

  useEffect(() => {
    if (!open) {
      setBody("");
      setUseAnonymousDisplay(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (createStatus === "fulfilled") {
      dispatch(
        showAlert({
          message: "Posted to your coverage on Pulse.",
          type: "success",
        })
      );
      dispatch(clearCreatePostStatus());
      onClose();
    }
    if (createStatus === "rejected") {
      dispatch(
        showAlert({
          message: createError || "Could not repost. Please try again.",
          type: "error",
        })
      );
      dispatch(clearCreatePostStatus());
    }
  }, [createStatus, open, createError, dispatch, onClose]);

  function handleSubmit() {
    if (!userDetails || !post) {
      dispatch(
        showAlert({ message: "Please log in to repost on Pulse.", type: "warning" })
      );
      return;
    }

    if (body.trim().length > PULSE_BODY_MAX_LENGTH) {
      dispatch(
        showAlert({
          message: `Comment must be ${PULSE_BODY_MAX_LENGTH} characters or fewer.`,
          type: "error",
        })
      );
      return;
    }

    const quotedPost = toPulseQuotedPost(post);
    dispatch(
      createPulsePost({
        body: body.trim(),
        visibilityScope: "public",
        useAnonymousDisplay,
        quotePostId: post.id,
        quotedPost,
        location: {
          state: userDetails.state,
          lga: userDetails.lga,
          ward: userDetails.ward,
          pollingUnit: userDetails.pollingUnit,
        },
      })
    );
  }

  if (!userDetails || !post) return null;

  const quotedAuthor = post.author.displayName;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={520}
      centered
      destroyOnClose
      styles={{ body: { padding: 16 } }}
    >
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-brand-500 font-semibold text-white">
              {userDetails.firstName?.[0]}
              {userDetails.lastName?.[0]}
            </div>
            <h3 className="font-league text-base font-semibold text-gray-800 sm:text-lg">
              {body.trim() ? "Quote post" : "Repost"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-content-center text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <CloseCircle size={24} />
          </button>
        </div>

        <Input.TextArea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment (optional)"
          rows={3}
          maxLength={PULSE_BODY_MAX_LENGTH}
          showCount
          className="!border-gray-200 !bg-gray-50"
          autoFocus
        />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/80 p-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="grid h-8 w-8 place-content-center rounded-full border border-gray-200 bg-white">
              <Profile size={16} className="text-brand-500" variant="Bold" />
            </div>
            <span className="truncate font-semibold text-gray-900">
              {quotedAuthor}
            </span>
            <span className="text-gray-400">·</span>
            <span className="shrink-0 text-gray-500">
              {formatPulseTimeAgo(post.createdAt)}
            </span>
          </div>
          <p className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-sm text-gray-800">
            {post.body}
          </p>
          {post.imageUrl ? (
            <p className="mt-1 text-xs text-gray-500">Contains an image</p>
          ) : null}
        </div>

        <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-3">
          <div className="min-w-0">
            <p className="mb-1 font-semibold text-gray-800">Stay Anonymous</p>
            <p className="text-xs text-gray-500">
              Post as <strong>{anonymousHandle}</strong> instead of{" "}
              <strong>{userDetails.firstName}</strong>.
            </p>
          </div>
          <Switch
            checked={useAnonymousDisplay}
            onChange={setUseAnonymousDisplay}
          />
        </div>

        <p className="text-xs text-gray-500">
          This will appear in your coverage (State, LGA, Ward, Polling Unit)
          filters.
        </p>

        <Button
          type="primary"
          size="large"
          block
          className="!h-12"
          loading={createStatus === "pending"}
          onClick={handleSubmit}
        >
          {body.trim() ? "Post quote" : "Repost"}
        </Button>
      </div>
    </Modal>
  );
}
