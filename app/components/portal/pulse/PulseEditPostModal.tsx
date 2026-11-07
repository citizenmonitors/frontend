"use client";

import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { updatePulsePost } from "@/app/redux/features/pulseSlice";
import { PulsePost } from "@/app/redux/types";
import { countPulseChars, PULSE_BODY_MAX_LENGTH } from "@/app/utils/pulseUtils";
import { isPulseImageFile, PULSE_IMAGE_ACCEPT } from "@/app/utils/pulseMedia";
import { Button, Input, Modal } from "antd";
import { Gallery, Trash } from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";

type PulseEditPostModalProps = {
  post: PulsePost | null;
  onClose: () => void;
};

export default function PulseEditPostModal({ post, onClose }: PulseEditPostModalProps) {
  const dispatch = useAppDispatch();
  const [body, setBody] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBody(post?.body ?? "");
    setRemoveImage(false);
    setNewImage(null);
    setPreview(null);
  }, [post]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!post) return null;

  const currentImage = preview || (!removeImage ? post.imageUrl : null);
  const bodyChanged = body.trim() !== (post.body || "").trim();
  const imageChanged = Boolean(newImage) || removeImage;
  // A quote needs text; a normal post needs text or an image
  const hasContent = Boolean(body.trim()) || (!post.isQuote && Boolean(currentImage));

  function pickImage(file: File | undefined) {
    if (!file) return;
    if (!isPulseImageFile(file)) {
      dispatch(showAlert({ message: "Please select an image file.", type: "error" }));
      return;
    }
    setNewImage(file);
    setRemoveImage(false);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  async function handleSave() {
    if (!post) return;
    if (countPulseChars(body) > PULSE_BODY_MAX_LENGTH) {
      dispatch(
        showAlert({
          message: `Post must be ${PULSE_BODY_MAX_LENGTH} characters or fewer.`,
          type: "error",
        })
      );
      return;
    }
    setSaving(true);
    try {
      const result = await dispatch(
        updatePulsePost({
          postId: post.id,
          changes: {
            ...(bodyChanged ? { body } : {}),
            ...(newImage ? { image: newImage } : {}),
            ...(removeImage && !newImage ? { removeImage: true } : {}),
          },
        })
      ).unwrap();
      dispatch(
        showAlert(
          result.uploadWarning
            ? { message: result.uploadWarning, type: "warning" }
            : { message: "Post updated.", type: "success" }
        )
      );
      onClose();
    } catch (error: any) {
      dispatch(
        showAlert({
          message: error?.message || "Could not update your post.",
          type: "error",
        })
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={Boolean(post)}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      destroyOnClose
      title={<span className="font-league text-lg">Edit post</span>}
    >
      <div className="grid gap-4">
        <Input.TextArea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 10 }}
          maxLength={PULSE_BODY_MAX_LENGTH}
          showCount
          autoFocus
        />

        {currentImage ? (
          <div className="relative overflow-hidden rounded-xl border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentImage} alt="" className="max-h-60 w-full bg-gray-50 object-contain" />
            <button
              type="button"
              className="absolute right-2 top-2 grid h-8 w-8 place-content-center rounded-full bg-white/90 text-error-600 shadow"
              aria-label="Remove image"
              onClick={() => {
                setNewImage(null);
                setPreview(null);
                setRemoveImage(true);
              }}
            >
              <Trash size={16} />
            </button>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-brand-600"
            onClick={() => fileRef.current?.click()}
          >
            <Gallery size={18} />
            {currentImage ? "Replace image" : "Add image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={PULSE_IMAGE_ACCEPT}
            hidden
            onChange={(e) => {
              pickImage(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        <Button
          type="primary"
          size="large"
          block
          loading={saving}
          disabled={(!bodyChanged && !imageChanged) || !hasContent}
          onClick={handleSave}
        >
          Save changes
        </Button>
      </div>
    </Modal>
  );
}
