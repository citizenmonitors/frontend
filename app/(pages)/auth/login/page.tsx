"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import useGoogleAuth from "@/app/hooks/useGoogleAuth";
import useSessionValidate from "@/app/hooks/useSessionValidate";
import AuthDivider from "@/app/components/auth/ui/AuthDivider";
import GoogleAuthButton from "@/app/components/auth/ui/GoogleAuthButton";
import { showAlert } from "@/app/redux/features/alertSlice";
import { loginUser, refreshUser } from "@/app/redux/features/userSlice";
import {
  buildSignupHref,
  consumeAuthRedirect,
  getPostLoginPath,
  getSafeRedirectPath,
  peekAuthRedirect,
  rememberAuthRedirect,
} from "@/app/utils/authRedirect";
import { Button, Checkbox, Input, Tooltip } from "antd";
import { Eye, EyeSlash, InfoCircle } from "iconsax-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { isEmpty, isEmail } from "validator";

function Login() {
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details;
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const preferredRedirect = useMemo(
    () => getSafeRedirectPath(redirectParam),
    [redirectParam]
  );

  useEffect(() => {
    rememberAuthRedirect(preferredRedirect);
  }, [preferredRedirect]);

  const sessionRedirect = getPostLoginPath(
    userDetails?.role,
    preferredRedirect
  );

  useSessionValidate({
    success: {
      redirect: sessionRedirect,
      alert: {
        message: "Logged in.",
        type: "success",
      },
    },
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    authenticateWithGoogle,
    isGoogleAuthenticating,
    showGoogleError,
  } = useGoogleAuth({
    mode: "login",
    successRedirect: preferredRedirect,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const initialFormState = {
    email: "",
    password: "",
  };
  const { formData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  function handleFormSubmit() {
    if (!isEmail(formData.email)) {
      dispatch(
        showAlert({
          message: "Please enter a valid email.",
          type: "error",
        })
      );
      return;
    }

    if (isEmpty(formData.password.trim())) {
      dispatch(
        showAlert({
          message: "Please enter your password.",
          type: "error",
        })
      );
      return;
    }

    dispatch(loginUser({ ...formData, rememberMe }));
  }

  useEffect(() => {
    const status = userState.status.loginUser;

    if (status === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message!,
          type: "error",
        })
      );
    } else if (status === "fulfilled") {
      dispatch(
        showAlert({
          message: "Login successful.",
          type: "success",
        })
      );
      dispatch(refreshUser());
      const next = userState.isAdmin
        ? "/admin/dashboard"
        : preferredRedirect || peekAuthRedirect() || "/portal/dashboard";
      consumeAuthRedirect();
      router.replace(next);
    }
  }, [userState.status.loginUser]);

  return (
    <React.Fragment>
      <h2 className="font-league font-semibold text-gray-700 text-xl md:text-display-base mb-6">
        Welcome Back!
      </h2>
      {preferredRedirect === "/pulse" ? (
        <p className="mb-5 -mt-2 text-sm text-gray-500 text-center md:text-left">
          Sign in to post, like, and comment on Pulse.
        </p>
      ) : null}
      <form
        action=""
        className="grid w-full max-w-[648px] text-gray-700"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-[6px] mb-7">
          <label htmlFor="login-email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="login-email"
            size="large"
            placeholder="example@gmail.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormInputChange("email")}
            className="text-gray-700"
            suffix={
              <Tooltip
                className="text-center"
                title="Enter your registered email address."
              >
                <InfoCircle size={16} className="text-gray-400" />
              </Tooltip>
            }
          />
        </div>
        <div className="grid gap-[6px] mb-3">
          <label htmlFor="login-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="login-password"
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
        <div className="extra-details flex justify-between text-xs md:text-sm mb-7">
          <div className="remember-me flex items-center gap-2 text-gray-500">
            <Checkbox
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            Remember me
          </div>
          <Link href={"/auth/forgot-password"} className="text-brand-400 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button
          type="primary"
          size="large"
          className="font-medium mb-3"
          htmlType="submit"
          onClick={handleFormSubmit}
          loading={userState.status.loginUser === "pending"}
        >
          Login
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
        Are you new here?{" "}
        <Link
          href={buildSignupHref(preferredRedirect)}
          className="text-brand-400 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </React.Fragment>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <Login />
    </React.Suspense>
  );
}
