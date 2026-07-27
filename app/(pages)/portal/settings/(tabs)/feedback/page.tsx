"use client";

import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { clearSupportTicket, submitSupportTicket } from "@/app/redux/features/userSlice";
import { Button, Input } from "antd";
import React, { useEffect } from "react";

export default function GiveFeedback() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;

  const { formData, handleFormInputChange } = useFormHandler({
    message: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.message.trim()) {
      dispatch(
        showAlert({
          message: "Please share your feedback before submitting.",
          type: "error",
        })
      );
      return;
    }

    dispatch(
      submitSupportTicket({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber || "",
        category: "feedback",
        message: formData.message.trim(),
      })
    );
  }

  useEffect(() => {
    if (userState.status.submitSupportTicket === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message || "Could not submit feedback.",
          type: "error",
        })
      );
      dispatch(clearSupportTicket());
    }

    if (userState.status.submitSupportTicket === "fulfilled") {
      dispatch(
        showAlert({
          message: "Thank you for your feedback.",
          type: "success",
        })
      );
      handleFormInputChange("message")({ target: { value: "" } });
      dispatch(clearSupportTicket());
    }
  }, [userState.status.submitSupportTicket]);

  return (
    <>
      <SettingsHeader>Give Feedback</SettingsHeader>
      <div className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto">
        <h3 className="font-league text-xl md:text-display-xs text-brand-500 text-center font-semibold mb-1 leading-tight">
          Help improve this app
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
          Tell us what is working well and what we can improve. Your feedback helps us
          build a better experience for everyone.
        </p>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-[6px]">
            <label htmlFor="feedback-message" className="text-sm font-medium">
              Your feedback
            </label>
            <Input.TextArea
              id="feedback-message"
              rows={6}
              value={formData.message}
              onChange={handleFormInputChange("message")}
              placeholder="Share your thoughts, suggestions, or issues..."
            />
          </div>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={userState.status.submitSupportTicket === "pending"}
          >
            Submit Feedback
          </Button>
        </form>
      </div>
    </>
  );
}
