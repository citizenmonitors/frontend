"use client";
import { Button } from "antd";
import React from "react";
import { useAppSelector } from "@/app/hooks/redux";
import Link from "next/link";
import {
  canUpgradeToObserver,
  canUpgradeToVolunteer,
} from "@/app/utils/userRoleAccess";

const VerifySection = () => {
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;

  if (userDetails.role === "observer") return null;

  if (canUpgradeToVolunteer(userDetails.role)) {
    return (
      <div id="verify-user" className="mt-4 verify-user md:mt-10">
        <h3 className="font-league text-xl md:text-display-xs tracking-tight font-medium text-brand-500 leading-[1] text-center md:text-left mb-1 md:mb-2">
          Become a Volunteer
        </h3>
        <p className="mb-4 text-sm text-center md:text-left md:text-base">
          Public viewers can upgrade to Volunteer to take a more active role on the
          platform. Observer verification is available after you become a Volunteer.
        </p>
        <Link href={"/portal/settings/upgrade-volunteer"}>
          <Button size="large" type="primary" block>
            Upgrade to Volunteer
          </Button>
        </Link>
      </div>
    );
  }

  if (!canUpgradeToObserver(userDetails.role)) return null;

  return (
    <div id="verify-user" className="mt-4 verify-user md:mt-10">
      <h3 className="font-league text-xl md:text-display-xs tracking-tight font-medium text-brand-500 leading-[1] text-center md:text-left mb-1 md:mb-2">
        Verify Yourself, become an Observer
      </h3>
      <React.Fragment>
        <p className="mb-4 text-sm text-center md:text-left md:text-base">
          If you are seeing this, there is an observer vacancy in your polling unit, which
          means there is a request for you to step up and be verified.
        </p>
        <Link href={"/portal/settings/verify"}>
          <Button size="large" type="primary" block>
            Verify
          </Button>
        </Link>
      </React.Fragment>
    </div>
  );
};

export default VerifySection;
