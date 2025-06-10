"use client";
import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { clearUserStatus, updateAccount } from "@/app/redux/features/userSlice";
import { User } from "@/app/redux/types";
import { Button, Input } from "antd";
import { Eye, EyeSlash, Verify } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { isStrongPassword } from "validator";

export default function ChangePassword() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const { formData, handleFormInputChange } = useFormHandler({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Verify password
    if (!formData.password.trim()) {
      dispatch(
        showAlert({
          message: "Please enter your current password.",
          type: "error",
        })
      );
      return;
    }

    // Verify passwords differ
    if (formData.password.trim() === formData.newPassword.trim()) {
      dispatch(
        showAlert({
          message: "New password cannot be the same as Current password.",
          type: "error",
        })
      );
      return;
    }

    // Verify strong password
    if (
      !isStrongPassword(formData.newPassword.trim(), { minUppercase: 0, minLowercase: 0 })
    ) {
      dispatch(
        showAlert({
          message:
            "New password must contain at least 8 characters, one number, and one symbol.",
          type: "error",
        })
      );
      return;
    }

    // Verify that passwords match
    if (formData.newPassword !== formData.confirmNewPassword) {
      dispatch(
        showAlert({
          message: "Passwords do not match.",
          type: "error",
        })
      );
      return;
    }

    const passwordFields = {
      currentPassword: formData.password,
      password: formData.newPassword,
      confirmPassword: formData.confirmNewPassword,
    } as unknown as Partial<User>;
    dispatch(updateAccount(passwordFields));
  }

  useEffect(() => {
    if (userState.status.updateAccount === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message!,
          type: "error",
        })
      );
    }

    if (userState.status.updateAccount === "fulfilled") {
      dispatch(
        showAlert({
          message: "Credentials updated successfully.",
          type: "success",
        })
      );
      dispatch(clearUserStatus(["updateAccount"]));
      formData.password = "";
      formData.newPassword = "";
      formData.confirmNewPassword = "";
    }
  }, [userState.status.updateAccount]);
  return (
    <React.Fragment>
      <SettingsHeader>Password</SettingsHeader>
      <div
        id="settings-password"
        className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto"
      >
        <h3 className="font-league text-xl md:text-display-xs lg:text-display-sm text-brand-500 text-center font-semibold mb-1 leading-tight">
          Change Password.
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
          Choose a new strong password to secure your access.
        </p>

        <form
          action=""
          className="grid gap-7 w-full max-w-[648px] text-gray-700"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-[6px]">
            <label htmlFor="security-update-password" className="text-sm font-medium">
              Current Password
            </label>
            <Input
              id="security-update-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleFormInputChange("password")}
              size="large"
              placeholder="Enter Current Password"
              className="text-gray-700"
              suffix={
                <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <Eye size={16} className="text-brand-500" variant="Bold" />
                  ) : (
                    <EyeSlash size={16} className="text-gray-400" variant="Bold" />
                  )}
                </button>
              }
            />
          </div>
          <div className="grid gap-[6px]">
            <label htmlFor="security-update-new-password" className="text-sm font-medium">
              New Password
            </label>
            <Input
              id="security-update-new-password"
              type={showNewPassword ? "text" : "password"}
              name="password"
              value={formData.newPassword}
              onChange={handleFormInputChange("newPassword")}
              size="large"
              placeholder="Enter New Password"
              className="text-gray-700"
              suffix={
                <button type="button" onClick={() => setShowNewPassword((prev) => !prev)}>
                  {showNewPassword ? (
                    <Eye size={16} className="text-brand-500" variant="Bold" />
                  ) : (
                    <EyeSlash size={16} className="text-gray-400" variant="Bold" />
                  )}
                </button>
              }
            />
          </div>
          <div className="grid gap-[6px]">
            <label
              htmlFor="security-update-confirm-password"
              className="text-sm font-medium"
            >
              Confirm Password
            </label>
            <Input
              id="security-update-confirm-password"
              type="password"
              name="confirm-password"
              value={formData.confirmNewPassword}
              onChange={handleFormInputChange("confirmNewPassword")}
              size="large"
              placeholder="Confirm Password"
              className="text-gray-700"
              suffix={
                <Verify
                  size={16}
                  className={`text-brand-500 transition-all ${
                    formData.newPassword &&
                    formData.newPassword === formData.confirmNewPassword
                      ? "opacity-100 rotate-0"
                      : "opacity-0 rotate-45"
                  }`}
                  variant="Bold"
                />
              }
            />
          </div>
          <Button
            type="primary"
            size="large"
            className="font-medium mb-3"
            htmlType="submit"
            loading={userState.status.updateAccount === "pending"}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
}
