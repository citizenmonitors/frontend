"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearCreatePostStatus,
  createPulsePost,
  getPulsePosts,
} from "@/app/redux/features/pulseSlice";
import {
  defaultPulsePostScope,
  generateAnonymousHandle,
  getPlaceNameForScope,
  PULSE_BODY_MAX_LENGTH,
  PulsePostScope,
} from "@/app/utils/pulseUtils";
import { Button, Modal, Switch } from "antd";
import PulseScopePicker from "./PulseScopePicker";
import { Camera, CloseCircle, InfoCircle } from "iconsax-react";
import React, { useEffect, useMemo, useState } from "react";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const submittedRef = React.useRef(false);
  const anonymousHandle = useMemo(() => generateAnonymousHandle(), [open]);
  const userLocation = userDetails
    ? {
        state: userDetails.state,
        lga: userDetails.lga,
        ward: userDetails.ward,
        pollingUnit: userDetails.pollingUnit,
      }
    : null;
  const [scope, setScope] = useState<PulsePostScope>(
    defaultPulsePostScope(userLocation)
  );

  useEffect(() => {
    if (!open) {
      submittedRef.current = false;
      setBody("");
      setUseAnonymousDisplay(false);
      setImageFile(null);
      setImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setScope(defaultPulsePostScope(userLocation));
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!open || !submittedRef.current) return;
    if (pulseState.status.createPost === "fulfilled") {
      submittedRef.current = false;
      dispatch(showAlert({ message: "Your post was shared on Pulse.", type: "success" }));
      dispatch(clearCreatePostStatus());
      dispatch(getPulsePosts({ force: true }));
      onClose();
    }
    if (pulseState.status.createPost === "rejected") {
      submittedRef.current = false;
      dispatch(
        showAlert({
          message: pulseState.error.message || "Could not submit your post.",
          type: "error",
        })
      );
      dispatch(clearCreatePostStatus());
    }
  }, [pulseState.status.createPost, pulseState.error.message, open, dispatch, onClose]);

  function handlePickImage(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      dispatch(showAlert({ message: "Please select an image file.", type: "error" }));
      return;
    }
    setImageFile(file);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function handleSubmit() {
    if (!userDetails) {
      dispatch(showAlert({ message: "Please log in to post on Pulse.", type: "warning" }));
      return;
    }

    if (!body.trim() && !imageFile) {
      dispatch(
        showAlert({
          message: "Please write something or attach an image.",
          type: "error",
        })
      );
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

    const location = {
      state: userDetails.state,
      lga: userDetails.lga,
      ward: userDetails.ward,
      pollingUnit: userDetails.pollingUnit,
    };
    submittedRef.current = true;
    dispatch(
      createPulsePost({
        body: body.trim() || " ",
        visibilityScope: scope,
        locationLabel: getPlaceNameForScope(location, scope) || undefined,
        useAnonymousDisplay,
        location,
        ...(imageFile ? { image: imageFile } : {}),
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
        body: {
          padding: 16,
          maxHeight: "min(640px, 85dvh)",
          overflowY: "auto",
        },
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
            Be factual. Be respectful. Share what&apos;s happening in your
            community — services, safety, governance, and everyday issues that
            matter. Hate speech and incitement are not allowed. — Citizen
            Monitors Community Guidelines
          </p>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's happening.."
          rows={4}
          maxLength={PULSE_BODY_MAX_LENGTH}
          className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none ring-brand-500/20 placeholder:text-gray-400 focus:border-brand-400 focus:ring-2"
        />
        <p className="text-right text-xs text-gray-400">
          {body.length}/{PULSE_BODY_MAX_LENGTH}
        </p>

        <label className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-25 text-sm font-medium text-brand-600 hover:bg-brand-50">
          <Camera size={18} />
          Attach image
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              handlePickImage(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>

        {imagePreview ? (
          <div className="relative overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Attachment preview"
              className="h-40 w-full object-cover sm:h-48"
            />
            <button
              type="button"
              className="absolute right-2 top-2 grid h-9 w-9 place-content-center rounded-full bg-white/90"
              onClick={() => {
                setImageFile(null);
                setImagePreview((prev) => {
                  if (prev) URL.revokeObjectURL(prev);
                  return null;
                });
              }}
              aria-label="Remove image"
            >
              <CloseCircle size={18} className="text-gray-600" />
            </button>
          </div>
        ) : null}

        <div className="rounded-xl border border-gray-200 p-3">
          <p className="mb-2 text-sm font-semibold text-gray-800">
            Post within
          </p>
          <PulseScopePicker
            value={scope}
            onChange={setScope}
            location={userLocation}
          />
        </div>

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
