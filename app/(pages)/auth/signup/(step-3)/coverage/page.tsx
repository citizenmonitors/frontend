"use client";
import React, { useContext } from "react";
import { SignupUserContext } from "../../SignupUserProvider";
import useProtectRoute from "@/app/hooks/useProtectRoute";
import SignupFormLayout from "../../SignupFormLayout";
import CoverageDetailsForm from "../../../../../components/auth/signup/forms/CoverageDetailsForm";

export default function Coverage() {
  const { currentUser } = useContext(SignupUserContext);
  useProtectRoute(
    currentUser.dateOfBirth,
    "/auth/signup",
    "Oops, Let's get you signed up."
  );

  return (
    <SignupFormLayout title="Fill in your coverage details.">
      <CoverageDetailsForm />
    </SignupFormLayout>
  );
}
