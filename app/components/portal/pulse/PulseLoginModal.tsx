"use client";

import AuthDivider from "@/app/components/auth/ui/AuthDivider";
import GoogleAuthButton from "@/app/components/auth/ui/GoogleAuthButton";
import { cookieData } from "@/app/data/cookieData";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import useGoogleAuth from "@/app/hooks/useGoogleAuth";
import { showAlert } from "@/app/redux/features/alertSlice";
import {
  clearUserStatus,
  loginUser,
  validateSession,
} from "@/app/redux/features/userSlice";
import {
  buildSignupHref,
  rememberAuthRedirect,
} from "@/app/utils/authRedirect";
import { Button, Checkbox, Input, Modal, Tooltip } from "antd";
import { CloseCircle, Eye, EyeSlash, InfoCircle } from "iconsax-react";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { isEmail, isEmpty } from "validator";

type PulseLoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** Shown above the form, e.g. "Please log in to like posts." */
  contextMessage?: string;
  /** Where to return after signup / Google login. Defaults to Pulse. */
  redirectTo?: string;
};

const PULSE_PATH = "/pulse";

export default function PulseLoginModal({
  open,
  onClose,
  onSuccess,
  contextMessage,
  redirectTo = PULSE_PATH,
}: PulseLoginModalProps) {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = { email: "", password: "" };
  const { formData, setFormData, handleFormInputChange } =
    useFormHandler<typeof initialFormState>(initialFormState);

  const finishLogin = React.useCallback(() => {
    dispatch(clearUserStatus(["loginUser"]));
    onSuccess();
  }, [dispatch, onSuccess]);

  const {
    authenticateWithGoogle,
    isGoogleAuthenticating,
    showGoogleError,
  } = useGoogleAuth({
    mode: "login",
    successRedirect: redirectTo,
    onLoginSuccess: finishLogin,
  });

  useEffect(() => {
    if (!open) return;
    rememberAuthRedirect(redirectTo);
    setFormData({ email: "", password: "" });
    setShowPassword(false);
    setRememberMe(true);
    setSubmitting(false);
  }, [open, redirectTo, setFormData]);

  async function handleFormSubmit() {
    if (!isEmail(formData.email)) {
      dispatch(
        showAlert({ message: "Please enter a valid email.", type: "error" })
      );
      return;
    }

    if (isEmpty(formData.password.trim())) {
      dispatch(
        showAlert({ message: "Please enter your password.", type: "error" })
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await dispatch(
        loginUser({ ...formData, rememberMe })
      ).unwrap();

      Cookies.set(cookieData.login.name, result.token, {
        expires: rememberMe ? cookieData.login.expiration : undefined,
      });

      await dispatch(validateSession()).unwrap();
      dispatch(showAlert({ message: "Login successful.", type: "success" }));
      finishLogin();
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        userState.error.message ||
        "Login failed. Please try again.";
      dispatch(showAlert({ message, type: "error" }));
      dispatch(clearUserStatus(["loginUser"]));
    } finally {
      setSubmitting(false);
    }
  }

  const busy =
    submitting ||
    isGoogleAuthenticating ||
    userState.status.loginUser === "pending";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={440}
      centered
      destroyOnClose
      zIndex={1100}
      styles={{
        body: {
          padding: 20,
          maxHeight: "min(640px, 85dvh)",
          overflowY: "auto",
        },
      }}
    >
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-league text-xl font-semibold text-gray-800">
              Log in to continue
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {contextMessage ||
                "Sign in to post, like, and comment on Pulse."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Close login"
          >
            <CloseCircle size={24} />
          </button>
        </div>

        <form
          className="grid w-full text-gray-700"
          onSubmit={(e) => {
            e.preventDefault();
            void handleFormSubmit();
          }}
        >
          <div className="mb-4 grid gap-[6px]">
            <label htmlFor="pulse-login-email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="pulse-login-email"
              size="large"
              placeholder="example@gmail.com"
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleFormInputChange("email")}
              className="text-gray-700"
              suffix={
                <Tooltip title="Enter your registered email address.">
                  <InfoCircle size={16} className="text-gray-400" />
                </Tooltip>
              }
            />
          </div>

          <div className="mb-3 grid gap-[6px]">
            <label
              htmlFor="pulse-login-password"
              className="text-sm font-medium"
            >
              Password
            </label>
            <Input
              id="pulse-login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleFormInputChange("password")}
              size="large"
              placeholder="Enter Password"
              className="text-gray-700"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye size={16} className="text-brand-500" variant="Bold" />
                  ) : (
                    <EyeSlash
                      size={16}
                      className="text-gray-400"
                      variant="Bold"
                    />
                  )}
                </button>
              }
            />
          </div>

          <div className="mb-5 flex items-center justify-between text-xs sm:text-sm">
            <label className="flex items-center gap-2 text-gray-500">
              <Checkbox
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-brand-400 hover:underline"
              onClick={onClose}
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="primary"
            size="large"
            className="mb-3 font-medium"
            htmlType="submit"
            loading={busy}
          >
            Login
          </Button>
        </form>

        <div>
          <AuthDivider label="Or continue with" />
          <GoogleAuthButton
            onCredential={authenticateWithGoogle}
            onError={showGoogleError}
            disabled={busy}
          />
        </div>

        <p className="text-center text-xs font-medium text-gray-400 sm:text-sm">
          Are you new here?{" "}
          <Link
            href={buildSignupHref(redirectTo)}
            className="text-brand-400 hover:underline"
            onClick={onClose}
          >
            Create an account
          </Link>
        </p>
      </div>
    </Modal>
  );
}
