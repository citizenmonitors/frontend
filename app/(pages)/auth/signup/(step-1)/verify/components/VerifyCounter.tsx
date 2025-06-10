import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { resendVerificationToken } from "@/app/redux/features/signupSlice";
import React, { useContext, useEffect, useState } from "react";
import { SignupUserContext } from "../../../SignupUserProvider";

type VerifyCounterProps = {
  onResendCode?: () => any;
};
export default function VerifyCounter({ onResendCode }: VerifyCounterProps) {
  const signupState = useAppSelector((state) => state.signup);
  const dispatch = useAppDispatch();
  const [OTPResendTimer, setOTPResendTimer] = useState(59);
  const { currentUser } = useContext(SignupUserContext);

  useEffect(() => {
    if (OTPResendTimer > 0) {
      const timer = setTimeout(() => {
        setOTPResendTimer(OTPResendTimer - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [OTPResendTimer]);

  function resendOTP() {
    if (OTPResendTimer === 0) {
      dispatch(
        showAlert({
          message: "A verification code has been re-sent to your email address.",
          type: "success",
        })
      );
      if (onResendCode) onResendCode();
      else dispatch(resendVerificationToken({ email: currentUser.email! }));
      setOTPResendTimer(59);
    }
  }

  return (
    <p className="text-gray-500 text-sm text-center mb-12">
      Didn't recieve the OTP?{" "}
      <button className="text-brand-400 hover:underline" onClick={resendOTP}>
        Resend OTP
      </button>
      {OTPResendTimer > 0 ? ` in ${OTPResendTimer}s` : ""}
    </p>
  );
}
