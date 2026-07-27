"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { clearUserStatus, upgradeToVolunteer } from "@/app/redux/features/userSlice";
import { Button } from "antd";
import React, { useEffect } from "react";

type VolunteerUpgradePanelProps = {
  compact?: boolean;
};

export default function VolunteerUpgradePanel({ compact = false }: VolunteerUpgradePanelProps) {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);

  function handleUpgrade() {
    dispatch(upgradeToVolunteer());
  }

  useEffect(() => {
    if (userState.status.upgradeToVolunteer === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message || "Could not upgrade to volunteer.",
          type: "error",
        })
      );
      dispatch(clearUserStatus(["upgradeToVolunteer"]));
    }

    if (userState.status.upgradeToVolunteer === "fulfilled") {
      dispatch(
        showAlert({
          message: "You are now a Volunteer. You can appraise uploads and contribute more actively.",
          type: "success",
        })
      );
      dispatch(clearUserStatus(["upgradeToVolunteer"]));
    }
  }, [userState.status.upgradeToVolunteer]);

  if (compact) {
    return (
      <Button
        size="large"
        type="primary"
        block
        onClick={handleUpgrade}
        loading={userState.status.upgradeToVolunteer === "pending"}
      >
        Become a Volunteer
      </Button>
    );
  }

  return (
    <div className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto">
      <h3 className="font-league text-xl md:text-display-xs lg:text-display-sm text-brand-500 text-center font-semibold mb-1 leading-tight">
        Upgrade to Volunteer
      </h3>
      <p className="text-gray-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
        Public viewers can upgrade to Volunteer to flag uploads, participate in surveys,
        and take a more active role on the platform. Observer verification is available
        only after becoming a Volunteer.
      </p>
      <Button
        type="primary"
        size="large"
        block
        onClick={handleUpgrade}
        loading={userState.status.upgradeToVolunteer === "pending"}
      >
        Become a Volunteer
      </Button>
    </div>
  );
}
