"use client";
import React from "react";
import NewUserForm from "../../../../components/auth/signup/forms/NewUserForm";
import SignupFormLayout from "../SignupFormLayout";
import SuggestionPopup from "@/app/components/shared/SuggestionPopup";
import { resourceVideos } from "@/app/components/landing/resources/data";

function SignUp() {
  return (
    <SignupFormLayout title="Welcome New User!">
      <NewUserForm />
      <SuggestionPopup
        id="registration"
        suggestion="Watch Tutorial Video"
        title="How to Sign Up or Register on Citizen Monitors"
        video={resourceVideos[0]}
      />
    </SignupFormLayout>
  );
}

export default SignUp;
