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
  const userDetails = useAppSelector((state) => state.user.details!);
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
      dispatch(showAlert({ message: "Your post was shared with your ward.", type: "success" }));
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

    if (!userDetails.ward) {
      dispatch(
        showAlert({
          message: "Add your ward in Coverage Details before posting to Pulse.",
          type: "error",
        })
      );
      return;
    }

    const image = imageFile?.originFileObj;
    dispatch(
      createPulsePost({
        body: body.trim(),
        visibilityScope: "ward",
        useAnonymousDisplay,
        ...(image instanceof File ? { image } : {}),
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
      className="pulse-create-modal"
      destroyOnClose
    >
      <div className="grid gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-500 text-white grid place-content-center font-semibold">
              {userDetails.firstName[0]}
              {userDetails.lastName[0]}
            </div>
            <h3 className="font-league text-lg font-semibold text-gray-800">Share Your Opinion</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseCircle size={24} />
          </button>
        </div>

        <div className="rounded-xl bg-[#E8F8F3] border border-[#B8E8D8] p-4 flex gap-3">
          <InfoCircle size={20} className="text-brand-500 shrink-0 mt-0.5" variant="Bold" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Be factual. Be respectful. The Electoral Act protects free expression but prohibits
            hate speech and incitement. — Citizen Monitors Community Guidelines
          </p>
        </div>

        <Input.TextArea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's happening.."
          rows={5}
          maxLength={PULSE_BODY_MAX_LENGTH}
          showCount
          className="!bg-gray-50 !border-gray-200"
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
            className="!h-12 !bg-brand-25 !border-brand-200 !text-brand-600 font-medium"
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
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              className="absolute top-2 right-2 rounded-full bg-white/90 p-1"
              onClick={() => setImageFile(null)}
            >
              <CloseCircle size={18} className="text-gray-600" />
            </button>
          </div>
        )}

        <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-4">
          <div>
            <p className="font-semibold text-gray-800 mb-1">Stay Anonymous</p>
            <p className="text-sm text-gray-500">
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
