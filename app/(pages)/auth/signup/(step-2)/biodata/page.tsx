"use client";
import React, { useContext, useEffect, useState } from "react";
import BiodataForm from "../../../../../components/auth/signup/forms/BiodataForm";
import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { SignupUserContext } from "../../SignupUserProvider";
import SignupFormLayout from "../../SignupFormLayout";
import { readSignupDraft } from "@/app/data/signupDraft";
import { useRouter } from "next/navigation";

export default function Biodata() {
  const { currentUser } = useContext(SignupUserContext);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);
  const [draftEmail, setDraftEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    setDraftEmail(readSignupDraft()?.email);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const hasEmail = Boolean(currentUser.email || draftEmail);
    if (!hasEmail) {
      dispatch(
        showAlert({
          message: "Oops, Let's get you signed up.",
          type: "error",
        })
      );
      router.replace("/auth/signup");
    }
  }, [ready, currentUser.email, draftEmail, dispatch, router]);

  if (!ready) {
    return null;
  }

  return (
    <SignupFormLayout title="Fill in your biodata.">
      <BiodataForm />
    </SignupFormLayout>
  );
}
