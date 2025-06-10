"use client";
import React, { useContext } from "react";
import BiodataForm from "../../../../../components/auth/signup/forms/BiodataForm";
import useProtectRoute from "@/app/hooks/useProtectRoute";
import { SignupUserContext } from "../../SignupUserProvider";
import SignupFormLayout from "../../SignupFormLayout";

export default function Biodata() {
  const { currentUser } = useContext(SignupUserContext);
  useProtectRoute(
    currentUser.email,
    "/auth/signup",
    "Oops, Let's get you signed up."
  );

  return (
    <SignupFormLayout title="Fill in your biodata.">
      <BiodataForm />
    </SignupFormLayout>
  );
}
