"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearUserStatus,
  generateAnonymousUsername,
  updateAnonymousIdentity,
} from "@/app/redux/features/userSlice";
import { Button } from "antd";
import { Refresh } from "iconsax-react";
import React, { useEffect, useState } from "react";

export default function RegeneratePublicNameSection() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;

  const savedName = userDetails.anonymousUsername ?? "";
  const identityEnabled = Boolean(userDetails.useAnonymousIdentity);
  const [previewName, setPreviewName] = useState(savedName);

  const isGenerating = userState.status.generateAnonymousUsername === "pending";
  const isConfirming = userState.status.updateAnonymousIdentity === "pending";
  const canKeepName =
    previewName.length > 0 &&
    (previewName !== savedName || !identityEnabled);

  useEffect(() => {
    setPreviewName(userDetails.anonymousUsername ?? "");
  }, [userDetails.anonymousUsername]);

  useEffect(() => {
    if (userState.status.generateAnonymousUsername === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message ?? "Could not generate a new public name.",
          type: "error",
        })
      );
      dispatch(clearUserStatus(["generateAnonymousUsername"]));
    }

    if (userState.status.generateAnonymousUsername === "fulfilled") {
      const { anonymousUsername } = userState.anonymousUsernamePreview!;
      setPreviewName(anonymousUsername);
      dispatch(clearUserStatus(["generateAnonymousUsername"]));
    }
  }, [userState.status.generateAnonymousUsername]);

  useEffect(() => {
    if (userState.status.updateAnonymousIdentity === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message ?? "Could not save your public name.",
          type: "error",
        })
      );
      dispatch(clearUserStatus(["updateAnonymousIdentity"]));
    }

    if (userState.status.updateAnonymousIdentity === "fulfilled") {
      dispatch(
        showAlert({
          message: "Your public name has been updated.",
          type: "success",
        })
      );
      dispatch(clearUserStatus(["updateAnonymousIdentity"]));
    }
  }, [userState.status.updateAnonymousIdentity]);

  function handleTryAnother() {
    dispatch(generateAnonymousUsername());
  }

  function handleKeepName() {
    if (!previewName) {
      dispatch(
        showAlert({
          message: "Generate a public name before saving.",
          type: "warning",
        })
      );
      return;
    }
    dispatch(updateAnonymousIdentity({ enabled: true }));
  }

  return (
    <section className="mt-10 pt-8 border-t border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-2">Regenerate Your Public Name</h4>
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
        To protect you on this app, your real name is never shown publicly. All reports
        and discussions are tied to this identity.
      </p>

      <div className="rounded-xl border border-brand-100 bg-brand-25 px-4 py-5 mb-5">
        <p className="text-xs font-medium text-brand-600 mb-1">Your anonymous identity</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 break-all">
          {previewName || "—"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="large"
          className="!font-medium flex items-center justify-center gap-2"
          icon={<Refresh size={18} />}
          onClick={handleTryAnother}
          loading={isGenerating}
          disabled={isConfirming}
        >
          Try another
        </Button>
        <Button
          type="primary"
          size="large"
          className="!font-medium"
          onClick={handleKeepName}
          loading={isConfirming}
          disabled={!canKeepName || isGenerating}
        >
          Keep This Name
        </Button>
      </div>
    </section>
  );
}
