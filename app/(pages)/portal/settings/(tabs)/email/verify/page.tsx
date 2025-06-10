"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useProtectRoute from "@/app/hooks/useProtectRoute";
import { showAlert } from "@/app/redux/features/alertSlice";
import { verifyOTP } from "@/app/redux/features/signupSlice";
import { Button } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import {
  resendEmailUpdateToken,
  verifyEmailUpdate,
} from "@/app/redux/features/userSlice";
import useLogout from "@/app/hooks/useLogout";
import VerifyCounter from "@/app/(pages)/auth/signup/(step-1)/verify/components/VerifyCounter";

function Verification() {
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const logout = useLogout();
  const searchParams = useSearchParams();

  useProtectRoute(
    searchParams.get("email"),
    "/portal/settings/email",
    "Please choose a new email first."
  );

  const [OTP, setOTP] = useState("");

  // handle form submission
  function submitOTP() {
    if (OTP.length < 6) {
      dispatch(
        showAlert({
          message: "Please enter a valid OTP.",
          type: "error",
        })
      );
      return;
    }

    dispatch(
      verifyEmailUpdate({ newEmail: searchParams.get("email")!, verificationCode: OTP })
    );
  }

  useEffect(() => {
    const status = userState.status.verifyEmailUpdate;

    if (status === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message!,
          type: "error",
        })
      );
    }

    if (status === "fulfilled") {
      dispatch(
        showAlert({
          message: "Email verified and updated successfully. Please log in.",
          type: "success",
        })
      );
      logout();
    }
  }, [userState.status.verifyEmailUpdate]);

  return (
    <React.Fragment>
      <SettingsHeader>Verify Email.</SettingsHeader>
      <div
        id="settings-email-otp"
        className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[736px] mx-auto"
      >
        <h3 className="font-league text-xl md:text-display-xs lg:text-display-sm text-brand-500 text-center font-semibold mb-1 leading-tight">
          Verify your new email address.
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8 max-w-screen-xs mx-auto">
          An OTP code has been sent to {searchParams.get("email")}. Enter the six-digit
          OTP below to verify your account.
        </p>
        <form
          action=""
          id="settings-email-otp-form"
          className="[--size:large] flex flex-col items-center gap-7 mb-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <OTPInput
            value={OTP}
            onChange={(currOTP) => setOTP(currOTP)}
            numInputs={6}
            inputType="number"
            containerStyle={{ gap: ".5rem" }}
            inputStyle={{}}
            renderInput={(props) => <input {...props} id="otp-input" />}
          />
          <Button
            type="primary"
            block
            size="large"
            htmlType="submit"
            onClick={submitOTP}
            loading={userState.status.verifyEmailUpdate === "pending"}
          >
            Verify
          </Button>
        </form>
        <VerifyCounter
          onResendCode={() =>
            dispatch(resendEmailUpdateToken({ email: userState.details!.email }))
          }
        />
        <div className="verification-info p-3 md:py-4 md:px-7 ring-1 ring-brand-200 rounded-md bg-brand-25">
          <p className="text-sm text-brand-500 text-center">
            If you did not see the email in your inbox, kindly check your spam folder.
          </p>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Verification;
