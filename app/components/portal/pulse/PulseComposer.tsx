"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearCreatePostStatus,
  createPulsePost,
} from "@/app/redux/features/pulseSlice";
import {
  defaultPulsePostScope,
  getPlaceNameForScope,
  PULSE_BODY_MAX_LENGTH,
  PulsePostScope,
} from "@/app/utils/pulseUtils";
import { CloseCircle, Gallery, Profile } from "iconsax-react";
import React, { useEffect, useMemo, useState } from "react";
import PulseScopePicker from "./PulseScopePicker";

type PulseComposerProps = {
  displayName?: string;
  requireAuth: () => boolean;
};

export default function PulseComposer({
  displayName,
  requireAuth,
}: PulseComposerProps) {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.user.details);
  const createStatus = useAppSelector((state) => state.pulse.status.createPost);
  const createError = useAppSelector((state) => state.pulse.error.message);
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const userLocation = useMemo(
    () =>
      userDetails
        ? {
            state: userDetails.state,
            lga: userDetails.lga,
            ward: userDetails.ward,
            pollingUnit: userDetails.pollingUnit,
          }
        : null,
    [userDetails]
  );
  const [scope, setScope] = useState<PulsePostScope>(
    defaultPulsePostScope(userLocation)
  );

  useEffect(() => {
    setScope(defaultPulsePostScope(userLocation));
  }, [userLocation]);

  useEffect(() => {
    if (createStatus === "fulfilled") {
      setBody("");
      setImageFile(null);
      setImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      dispatch(clearCreatePostStatus());
    }
    if (createStatus === "rejected") {
      dispatch(
        showAlert({
          message: createError || "Could not submit your post.",
          type: "error",
        })
      );
      dispatch(clearCreatePostStatus());
    }
  }, [createStatus, createError, dispatch]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handlePickImage(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      dispatch(
        showAlert({ message: "Please select an image file.", type: "error" })
      );
      return;
    }
    setImageFile(file);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function handleSubmit() {
    if (!requireAuth()) return;

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

    if (!userDetails) return;

    const location = {
      state: userDetails.state,
      lga: userDetails.lga,
      ward: userDetails.ward,
      pollingUnit: userDetails.pollingUnit,
    };

    dispatch(
      createPulsePost({
        body: body.trim() || " ",
        visibilityScope: scope,
        locationLabel: getPlaceNameForScope(location, scope) || undefined,
        useAnonymousDisplay: false,
        location,
        ...(imageFile ? { image: imageFile } : {}),
      })
    );
  }

  return (
    <div className="border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full border border-gray-200 bg-brand-25 text-brand-500 sm:h-11 sm:w-11">
          <Profile size={20} variant="Bold" />
        </div>
        <div className="min-w-0 flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              displayName
                ? `What's happening, ${displayName.split(" ")[0]}?`
                : "What's happening?"
            }
            rows={3}
            maxLength={PULSE_BODY_MAX_LENGTH}
            className="w-full resize-none bg-transparent text-lg text-gray-900 outline-none placeholder:text-gray-400"
          />

          {imagePreview ? (
            <div className="relative mt-2 overflow-hidden rounded-2xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Attachment preview"
                className="max-h-64 w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-2 top-2 grid h-9 w-9 place-content-center rounded-full bg-white/90 text-gray-600"
                aria-label="Remove image"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                  });
                }}
              >
                <CloseCircle size={18} />
              </button>
            </div>
          ) : null}

          <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-3">
            <label
              className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2 py-1.5 text-brand-600 hover:bg-brand-50"
              title="Select image"
            >
              <Gallery size={18} />
              <span className="text-xs font-medium">Image</span>
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
            <PulseScopePicker
              compact
              value={scope}
              onChange={setScope}
              location={userLocation}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createStatus === "pending"}
              className="ml-auto inline-flex min-h-9 shrink-0 items-center justify-center rounded-full bg-brand-500 px-4 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {createStatus === "pending" ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
