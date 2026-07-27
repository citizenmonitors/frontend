"use client";

import { cookieData } from "@/app/data/cookieData";
import {
  consumeSignupNextPath,
  peekSignupNextPath,
  saveSignupDraft,
} from "@/app/data/signupDraft";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { setPassword } from "@/app/redux/features/userSlice";
import { Button, Input } from "antd";
import { Eye, EyeSlash, Verify } from "iconsax-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { isStrongPassword } from "validator";

function SetPassword() {
  const userState = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const initialFormState = {
    password: "",
    confirmPassword: "",
  };
  const { formData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  useEffect(() => {
    if (Cookies.get(cookieData.login.name)) return;

    const signupNextPath = peekSignupNextPath();
    dispatch(
      showAlert({
        message: signupNextPath
          ? "Please verify your email again to continue setting your password."
          : "Please sign in before setting a password.",
        type: "warning",
      })
    );
    router.replace(signupNextPath ? "/auth/signup" : "/auth/login");
  }, [dispatch, router]);

  const handleFormSubmit = () => {
    if (
      !isStrongPassword(formData.password.trim(), { minUppercase: 0, minLowercase: 0 })
    ) {
      dispatch(
        showAlert({
          message:
            "Password must contain at least 8 characters, one number, and one symbol.",
          type: "error",
        })
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      dispatch(
        showAlert({
          message: "Passwords do not match.",
          type: "error",
        })
      );
      return;
    }

    dispatch(
      setPassword({
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    );
  };

  useEffect(() => {
    if (userState.status.setPassword === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message || "Could not set password.",
          type: "error",
        })
      );
    }

    if (userState.status.setPassword === "fulfilled") {
      const nextPath = consumeSignupNextPath() || "/auth/signup/biodata";
      saveSignupDraft({ passwordSet: true });

      dispatch(
        showAlert({
          message: "Password has been set. Continue with your biodata.",
          type: "success",
        })
      );
      router.replace(nextPath);
    }
  }, [userState.status.setPassword]);

  return (
    <>
      <h2 className="font-league font-semibold text-gray-700 text-xl md:text-display-base mb-2 md:mb-0 text-center">
        Set Password
      </h2>
      <p className="max-w-[480px] text-center text-sm text-gray-500 mb-8 md:mb-12">
        Create a password so you can also sign in with your email next time.
      </p>
      <form
        action=""
        className="grid gap-7 w-full max-w-[648px] text-gray-700"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-[6px]">
          <label htmlFor="set-password" className="text-sm font-medium">
            Set Password
          </label>
          <Input
            id="set-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleFormInputChange("password")}
            size="large"
            placeholder="Your password"
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
          <label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirm-password"
            type="password"
            name="confirm-password"
            value={formData.confirmPassword}
            onChange={handleFormInputChange("confirmPassword")}
            size="large"
            placeholder="Re-enter your password"
            className="text-gray-700"
            suffix={
              <Verify
                size={16}
                className={`text-brand-500 transition-all ${
                  formData.password && formData.password === formData.confirmPassword
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
          onClick={handleFormSubmit}
          loading={userState.status.setPassword === "pending"}
        >
          Set Password
        </Button>
      </form>
    </>
  );
}

export default SetPassword;
