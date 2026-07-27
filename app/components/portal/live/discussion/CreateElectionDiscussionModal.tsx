"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  createElectionDiscussionPost,
  getElectionDiscussionPosts,
  resetElectionDiscussionMutations,
} from "@/app/redux/features/electionDiscussionSlice";
import { PULSE_BODY_MAX_LENGTH } from "@/app/utils/pulseUtils";
import { Button, Input, Modal, Switch, Upload } from "antd";
import { Camera, CloseCircle, InfoCircle, Video } from "iconsax-react";
import type { RcFile } from "antd/es/upload";
import React, { useEffect, useMemo, useState } from "react";

type CreateElectionDiscussionModalProps = {
  open: boolean;
  activeElectionId: string;
  onClose: () => void;
};

export default function CreateElectionDiscussionModal({
  open,
  activeElectionId,
  onClose,
}: CreateElectionDiscussionModalProps) {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.user.details!);
  const discussionState = useAppSelector((state) => state.electionDiscussion);
  const [body, setBody] = useState("");
  const [useAnonymousDisplay, setUseAnonymousDisplay] = useState(false);
  const [allowSocialShare, setAllowSocialShare] = useState(false);
  const [imageFiles, setImageFiles] = useState<RcFile[]>([]);
  const [videoFiles, setVideoFiles] = useState<RcFile[]>([]);

  const anonymousLabel =
    userDetails.useAnonymousIdentity && userDetails.anonymousUsername
      ? userDetails.anonymousUsername
      : `@${userDetails.firstName}${userDetails.lastName[0] ?? ""}`;

  const imagePreviewUrls = useMemo(
    () => imageFiles.map((file) => ({ uid: file.uid, url: URL.createObjectURL(file) })),
    [imageFiles]
  );

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [imagePreviewUrls]);

  useEffect(() => {
    if (!open) {
      setBody("");
      setUseAnonymousDisplay(false);
      setAllowSocialShare(false);
      setImageFiles([]);
      setVideoFiles([]);
    }
  }, [open]);

  useEffect(() => {
    if (discussionState.status.createPost === "fulfilled") {
      dispatch(getElectionDiscussionPosts({ activeElectionId }));
      dispatch(
        showAlert({ message: "Your opinion was shared with this election.", type: "success" })
      );
      dispatch(resetElectionDiscussionMutations());
      onClose();
    }
    if (discussionState.status.createPost === "rejected") {
      dispatch(
        showAlert({
          message: discussionState.error.message || "Could not submit your post.",
          type: "error",
        })
      );
    }
  }, [discussionState.status.createPost]);

  function handleSubmit() {
    if (!body.trim()) {
      dispatch(showAlert({ message: "Please write something before posting.", type: "error" }));
      return;
    }

    if (body.trim().length > PULSE_BODY_MAX_LENGTH) {
      dispatch(
        showAlert({
          message: `Post must be ${PULSE_BODY_MAX_LENGTH} characters or fewer.`,
          type: "error",
        })
      );
      return;
    }

    dispatch(
      createElectionDiscussionPost({
        activeElectionId,
        body: body.trim(),
        allowSocialShare,
        useAnonymousDisplay,
        ...(imageFiles.length > 0 ? { images: imageFiles } : {}),
        ...(videoFiles.length > 0 ? { videos: videoFiles } : {}),
      })
    );
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={520}
      className="election-discussion-create-modal"
      destroyOnClose
      styles={{
        body: {
          maxHeight: "min(80vh, 720px)",
          overflowY: "auto",
          overflowX: "hidden",
        },
      }}
    >
      <div className="grid gap-5 min-w-0 max-w-full overflow-x-hidden">
        <div className="flex items-start justify-between gap-3 min-w-0">
          <h3 className="font-league text-lg font-semibold text-gray-800">Share Your Opinion</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0">
            <CloseCircle size={24} />
          </button>
        </div>

        <div className="rounded-xl bg-[#E8F8F3] border border-[#B8E8D8] p-4 flex gap-3 min-w-0">
          <InfoCircle size={20} className="text-brand-500 shrink-0 mt-0.5" variant="Bold" />
          <p className="text-sm text-gray-600 leading-relaxed min-w-0">
            Be factual. Be respectful. The Electoral Act protects free expression but prohibits
            hate speech and incitement. — Citizen Monitors Community Guidelines
          </p>
        </div>

        <div className="grid gap-[6px] min-w-0">
          <label htmlFor="election-discussion-body" className="text-sm font-medium text-gray-700">
            Your Opinion
          </label>
          <Input.TextArea
            id="election-discussion-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share what you have in mind about this election..."
            rows={5}
            maxLength={PULSE_BODY_MAX_LENGTH}
            showCount
            className="!bg-gray-50 !border-gray-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 min-w-0">
          <Upload
            accept="image/*"
            multiple
            showUploadList={false}
            beforeUpload={(file) => {
              setImageFiles((prev) => [...prev, file]);
              return false;
            }}
            className="min-w-0 w-full [&_.ant-upload]:w-full"
          >
            <Button
              block
              size="large"
              className="!h-12 !bg-brand-25 !border-brand-200 !text-brand-600 font-medium !px-2"
              icon={<Camera size={18} />}
            >
              Attach image
            </Button>
          </Upload>

          <Upload
            accept="video/*"
            multiple
            showUploadList={false}
            beforeUpload={(file) => {
              setVideoFiles((prev) => [...prev, file]);
              return false;
            }}
            className="min-w-0 w-full [&_.ant-upload]:w-full"
          >
            <Button
              block
              size="large"
              className="!h-12 !bg-brand-25 !border-brand-200 !text-brand-600 font-medium !px-2"
              icon={<Video size={18} />}
            >
              Attach Video
            </Button>
          </Upload>
        </div>

        {(imageFiles.length > 0 || videoFiles.length > 0) && (
          <div className="grid grid-cols-2 gap-2 min-w-0">
            {imagePreviewUrls.map((item) => (
              <div
                key={item.uid}
                className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 min-w-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt="Attachment preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 rounded-full bg-white/90 p-1"
                  onClick={() =>
                    setImageFiles((prev) => prev.filter((file) => file.uid !== item.uid))
                  }
                >
                  <CloseCircle size={18} className="text-gray-600" />
                </button>
              </div>
            ))}

            {videoFiles.map((file) => (
              <div
                key={file.uid}
                className="relative flex aspect-square min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <span className="rounded-full bg-brand-25 p-2 text-brand-600 shrink-0">
                    <Video size={16} />
                  </span>
                  <button
                    type="button"
                    className="shrink-0"
                    onClick={() =>
                      setVideoFiles((prev) => prev.filter((item) => item.uid !== file.uid))
                    }
                  >
                    <CloseCircle size={18} className="text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 break-all line-clamp-3 min-w-0">{file.name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 min-w-0">
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 mb-1">
              Give permission to share on social media
            </p>
            <p className="text-sm text-gray-500">
              Allow Citizen Monitors to share this post on official channels.
            </p>
          </div>
          <Switch checked={allowSocialShare} onChange={setAllowSocialShare} className="shrink-0" />
        </div>

        <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-4 min-w-0">
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 mb-1">Stay Anonymous</p>
            <p className="text-sm text-gray-500 break-words">
              Your identity is protected. This post will be posted as{" "}
              <strong>{anonymousLabel}</strong>, and not as{" "}
              <strong>{userDetails.firstName}</strong>.
            </p>
          </div>
          <Switch
            checked={useAnonymousDisplay}
            onChange={setUseAnonymousDisplay}
            className="shrink-0"
          />
        </div>

        <Button
          type="primary"
          size="large"
          block
          className="!h-12"
          loading={discussionState.status.createPost === "pending"}
          onClick={handleSubmit}
          disabled={!body.trim()}
        >
          Submit Post
        </Button>
      </div>
    </Modal>
  );
}
