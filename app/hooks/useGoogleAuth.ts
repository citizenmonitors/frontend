import { cookieData } from "@/app/data/cookieData";
import {
  authenticateWithGoogleIdToken,
  decodeGoogleIdTokenEmail,
  saveGoogleSignupDraft,
} from "@/app/data/googleAuth";
import { setSignupNextPath } from "@/app/data/signupDraft";
import { showAlert } from "@/app/redux/features/alertSlice";
import { validateSession } from "@/app/redux/features/userSlice";
import {
  buildLoginHref,
  getPostLoginPath,
  getSafeRedirectPath,
  consumeAuthRedirect,
} from "@/app/utils/authRedirect";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAppDispatch } from "./redux";

type UseGoogleAuthOptions = {
  nextPath?: string;
  mode?: "login" | "signup";
  /** Where to send the user after a successful login (non-admin) */
  successRedirect?: string | null;
};

function getErrorMessage(error: any): string {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Google sign-in failed. Please try again."
  );
}

function isAlreadyRegisteredError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("already registered") ||
    normalized.includes("already exist") ||
    (normalized.includes("already") && normalized.includes("account"))
  );
}

export default function useGoogleAuth(options: UseGoogleAuthOptions = {}) {
  const { nextPath, mode = "login", successRedirect } = options;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false);

  const showGoogleError = useCallback(
    (message: string) => {
      dispatch(showAlert({ message, type: "error" }));
    },
    [dispatch]
  );

  const authenticateWithGoogle = useCallback(
    async (idToken: string) => {
      setIsGoogleAuthenticating(true);

      try {
        const response = await authenticateWithGoogleIdToken(idToken, { mode });
        Cookies.set(cookieData.login.name, response.token, {
          expires: cookieData.login.expiration,
        });

        const email =
          response.user?.email || decodeGoogleIdTokenEmail(idToken) || undefined;

        if (mode === "signup") {
          saveGoogleSignupDraft({
            email,
            firstName: response.user?.firstName,
            lastName: response.user?.lastName,
            emailVerified: true,
          });
          if (nextPath) {
            setSignupNextPath(nextPath);
          }
        }

        if (
          response.requiresPasswordSetup ||
          response.nextStep === "set_password"
        ) {
          dispatch(
            showAlert({
              message:
                mode === "signup"
                  ? "Google account connected. Set a password to continue signup."
                  : "Signed in with Google. Set a password to continue.",
              type: "success",
            })
          );
          router.replace("/auth/set-password");
          return;
        }

        if (mode === "signup" && nextPath) {
          saveGoogleSignupDraft({ passwordSet: true });
          dispatch(
            showAlert({
              message: "Google account connected. Continue with your biodata.",
              type: "success",
            })
          );
          router.replace(nextPath);
          return;
        }

        const session = await dispatch(validateSession()).unwrap();
        const role = session.user?.user?.role;
        dispatch(showAlert({ message: "Signed in with Google.", type: "success" }));
        const next = getPostLoginPath(role, successRedirect);
        consumeAuthRedirect();
        router.replace(next);
      } catch (error: any) {
        const message = getErrorMessage(error);

        if (isAlreadyRegisteredError(message)) {
          if (mode === "signup") {
            dispatch(
              showAlert({
                message:
                  "This Google email already has an account. Please sign in with Google or your email and password.",
                type: "info",
              })
            );
            router.replace(buildLoginHref(getSafeRedirectPath(successRedirect)));
            return;
          }

          // Login page: account exists (often created with email/password).
          // Backend rejected Google auth instead of issuing a session token.
          showGoogleError(
            "This email already has an account. Please sign in with your email and password. Google sign-in works for accounts created with Google."
          );
          return;
        }

        showGoogleError(message);
      } finally {
        setIsGoogleAuthenticating(false);
      }
    },
    [dispatch, mode, nextPath, router, showGoogleError, successRedirect]
  );

  return {
    authenticateWithGoogle,
    isGoogleAuthenticating,
    showGoogleError,
  };
}
