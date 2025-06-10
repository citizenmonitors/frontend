"use client";
import React from "react";
import ObserverVerificationForm from "../../../../../components/auth/signup/forms/ObserverVerificationForm";
import SignupFormLayout from "../../SignupFormLayout";
import useProtectRoute from "@/app/hooks/useProtectRoute";
import { useAppSelector } from "@/app/hooks/redux";

export default function ObserverVerification() {
  const signupState = useAppSelector((state) => state.signup);
  useProtectRoute(
    signupState.isObserverAllowed !== null,
    "/auth/signup",
    "Oops, Let's get you signed up."
  );

  return (
    <SignupFormLayout title="Verify yourself, become an observer.">
      <ObserverVerificationForm />
    </SignupFormLayout>
  );
}
