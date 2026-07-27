"use client";
import VerifyForm from "@/app/components/portal/dashboard/VerifyForm";
import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { clearUserStatus } from "@/app/redux/features/userSlice";
import { canUpgradeToObserver, canUpgradeToVolunteer } from "@/app/utils/userRoleAccess";
import { Button } from "antd";
import { ArrowRight2 } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ObserverVerification() {
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (canUpgradeToVolunteer(userDetails.role)) {
      router.replace("/portal/settings/upgrade-volunteer");
    }
  }, [router, userDetails.role]);

  useEffect(() => {
    if (userState.status.upgradeAccount === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message!,
          type: "error",
        })
      );
    }

    if (userState.status.upgradeAccount === "fulfilled") {
      dispatch(
        showAlert({
          message: "Account verification in progress.",
          type: "success",
        })
      );
      dispatch(clearUserStatus(['upgradeAccount']));
    }
  }, [userState.status.upgradeAccount]);

  if (canUpgradeToVolunteer(userDetails.role)) {
    return null;
  }

  return (
    <React.Fragment>
      <SettingsHeader>Observer Verification</SettingsHeader>
      {userDetails.role === "observer" ? (
        <div className="grid gap-1 py-8">
          <p className="text-sm text-center">
            {
              userDetails.pendingObserverVerification ? "Your verification is pending. You will be notified once it is approved." : "Your Account has been verified."
            }
          </p>
          <Link href={"/portal/dashboard"}>
            <Button
              type="text"
              className="!text-brand-600 font-medium hover:!bg-brand-500 hover:!text-white w-fit mx-auto flex gap-1 items-center transition-all"
            >
              <span>Go to Dashboard</span> <ArrowRight2 size={16} />
            </Button>
          </Link>
        </div>
      ) : canUpgradeToObserver(userDetails.role) ? (
        <div
          id="settings-verify"
          className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto"
        >
          <h3 className="font-league text-xl md:text-display-xs lg:text-display-sm text-brand-500 text-center font-semibold mb-1 leading-tight">
            Verify yourself, become a Citizen Monitors Observer.
          </h3>
          <p className="text-gray-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
            Upload the required documents to become an observer. PVC verification and
            observer bank details are completed here.
          </p>

          <VerifyForm />
        </div>
      ) : (
        <p className="text-sm text-center text-gray-500 py-8">
          Observer verification is available to Volunteers only.
        </p>
      )}
    </React.Fragment>
  );
}
