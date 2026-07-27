import React, { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { verifyOTP } from "@/app/redux/features/signupSlice";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import OTPInput from "react-otp-input";
import VerifyCounter from "../../../../(pages)/auth/signup/(step-1)/verify/components/VerifyCounter";
import { SignupUserContext } from "../../../../(pages)/auth/signup/SignupUserProvider";
import { saveSignupDraft, setSignupNextPath } from "@/app/data/signupDraft";
import { cookieData } from "@/app/data/cookieData";
import Cookies from "js-cookie";

export default function VerifyOTPForm() {
  const router = useRouter();
  const signupState = useAppSelector((state) => state.signup);
  const dispatch = useAppDispatch();
  const { currentUser } = useContext(SignupUserContext);
  const [OTP, setOTP] = useState("");

  async function submitOTP() {
    if (OTP.length < 6) {
      dispatch(
        showAlert({
          message: "Please enter a valid OTP.",
          type: "error",
        })
      );
      return;
    }

    try {
      const result = await dispatch(
        verifyOTP({ email: currentUser.email!, verificationCode: OTP })
      ).unwrap();

      if (result?.token) {
        Cookies.set(cookieData.login.name, result.token, {
          expires: cookieData.login.expiration,
        });
      }

      saveSignupDraft({
        email: currentUser.email,
        emailVerified: true,
      });
      setSignupNextPath("/auth/signup/biodata");

      dispatch(
        showAlert({
          message:
            "Your email has been verified. Set a password to continue your signup.",
          type: "success",
        })
      );
      router.push("/auth/set-password");
    } catch {
      // rejected status handled by the effect below
    }
  }

  useEffect(() => {
    if (signupState.status.emailVerification === "rejected") {
      dispatch(
        showAlert({
          message: signupState.error.message || "Could not verify email.",
          type: "error",
        })
      );
    }
  }, [signupState.status.emailVerification]);

  return (
    <>
      <form
        action=""
        id="signup-otp-form"
        className="[--size:large] flex flex-col gap-7 mb-3"
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
          loading={signupState.status.emailVerification === "pending"}
        >
          Verify
        </Button>
      </form>
      <VerifyCounter />
      <div className="verification-info p-3 md:py-4 md:px-7 ring-1 ring-brand-200 rounded-md bg-brand-25">
        <p className="text-sm text-brand-500 text-center">
          If you did not see the email in your inbox, kindly check your spam folder.
        </p>
      </div>
    </>
  );
}
