"use client";
import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { clearUserStateStatus, updateEmail } from "@/app/redux/features/userSlice";
import { Button, Input, Tooltip } from "antd";
import { InfoCircle } from "iconsax-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import isEmail from "validator/lib/isEmail";

function ChangeEmail() {
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const initialFormState = {
    email: userDetails.email,
    newEmail: "",
  };
  const { formData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  function submitFormData() {
    // Verify email
    if (!isEmail(formData.newEmail)) {
      dispatch(
        showAlert({
          message: "Please enter a valid new email.",
          type: "error",
        })
      );
      return;
    }

    // Check if new email is the same as the current email
    if (formData.newEmail === userDetails.email) {
      dispatch(
        showAlert({
          message: "New email cannot be the same as your current email.",
          type: "error",
        })
      );
      return;
    }

    // Dispatch action to verify email
    dispatch(updateEmail({ newEmail: formData.newEmail }));
  }

  useEffect(() => {
    const status = userState.status.updateEmail;

    if (status === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message || "An error occurred.",
          type: "error",
        })
      );
    }

    if (status === "fulfilled") {
      dispatch(
        showAlert({
          message: "A verification code has been sent to your email address.",
          type: "success",
        })
      );
      router.push(`/portal/settings/email/verify?email=${formData.newEmail}`);
      requestAnimationFrame(() => {
        dispatch(clearUserStateStatus({ statuses: ["updateEmail"] }));
      });
    }
  }, [userState.status.updateEmail]);

  return (
    <React.Fragment>
      <SettingsHeader>Change Email</SettingsHeader>
      <div
        id="settings-email"
        className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto"
      >
        <h3 className="font-league text-xl md:text-display-xs lg:text-display-sm text-brand-500 text-center font-semibold mb-1 leading-tight">
          Update your email address.
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
          Change and re-verify your email address on citizen monitors.
        </p>
        <form
          className="grid gap-7 w-full max-w-[648px] text-gray-700"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-[6px]">
            <label htmlFor="settings-email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="settings-email"
              size="large"
              placeholder="example@gmail.com"
              type="email"
              name="email"
              required
              value={formData.email}
              disabled
              onChange={handleFormInputChange("email")}
              className="text-gray-700 bg-white"
              suffix={
                <Tooltip className="text-center" title="Your current email address.">
                  <InfoCircle size={16} className="text-gray-400" />
                </Tooltip>
              }
            />
          </div>
          <div className="grid gap-[6px]">
            <label htmlFor="settings-new-email" className="text-sm font-medium">
              New Email Address
            </label>
            <Input
              id="settings-new-email"
              size="large"
              placeholder="Enter new email address"
              type="email"
              name="email"
              required
              value={formData.newEmail}
              onChange={handleFormInputChange("newEmail")}
              className="text-gray-700"
              suffix={
                <Tooltip
                  className="text-center"
                  title="The new email address will be verified with a 6-digit verification code"
                >
                  <InfoCircle size={16} className="text-gray-400" />
                </Tooltip>
              }
            />
          </div>
          <Button
            type="primary"
            size="large"
            className="font-medium mb-3"
            loading={userState.status.updateEmail === "pending"}
            htmlType="submit"
            onClick={submitFormData}
          >
            Update Email
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
}

export default ChangeEmail;
