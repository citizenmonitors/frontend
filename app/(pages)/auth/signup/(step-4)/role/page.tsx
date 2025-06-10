"use client";
import useProtectRoute from "@/app/hooks/useProtectRoute";
import React from "react";
import SignupFormLayout from "../../SignupFormLayout";
import RoleSelectForm from "../../../../../components/auth/signup/forms/RoleSelectForm";
import { useAppSelector } from "@/app/hooks/redux";
import SuggestionPopup from "@/app/components/shared/SuggestionPopup";
import { resourceVideos } from "@/app/components/landing/resources/data";

const RoleSelect = () => {
  const signupState = useAppSelector((state) => state.signup);
  useProtectRoute(
    signupState.isObserverAllowed !== null,
    "/auth/signup",
    "Oops, Let's get you signed up."
  );

  return (
    <SignupFormLayout title="Select your role">
      <RoleSelectForm />
      <SuggestionPopup
        id="role-selection"
        suggestion="Watch Tutorial Video"
        title="Understanding the Roles"
        video={resourceVideos[2]}
      />
    </SignupFormLayout>
  );
};

export default RoleSelect;
