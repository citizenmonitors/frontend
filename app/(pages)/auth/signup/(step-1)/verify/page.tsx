"use client";
import React, { useContext, useEffect, useState } from "react";
import VerifyOTPForm from "../../../../../components/auth/signup/forms/VerifyOTPForm";
import { SignupUserContext } from "../../SignupUserProvider";
import useProtectRoute from "@/app/hooks/useProtectRoute";

function Verification() {
  const { currentUser } = useContext(SignupUserContext);
  useProtectRoute(currentUser.email, "/auth/signup", "Please sign up first.");

  return (
    <React.Fragment>
      <h2 className="font-league font-semibold text-gray-700 text-xl md:text-display-base mb-2 md:mb-0 text-center">
        Verify your account
      </h2>
      <p className="max-w-[480px] text-center text-sm text-gray-500 mb-8 md:mb-12">
        An OTP code has been sent to {currentUser.email || "---"}. Enter the
        six-digit OTP below to verify your account.
      </p>
      <VerifyOTPForm />
    </React.Fragment>
  );
}

export default Verification;
