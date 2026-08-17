import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import useGoogleAuth from "@/app/hooks/useGoogleAuth";
import { showAlert } from "@/app/redux/features/alertSlice";
import { registerUser, ackEmailRegistration } from "@/app/redux/features/signupSlice";
import { Button, Input, Tooltip } from "antd";
import { Eye, EyeSlash, InfoCircle, Verify } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";
import { SignupUserContext } from "../../../../(pages)/auth/signup/SignupUserProvider";
import AuthDivider from "../../ui/AuthDivider";
import GoogleAuthButton from "../../ui/GoogleAuthButton";
import { saveSignupDraft, readSignupDraft } from "@/app/data/signupDraft";

function NewUserForm() {
  const signupState = useAppSelector((state) => state.signup);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { updateCurrentUser } = useContext(SignupUserContext);
  const {
    authenticateWithGoogle,
    isGoogleAuthenticating,
    showGoogleError,
  } = useGoogleAuth({
    mode: "signup",
    nextPath: "/auth/signup/biodata",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const initialFormState = {
    email: "",
    password: "",
    confirmPassword: "",
  };
  const { formData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  function submitFormData() {
    // Verify email
    if (!isEmail(formData.email)) {
      dispatch(
        showAlert({
          message: "Please enter a valid email.",
          type: "error",
        })
      );
      return;
    }

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

    // Dispatch action to verify email
    dispatch(registerUser(formData));
  }

  useEffect(() => {
    const status = signupState.status.emailRegistration;

    if (status === "rejected") {
      dispatch(
        showAlert({
          message: signupState.error.message || "An error occurred.",
          type: "error",
        })
      );
    }

    if (status === "fulfilled") {
      if (readSignupDraft()?.emailVerified) {
        dispatch(ackEmailRegistration());
        return;
      }

      updateCurrentUser({
        email: formData.email,
      });
      saveSignupDraft({
        email: formData.email,
      });
      dispatch(
        showAlert({
          message: "A verification code has been sent to your email address.",
          type: "success",
        })
      );
      dispatch(ackEmailRegistration());
      router.replace("/auth/signup/verify");
    }
  }, [signupState.status.emailRegistration]);

  return (
    <React.Fragment>
      <form
        className="grid gap-7 w-full max-w-[648px] text-gray-700"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-[6px]">
          <label htmlFor="signup-email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="signup-email"
            size="large"
            placeholder="example@gmail.com"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleFormInputChange("email")}
            className="text-gray-700"
            suffix={
              <Tooltip
                className="text-center"
                title="The entered email address will be verified with a 6-digit verification code"
              >
                <InfoCircle size={16} className="text-gray-400" />
              </Tooltip>
            }
          />
        </div>
        <div className="grid gap-[6px]">
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="signup-password"
            type={showPassword ? "text" : "Password"}
            name="password"
            value={formData.password}
            onChange={handleFormInputChange("password")}
            size="large"
            required
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
            required
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
          loading={signupState.status.emailRegistration === "pending"}
          htmlType="submit"
          onClick={submitFormData}
        >
          Verify Email
        </Button>
      </form>
      <div className="w-full max-w-[648px] mb-8">
        <AuthDivider label="Or continue with" />
        <GoogleAuthButton
          onCredential={authenticateWithGoogle}
          onError={showGoogleError}
          disabled={isGoogleAuthenticating}
        />
      </div>
      <p className="text-xs md:text-sm text-gray-300 font-medium text-center mb-3">
        Already have an account?{" "}
        <Link href={"/auth/login"} className="text-brand-400 hover:underline">
          Sign In
        </Link>
      </p>
    </React.Fragment>
  );
}

export default NewUserForm;
