"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { resetPassword } from "@/app/redux/features/userSlice";
import { Button, Input } from "antd";
import exp from "constants";
import { Eye, EyeSlash, Verify } from "iconsax-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { isStrongPassword } from "validator";

function ResetPassword() {
  const userState = useAppSelector((state) => state.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const initialFormState = {
    password: "",
    confirmPassword: "",
  };
  const { formData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  const handleFormSubmit = () => {
    // Verify strong password
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

    // Verify that passwords match
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
      resetPassword({
        password: formData.password,
        token: searchParams.get("token") || "",
      })
    );
  };

  useEffect(() => {
    if (userState.status.resetPassword === "rejected") {
      dispatch(showAlert({ message: userState.error.message!, type: "error" }));
    }
    if (userState.status.resetPassword === "fulfilled") {
      dispatch(
        showAlert({
          message: "Password reset successfully, Please log in.",
          type: "success",
        })
      );
      router.push("/auth/login");
    }
  }, [userState.status.resetPassword]);

  return (
    <>
      <h2 className="font-league font-semibold text-gray-700 text-xl md:text-display-base mb-2 md:mb-0 text-center">
        Create a new password
      </h2>
      <p className="max-w-[480px] text-center text-sm text-gray-500 mb-8 md:mb-12">
        Thank you for verifying your account. Choose a new strong password to secure your
        access.
      </p>
      <form
        action=""
        className="grid gap-7 w-full max-w-[648px] text-gray-700"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-[6px]">
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleFormInputChange("password")}
            size="large"
            placeholder="Enter Password"
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
          <label htmlFor="signup-confirm-password" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="signup-confirm-password"
            type="password"
            name="confirm-password"
            value={formData.confirmPassword}
            onChange={handleFormInputChange("confirmPassword")}
            size="large"
            placeholder="Confirm Password"
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
          loading={userState.status.resetPassword === "pending"}
        >
          Reset Password
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordSuspense() {
  return (
    <React.Suspense fallback={null}>
      <ResetPassword />
    </React.Suspense>
  );
}
