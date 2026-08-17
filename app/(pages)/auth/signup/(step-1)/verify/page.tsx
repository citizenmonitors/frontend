"use client";
import React, { useContext, useEffect, useState } from "react";
import VerifyOTPForm from "../../../../../components/auth/signup/forms/VerifyOTPForm";
import { SignupUserContext } from "../../SignupUserProvider";
import useProtectRoute from "@/app/hooks/useProtectRoute";
import { readSignupDraft } from "@/app/data/signupDraft";
import { useRouter } from "next/navigation";

function Verification() {
  const { currentUser } = useContext(SignupUserContext);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [draftEmail, setDraftEmail] = useState<string | undefined>();
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    const draft = readSignupDraft();
    setDraftEmail(draft?.email);
    setAlreadyVerified(!!draft?.emailVerified);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (alreadyVerified) {
      router.replace("/auth/signup/biodata");
    }
  }, [alreadyVerified, ready, router]);

  const hasEmail = Boolean(currentUser.email || draftEmail);
  useProtectRoute(
    hasEmail,
    "/auth/signup",
    "Please sign up first.",
    ready && !alreadyVerified
  );

  if (!ready || alreadyVerified) {
    return null;
  }

  return (
    <React.Fragment>
      <h2 className="font-league font-semibold text-gray-700 text-xl md:text-display-base mb-2 md:mb-0 text-center">
        Verify your account
      </h2>
      <p className="max-w-[480px] text-center text-sm text-gray-500 mb-8 md:mb-12">
        An OTP code has been sent to {currentUser.email || draftEmail || "---"}. Enter the
        six-digit OTP below to verify your account.
      </p>
      <VerifyOTPForm />
    </React.Fragment>
  );
}

export default Verification;
