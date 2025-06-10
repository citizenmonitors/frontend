"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { showAlert } from "@/app/redux/features/alertSlice";
import { sendPasswordResetEmail } from "@/app/redux/features/userSlice";
import { Button, Input } from "antd";
import { Verify } from "iconsax-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";
import isEmail from "validator/lib/isEmail";

function ForgotPassword() {
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const initialFormState = {
    email: "",
  };
  const { formData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  const handleFormSubmit = () => {
    if (!isEmail(formData.email)) {
      dispatch(showAlert({ message: "Please enter a valid email.", type: "error" }));
      return;
    }

    dispatch(sendPasswordResetEmail(formData));
  };

  useEffect(() => {
    if (userState.status.forgotPassword === "rejected") {
      dispatch(showAlert({ message: userState.error.message!, type: "error" }));
    }
    if (userState.status.forgotPassword === "fulfilled") {
      dispatch(showAlert({ message: "Password reset link sent.", type: "success" }));
    }
  }, [userState.status.forgotPassword]);

  return (
    <>
      <h2 className="font-league font-semibold text-gray-700 text-xl md:text-display-base mb-2 md:mb-0 text-center">
        Input your email address
      </h2>
      <p className="max-w-[480px] text-center text-sm text-gray-500 mb-8 md:mb-12">
        Enter the email address associated with your account and we'll send you a link to
        reset your password.
      </p>
      <form
        action=""
        className="grid gap-7 w-full max-w-[648px] text-gray-700"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-[6px]">
          <label htmlFor="pr-email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="pr-email"
            size="large"
            placeholder="example@gmail.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormInputChange("email")}
            className="text-gray-700"
            suffix={<Verify size={16} className="text-brand-500" variant="Bold" />}
          />
        </div>
        <Button
          type="primary"
          size="large"
          className="font-medium mb-3"
          htmlType="submit"
          onClick={handleFormSubmit}
          loading={userState.status.forgotPassword === "pending"}
        >
          Reset Password
        </Button>
      </form>
    </>
  );
}

export default ForgotPassword;
