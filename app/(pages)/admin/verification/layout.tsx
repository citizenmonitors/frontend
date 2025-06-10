"use client";
import VerificationTabs from "@/app/components/admin/verification/VerificationTabs";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import {
  clearVerificationUsers,
  getVerifiedUsers,
} from "@/app/redux/admin-features/verificationSlice";
import { showAlert } from "@/app/redux/features/alertSlice";
import React, { useEffect } from "react";

export default function VerificationLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const verificationState = useAppSelector((state) => state.adminVerification);

  useEffect(() => {
    dispatch(getVerifiedUsers());

    return () => {
      dispatch(clearVerificationUsers());
    };
  }, []);

  useEffect(() => {
    if (verificationState.status.fetchUsers === "rejected") {
      dispatch(
        showAlert({
          message: verificationState.error.message || "An error occurred",
          type: "error",
        })
      );
    }
  }, [verificationState.status.fetchUsers]);

  return (
    <React.Fragment>
      <header className="flex gap-3 md:items-center mb-1 md:mb-2">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Verification
        </h2>
      </header>
      <VerificationTabs />
      {children}
    </React.Fragment>
  );
}
