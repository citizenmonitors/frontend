"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { createPulsePost } from "@/app/redux/features/pulseSlice";
import { generateAnonymousHandle, PULSE_BODY_MAX_LENGTH } from "@/app/utils/pulseUtils";
import { Button, Input, Modal, Switch, Upload } from "antd";
import { Camera, CloseCircle, InfoCircle } from "iconsax-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import type { UploadFile } from "antd/es/upload";

type CreatePulsePostModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreatePulsePostModal({ open, onClose }: CreatePulsePostModalProps) {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.user.details);
  const pulseState = useAppSelector((state) => state.pulse);
  const [body, setBody] = useState("");
  const [useAnonymousDisplay, setUseAnonymousDisplay] = useState(false);
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const anonymousHandle = useMemo(() => generateAnonymousHandle(), [open]);

  useEffect(() => {
    if (!open) {
      setBody("");
      setUseAnonymousDisplay(false);
      setImageFile(null);
    }
  }, [open]);

  useEffect(() => {
    if (pulseState.status.createPost === "fulfilled") {
      dispatch(showAlert({ message: "Your post was shared on Pulse.", type: "success" }));
      onClose();
    }
    if (pulseState.status.createPost === "rejected") {
      dispatch(
        showAlert({
          message: pulseState.error.message || "Could not submit your post.",
          type: "error",
        })
      );
    }
  }, [pulseState.status.createPost]);

  function handleSubmit() {
    if (!userDetails) {
      dispatch(showAlert({ message: "Please log in to post on Pulse.", type: "warning" }));
      return;
    }

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

    const image = imageFile?.originFileObj;
    dispatch(
      createPulsePost({
        body: body.trim(),
        visibilityScope: "public",
        useAnonymousDisplay,
        ...(image instanceof File ? { image } : {}),
      })
    );
  }

  if (!userDetails) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={520}
      centered
      className="pulse-create-modal"
      styles={{
        body: { padding: 16 },
      }}
      destroyOnClose
    >
      <div className="grid gap-4 sm:gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-brand-500 font-semibold text-white">
              {userDetails.firstName?.[0]}
              {userDetails.lastName?.[0]}
            </div>
            <h3 className="font-league text-base font-semibold text-gray-800 sm:text-lg">
              Share Your Opinion
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

        <div className="flex gap-3 rounded-xl border border-[#B8E8D8] bg-[#E8F8F3] p-3 sm:p-4">
          <InfoCircle size={20} className="mt-0.5 shrink-0 text-brand-500" variant="Bold" />
          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
            Be factual. Be respectful. The Electoral Act protects free expression but prohibits
            hate speech and incitement. — Citizen Monitors Community Guidelines
          </p>
        </div>

        <Input.TextArea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's happening.."
          rows={4}
          maxLength={PULSE_BODY_MAX_LENGTH}
          showCount
          className="!border-gray-200 !bg-gray-50"
        />

        <Upload
          accept="image/*"
          maxCount={1}
          showUploadList={false}
          beforeUpload={(file) => {
            setImageFile({ uid: file.uid, name: file.name, originFileObj: file });
            return false;
          }}
        >
          <Button
            block
            size="large"
            className="!h-12 !border-brand-200 !bg-brand-25 font-medium !text-brand-600"
            icon={<Camera size={18} />}
          >
            Attach image
          </Button>
        </Upload>

        {imageFile?.originFileObj && (
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src={URL.createObjectURL(imageFile.originFileObj)}
              alt="Attachment preview"
              width={480}
              height={280}
              className="h-40 w-full object-cover sm:h-48"
            />
            <button
              type="button"
              className="absolute right-2 top-2 grid h-9 w-9 place-content-center rounded-full bg-white/90"
              onClick={() => setImageFile(null)}
              aria-label="Remove image"
            >
              <CloseCircle size={18} className="text-gray-600" />
            </button>
          </div>
        )}

        <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-3 sm:gap-4 sm:p-4">
          <div className="min-w-0">
            <p className="mb-1 font-semibold text-gray-800">Stay Anonymous</p>
            <p className="text-xs text-gray-500 sm:text-sm">
              Your identity is protected. This post will be posted as{" "}
              <strong>{anonymousHandle}</strong>, and not as{" "}
              <strong>{userDetails.firstName}</strong>.
            </p>
          </div>
          <Switch checked={useAnonymousDisplay} onChange={setUseAnonymousDisplay} />
        </div>

        <Button
          type="primary"
          size="large"
          block
          className="!h-12"
          loading={pulseState.status.createPost === "pending"}
          onClick={handleSubmit}
        >
          Submit Post
        </Button>
      </div>
    </Modal>
  );
}
