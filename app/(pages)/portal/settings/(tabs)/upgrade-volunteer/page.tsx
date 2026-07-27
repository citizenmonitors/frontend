"use client";

import VolunteerUpgradePanel from "@/app/components/portal/settings/VolunteerUpgradePanel";
import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { useAppSelector } from "@/app/hooks/redux";
import { canUpgradeToVolunteer } from "@/app/utils/userRoleAccess";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function UpgradeVolunteer() {
  const router = useRouter();
  const userDetails = useAppSelector((state) => state.user.details!);

  useEffect(() => {
    if (!canUpgradeToVolunteer(userDetails.role)) {
      router.replace("/portal/settings");
    }
  }, [router, userDetails.role]);

  if (!canUpgradeToVolunteer(userDetails.role)) return null;

  return (
    <>
      <SettingsHeader>Upgrade to Volunteer</SettingsHeader>
      <VolunteerUpgradePanel />
    </>
  );
}
